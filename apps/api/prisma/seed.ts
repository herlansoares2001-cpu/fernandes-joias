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

    parser.on('readable', () => {
      let record;
      while ((record = parser.read()) !== null) {
        // Skip non-products or drafts ONLY if record.type exists (backward compatibility)
        if (record.type && (record.type !== 'product' || record.status !== 'publish')) {
          continue;
        }

        const name = record['Nome do Produto'] || record['title/rendered'] || record['title'] || 'Unnamed Product';
        const slug = record['Slug'] || record['slug'] || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const description = record['Descrição Limpa'] || record['Descrição Bruta'] || record['content/rendered'] || record['content'] || '';
        const imageUrl = record['URL da Imagem'] || record['yoast_head_json/og_image/0/url'] || null;

        const nameLower = name.toLowerCase();
        let basePrice = 119.90;
        if (nameLower.includes('anel')) {
          basePrice = 159.90;
        } else if (nameLower.includes('colar') || nameLower.includes('escapulário') || nameLower.includes('gargantilha')) {
          basePrice = 189.90;
        } else if (nameLower.includes('pulseira')) {
          basePrice = 149.90;
        } else if (nameLower.includes('brinco') || nameLower.includes('trio') || nameLower.includes('argola')) {
          basePrice = 89.90;
        } else if (nameLower.includes('pingente') || nameLower.includes('medalha') || nameLower.includes('berloque')) {
          basePrice = 79.90;
        }

        batch.push({
          slug: slug,
          name: name,
          description: description,
          basePrice: basePrice,
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
          const createdProduct = await prisma.product.upsert({
            where: { slug: item.slug },
            update: {
              name: item.name,
              description: item.description,
              basePrice: item.basePrice,
              certificationUrl: item.certificationUrl,
              isActive: true,
            },
            create: item,
          });

          // Verify if variant already exists
          const existingVariant = await prisma.variant.findFirst({
            where: { productId: createdProduct.id },
          });

          if (!existingVariant) {
            await prisma.variant.create({
              data: {
                sku: `def-${item.slug}`.slice(0, 90),
                productId: createdProduct.id,
                size: 'Único',
                priceAdjustment: 0.00,
                weightGrams: 1.5,
              }
            });
          }
        } catch (e: any) {
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
