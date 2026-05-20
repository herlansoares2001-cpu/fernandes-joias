export interface Variant {
  id: string;
  sku: string;
  size: string;
  priceAdjustment: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  certificationUrl: string | null;
  variants: Variant[];
}
