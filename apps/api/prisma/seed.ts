import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function processCSV(filePath: string) {
  return new Promise<void>((resolve, reject) => {
    const parser = fs
      .createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true, relax_quotes: true, relax_column_count: true }));

    const batch: any[] = [];

    parser.on('readable', async () => {
      let record;
      while ((record = parser.read()) !== null) {
        if (record.type !== 'product' || record.status !== 'publish') {
          continue; // Skip non-products or drafts
        }

        const name = record['title/rendered'] || record['title'] || 'Unnamed Product';
        const slug = record['slug'] || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const description = record['content/rendered'] || record['content'] || '';
        const imageUrl = record['yoast_head_json/og_image/0/url'] || null;

        // Ensure we don't duplicate slugs
        batch.push({
          slug: slug,
          name: name,
          description: description,
          basePrice: 1500.00, // Fake base price for now as WooCommerce price meta is missing in default export
          certificationUrl: imageUrl,
          isActive: true,
        });
      }
    });

    parser.on('error', (err) => reject(err));
    
    parser.on('end', async () => {
      console.log(`Processing ${batch.length} products from ${filePath}...`);
      for (const item of batch) {
        try {
          await prisma.product.upsert({
            where: { slug: item.slug },
            update: {},
            create: item,
          });
        } catch (e) {
          console.warn(`Failed to seed product ${item.slug}:`, e.message);
        }
      }
      resolve();
    });
  });
}

async function main() {
  const catalogDir = path.resolve(__dirname, '../../../catalogo');
  const files = fs.readdirSync(catalogDir).filter(f => f.endsWith('.csv'));

  console.log(`Found ${files.length} CSV files to process.`);

  for (const file of files) {
    const fullPath = path.join(catalogDir, file);
    console.log(`Seeding from ${file}...`);
    await processCSV(fullPath);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
