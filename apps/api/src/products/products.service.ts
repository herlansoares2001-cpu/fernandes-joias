import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Variant } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: { variants: true },
    });
  }

  async findOne(slug: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          include: { inventory: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    return product;
  }

  async calculateCustomEngraving(sku: string, text: string): Promise<number> {
    const variant = await this.prisma.variant.findUnique({
      where: { sku },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with sku ${sku} not found`);
    }

    // Example logic: $10 per character for engraving
    const costPerChar = 10;
    const engravingCost = text.length * costPerChar;
    
    return Number(variant.product.basePrice) + Number(variant.priceAdjustment) + engravingCost;
  }
}
