import { notFound } from 'next/navigation';
import ProductDetails from '../../../components/templates/ProductDetails';

interface Variant {
  id: string;
  sku: string;
  size: string;
  priceAdjustment: number;
  inventory?: {
    quantityAvailable: number;
    quantityReserved: number;
  } | null;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  certificationUrl: string | null;
  variants: Variant[];
}

// Revalidate every 10 seconds for stock/price fresh state (ISR)
export const revalidate = 10;

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:3002/api/v1/products/${slug}`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
}

// Allow fallback dynamic rendering if not pre-rendered
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await fetch('http://localhost:3002/api/v1/products');
    if (!res.ok) return [];
    const products: Product[] = await res.json();
    return products.slice(0, 10).map((p) => ({
      slug: p.slug,
    }));
  } catch (error) {
    console.error('Failed to pre-render static params:', error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
