import { Exclude, Expose, Transform } from 'class-transformer';

export class VariantResponseDto {
  @Expose() sku: string;
  @Expose() size: string | null;

  @Expose()
  @Transform(({ value }) => value ? Number(value) : 0)
  priceAdjustment: number;

  @Expose() weightGrams: number | null;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.inventory) {
      // Expose availability as boolean, never raw stock quantities (FALHA 5 security requirement)
      return (obj.inventory.quantityAvailable ?? 0) > 0;
    }
    return true;
  })
  inStock: boolean;

  @Exclude() inventory: any;
  @Exclude() productId: string;
  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;
}

export class ProductResponseDto {
  @Expose() id: string;
  @Expose() slug: string;
  @Expose() name: string;
  @Expose() description: string | null;

  @Expose()
  @Transform(({ value }) => Number(value))
  basePrice: number;

  @Expose() metalType: string | null;
  @Expose() gemstone: string | null;
  @Expose() certificationUrl: string | null;
  @Expose() variants: VariantResponseDto[];

  @Exclude() isActive: boolean;
  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;
}
