import { Suspense } from 'react';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import Marquee from '../components/home/Marquee';
import { EditorialOne, EditorialTwo } from '../components/home/EditorialBlock';
import ProductGrid from '../components/product/ProductGrid';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import type { Product } from '../types';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:3002/api/v1/products', {
      next: { revalidate: 10 },
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error('Error fetching products from API, returning fallbacks:', error);
    // Real WooCommerce products from the brand catalog as fallback
    return [
      {
        id: '1',
        slug: 'escapulario-plaquinha-cruz-e-coracao',
        name: 'Escapulário Plaquha Cruz e Coração',
        description: 'Escapulário clássico com plaquinhas de cruz e coração em Prata 925 com corrente veneziana de 60 cm. Elegância discreta e proteção para o dia a dia.',
        basePrice: 189.90,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2022/12/thumbnail_122BF5DD-A2FA-45EA-B39D-3C7A5A05FAA3.jpg',
        variants: [],
      },
      {
        id: '2',
        slug: 'pingente-personalizavel-letrinha-data',
        name: 'Pingente Personalizável Letrinha + Data',
        description: 'Pingente medalha de 15mm em Prata 925. Personalize com a inicial e data mais importantes da sua história. Detalhe minimalista com significado profundo.',
        basePrice: 129.90,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2022/11/thumbnail_37881932-2E52-4D4D-AE69-792769E13101.jpg',
        variants: [],
      },
      {
        id: '3',
        slug: 'pulseira-plaquinha-olhos',
        name: 'Pulseira Plaquha Olhos',
        description: 'Pulseira clássica em Prata 925 com plaquinha com design de olhos. Comprimento de 16cm. Joia delicada com acabamento impecável.',
        basePrice: 149.90,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2024/02/WhatsApp-Image-2025-03-19-at-21.23.243.jpeg',
        variants: [],
      },
      {
        id: '4',
        slug: 'pingentes-encaixe-coracao-digital-o-amor-tudo-sofre-tudo-crer',
        name: 'Pingentes Encaixe Coração Digital',
        description: 'Pingentes em par com encaixe perfeito de coração digital e a gravação eterna "O Amor Tudo Sofre, Tudo Crê". Prata 925 pura.',
        basePrice: 249.90,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2025/05/a6ffef48-6216-42ba-937a-f8ee36ef3537.jpg',
        variants: [],
      },
      {
        id: '5',
        slug: 'pulseira-cartier-pingente-foto-coracaozinho',
        name: 'Pulseira Cartier Pingente Foto',
        description: 'Pulseira com elos estilo Cartier em Prata 925, acompanhada de pingente relicário para foto e mini coração pendurado. Uma recordação preciosa.',
        basePrice: 199.90,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2025/04/b7e8b64e-e650-4c5d-8993-30665232beee.jpg',
        variants: [],
      },
      {
        id: '6',
        slug: 'anel-coracao-personalizado',
        name: 'Anel Coração Personalizado',
        description: 'Anel clássico em Prata 925 com formato de coração personalizado. Elegante, minimalista e confortável para uso cotidiano.',
        basePrice: 159.90,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2022/12/5C808BF4-BF05-46D9-8971-55866113A331-scaled.jpeg',
        variants: [],
      },
      {
        id: '7',
        slug: 'pulseira-iniciais-com-coracao',
        name: 'Pulseira Iniciais com Coração',
        description: 'Pulseira com corrente de 16cm em Prata 925 e medalha de 13mm gravada com suas iniciais e um coração. Delicadeza sob medida.',
        basePrice: 139.90,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-04-at-18.15.29.jpeg',
        variants: [],
      },
      {
        id: '8',
        slug: 'anel-medalha-inicial',
        name: 'Anel Medalha Inicial',
        description: 'Anel de aro liso com pingente de medalhinha gravada com inicial em Prata 925. Um toque de movimento e elegância clássica para as mãos.',
        basePrice: 119.90,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-18-at-16.48.39.jpeg',
        variants: [],
      }
    ];
  }
}

export default async function Page() {
  const products = await getProducts();

  const ornament = (
    <div className="ornament">
      <div className="ornament-line"></div>
      <div className="ornament-diamond"></div>
      <div className="ornament-line"></div>
    </div>
  );

  return (
    <>
      <Hero />
      
      {ornament}

      <Suspense fallback={<div className="py-24 text-center text-[#EDE6D6]/40 uppercase tracking-widest text-[10px]">Carregando universo...</div>}>
        <Categories />
      </Suspense>

      <Marquee />

      <EditorialOne />

      <Suspense fallback={<div className="py-24 text-center text-[#EDE6D6]/40 uppercase tracking-widest text-[10px]">Carregando acervo...</div>}>
        <ProductGrid initialProducts={products} />
      </Suspense>

      <EditorialTwo />

      {ornament}

      <Testimonials />

      <Newsletter />
    </>
  );
}
