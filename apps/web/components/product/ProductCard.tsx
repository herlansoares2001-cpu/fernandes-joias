'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Local IntersectionObserver to trigger the editorial reveal fade-in animation
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Simulating badge logic based on product properties
  const isNew = product.slug.includes('coracao') || product.slug.includes('bts');
  const isBestSeller = product.slug.includes('medalha') || product.slug.includes('olhos');

  return (
    <div ref={cardRef} className={`prod-card reveal ${isInView ? 'visible' : ''}`}>
      <div className="prod-img-wrap">
        {product.certificationUrl ? (
          <img
            src={product.certificationUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1E1C18]">
            <span className="text-[10px] tracking-widest text-[#EDE6D6]/40 uppercase font-light">Coleção Fernandes</span>
          </div>
        )}
        
        {isNew && <div className="prod-badge">Novo</div>}
        {isBestSeller && !isNew && <div className="prod-badge">Best Seller</div>}

        <div className="prod-actions">
          <Link href={`/product/${product.slug}`} className="prod-btn prod-btn-main">
            Ver Detalhes
          </Link>
          <button className="prod-btn prod-btn-wish">
            Lista de Desejos
          </button>
        </div>
      </div>

      <div className="prod-info">
        <h4 className="prod-brand">Atelier Fernandes</h4>
        <h3 className="prod-name">
          <Link href={`/product/${product.slug}`} className="hover:text-[#C9A84C] transition-colors">
            {product.name}
          </Link>
        </h3>
        <div className="prod-price-row">
          <span className="prod-price">
            R$ {product.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="prod-stars">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="text-[#C9A84C] fill-[#C9A84C]" style={{ width: '10px', height: '10px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
