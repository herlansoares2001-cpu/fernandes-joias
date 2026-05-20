import { Suspense } from 'react';
import CatalogClient from '../../components/product/CatalogClient';
import type { Product } from '../../types';

// Revalidate every 10 seconds for stock/price fresh state (ISR)
export const revalidate = 10;

async function getProducts(): Promise<Product[]> {
  const urls = [
    'http://127.0.0.1:3002/api/v1/products',
    'http://localhost:3002/api/v1/products'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 10 },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error);
    }
  }

  console.error('Error fetching products for catalog API, returning fallbacks:');
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
      },
      {
        id: '9',
        slug: 'pingente-patinha',
        name: 'Pingente Patinha',
        description: 'Afeto e presença com o pet de forma discreta, elegante e atemporal em Prata 925 com acabamento chapado cortado a laser.',
        basePrice: 89.90,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2026/01/colar-patinha-peca.png',
        variants: [],
      },
      {
        id: '10',
        slug: 'pingente-por-do-sol',
        name: 'Pingente Pôr do Sol',
        description: 'Inspirado no momento em que o dia desacelera. Um design circular em Prata 925 pura com gravação delicada.',
        basePrice: 95.00,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2026/01/por-do-sol-peca.png',
        variants: [],
      },
      {
        id: '11',
        slug: 'brinco-borboleta-origami-grande',
        name: 'Brinco Borboleta Origami - Grande',
        description: 'Par de brincos de tarracha com formato de borboleta de origami estilizado em Prata 925 legítima.',
        basePrice: 69.90,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2024/10/IMG_2214-scaled.jpg',
        variants: [],
      },
      {
        id: '12',
        slug: 'trio-de-brinco-perola',
        name: 'Trio de Brinco - Pérola',
        description: 'Trio de brincos clássicos com pérola natural selecionada e base firme em Prata 925.',
        basePrice: 109.90,
        certificationUrl: 'https://useupvix.com.br/wp-content/uploads/2024/10/IMG_2213-scaled.jpg',
        variants: [],
      }
    ];
}

function CatalogSkeleton() {
  return (
    <div className="bg-[#070707] min-h-screen pt-32 pb-24 text-center">
      <span className="text-[9px] tracking-[0.45em] uppercase text-[#C9A84C] font-semibold animate-pulse">
        Carregando o Acervo Fernandes...
      </span>
    </div>
  );
}

export default async function CatalogPage() {
  const products = await getProducts();
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogClient initialProducts={products} />
    </Suspense>
  );
}
