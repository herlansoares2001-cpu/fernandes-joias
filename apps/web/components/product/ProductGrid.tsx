'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '../../types';

interface ProductGridProps {
  initialProducts: Product[];
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAllProducts, setShowAllProducts] = useState(false);

  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'Todos';

  const handleCategorySelect = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'Todos') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`/?${params.toString()}#catalog`, { scroll: false });
  };

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedCategory === 'Todos') return matchesSearch;
      if (selectedCategory === 'Anéis') {
        return matchesSearch && (product.name.toLowerCase().includes('anel') || product.name.toLowerCase().includes('aliança'));
      }
      if (selectedCategory === 'Colares') {
        return matchesSearch && (product.name.toLowerCase().includes('colar') || product.name.toLowerCase().includes('pingente') || product.name.toLowerCase().includes('escapulário'));
      }
      if (selectedCategory === 'Pulseiras') {
        return matchesSearch && product.name.toLowerCase().includes('pulseira');
      }
      return matchesSearch;
    });
  }, [initialProducts, searchQuery, selectedCategory]);

  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 8);

  return (
    <section id="catalog" className="products">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Section Header */}
        <div className="sec-header reveal">
          <span className="sec-tag">Gabinete de Curiosidades</span>
          <h2 className="sec-title">Peças <em>Exclusivas</em></h2>
          <p className="sec-desc">Uma seleção meticulosa de obras-primas contemporâneas. Exclusividade absoluta para instantes inesquecíveis.</p>
        </div>

        {/* Category filters inside the luxury container */}
        <div className="flex flex-col md:flex-row justify-center items-center mb-16 gap-8 border-b border-[#C9A84C]/15 pb-8">
          <div className="flex flex-wrap gap-4 text-[9.5px] tracking-[0.3em] uppercase font-light justify-center">
            {['Todos', 'Anéis', 'Colares', 'Pulseiras'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-5 py-2.5 transition-all border ${
                  selectedCategory === cat 
                    ? 'text-[#0B0B0B] bg-[#C9A84C] border-[#C9A84C] font-semibold' 
                    : 'text-[#EDE6D6]/60 border-[#C9A84C]/20 hover:border-[#C9A84C] hover:text-white'
                }`}
                style={{ cursor: 'pointer' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Search Status Info */}
        {(searchQuery || selectedCategory !== 'Todos') && (
          <div className="mb-10 text-[10px] tracking-widest uppercase text-[#EDE6D6]/45 font-light flex flex-wrap items-center gap-3 justify-center">
            <span>Resultados para:</span>
            {selectedCategory !== 'Todos' && (
              <span className="px-3 py-1 bg-[#1E1C18] border border-[#C9A84C]/30 text-[#C9A84C]">
                Categoria: {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 bg-[#1E1C18] border border-[#C9A84C]/30 text-[#C9A84C]">
                Busca: "{searchQuery}"
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="prod-grid">
          <AnimatePresence>
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </div>

        {/* Show All Toggle Button */}
        {filteredProducts.length > 8 && (
          <div className="flex justify-center mt-16 reveal">
            <button
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="btn-ghost"
              style={{ cursor: 'pointer' }}
            >
              {showAllProducts ? 'Recolher Acervo' : 'Ver Todo o Catálogo'} <ArrowUpRight className="w-4 h-4 text-[#C9A84C]" />
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 bg-[#141414] border border-[#C9A84C]/15">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#EDE6D6]/40 font-light">Nenhuma joia sob estes critérios no momento.</span>
          </div>
        )}
      </div>
    </section>
  );
}
