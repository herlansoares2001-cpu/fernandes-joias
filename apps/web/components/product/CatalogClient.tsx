'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal, Grid, Search, X, Check, ArrowUpDown, ChevronDown } from 'lucide-react';
import type { Product } from '../../types';
import ProductCard from './ProductCard';

interface CatalogClientProps {
  initialProducts: Product[];
}

type CategoryType = 'all' | 'anel' | 'colar' | 'pulseira' | 'brinco' | 'pingente' | 'personalizavel';
type PriceFilterType = 'all' | 'under-100' | '100-200' | 'above-200';
type SortType = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function CatalogClient({ initialProducts }: CatalogClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  // Load URL Query states
  const searchParam = searchParams.get('search') || '';
  const categoryParam = (searchParams.get('category') as CategoryType) || 'all';
  const priceParam = (searchParams.get('price') as PriceFilterType) || 'all';
  const sortParam = (searchParams.get('sort') as SortType) || 'default';

  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [activeCategory, setActiveCategory] = useState<CategoryType>(categoryParam);
  const [priceFilter, setPriceFilter] = useState<PriceFilterType>(priceParam);
  const [sortBy, setSortBy] = useState<SortType>(sortParam);
  
  // Custom laser engraving filter
  const [onlyEngravable, setOnlyEngravable] = useState(false);

  // Pagination limit state
  const [visibleCount, setVisibleCount] = useState(12);

  // Synchronize state when URL changes (e.g. searching from Header)
  useEffect(() => {
    setSearchQuery(searchParam);
    setActiveCategory(categoryParam);
    setPriceFilter(priceParam);
    setSortBy(sortParam);
  }, [searchParam, categoryParam, priceParam, sortParam]);

  // Sync state to URL params for deep-linking
  const updateURLParams = (updates: {
    category?: CategoryType;
    price?: PriceFilterType;
    sort?: SortType;
    search?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (updates.category !== undefined) {
      if (updates.category === 'all') params.delete('category');
      else params.set('category', updates.category);
    }
    if (updates.price !== undefined) {
      if (updates.price === 'all') params.delete('price');
      else params.set('price', updates.price);
    }
    if (updates.sort !== undefined) {
      if (updates.sort === 'default') params.delete('sort');
      else params.set('sort', updates.sort);
    }
    if (updates.search !== undefined) {
      if (!updates.search) params.delete('search');
      else params.set('search', updates.search);
    }

    const queryStr = params.toString();
    const targetPath = `${pathname}${queryStr ? `?${queryStr}` : ''}`;
    
    startTransition(() => {
      router.push(targetPath, { scroll: false });
    });
  };

  // Helper to categorize products on the fly
  const getProductCategory = (p: Product): string => {
    const slug = p.slug.toLowerCase();
    const name = p.name.toLowerCase();

    if (slug.includes('personalizado') || slug.includes('personalizavel') || name.includes('personalizado') || name.includes('personalizável')) {
      return 'personalizavel';
    }
    if (slug.includes('anel') || slug.includes('alianca') || name.includes('anel') || name.includes('aliança')) {
      return 'anel';
    }
    if (slug.includes('colar') || slug.includes('escapulario') || slug.includes('gargantilha') || slug.includes('cordao') || name.includes('colar') || name.includes('escapulário') || name.includes('gargantilha') || name.includes('cordão')) {
      return 'colar';
    }
    if (slug.includes('pulseira') || slug.includes('bracelete') || name.includes('pulseira') || name.includes('bracelete')) {
      return 'pulseira';
    }
    if (slug.includes('brinco') || slug.includes('trio') || name.includes('brinco') || name.includes('trio')) {
      return 'brinco';
    }
    if (slug.includes('pingente') || slug.includes('berloque') || slug.includes('canga') || slug.includes('mandala') || name.includes('pingente') || name.includes('berloque') || name.includes('canga') || name.includes('mandala')) {
      return 'pingente';
    }
    return 'other';
  };

  // Compute category counts for sidebar metadata badge
  const categoryCounts = useMemo(() => {
    const counts = {
      all: initialProducts.length,
      anel: 0,
      colar: 0,
      pulseira: 0,
      brinco: 0,
      pingente: 0,
      personalizavel: 0,
    };

    initialProducts.forEach((p) => {
      const cat = getProductCategory(p);
      if (cat === 'anel') counts.anel++;
      else if (cat === 'colar') counts.colar++;
      else if (cat === 'pulseira') counts.pulseira++;
      else if (cat === 'brinco') counts.brinco++;
      else if (cat === 'pingente') counts.pingente++;
      
      if (p.slug.includes('personalizad') || p.name.toLowerCase().includes('personalizad')) {
        counts.personalizavel++;
      }
    });

    return counts;
  }, [initialProducts]);

  // Compute filtered & sorted products list
  const processedProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    // 2. Category Sidebar Filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'personalizavel') {
        result = result.filter(
          (p) =>
            p.slug.includes('personalizad') || p.name.toLowerCase().includes('personalizad')
        );
      } else {
        result = result.filter((p) => getProductCategory(p) === activeCategory);
      }
    }

    // 3. Price Filter
    if (priceFilter !== 'all') {
      result = result.filter((p) => {
        const price = Number(p.basePrice);
        if (priceFilter === 'under-100') return price < 100;
        if (priceFilter === '100-200') return price >= 100 && price <= 200;
        if (priceFilter === 'above-200') return price > 200;
        return true;
      });
    }

    // 4. Laser Engraving Filter Checkbox
    if (onlyEngravable) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes('personalizado') ||
          p.name.toLowerCase().includes('personalizável') ||
          p.slug.includes('personalizad')
      );
    }

    // 5. Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [initialProducts, searchQuery, activeCategory, priceFilter, onlyEngravable, sortBy]);

  // Load more automatically when scrolling near bottom
  useEffect(() => {
    if (processedProducts.length <= visibleCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 12, processedProducts.length));
        }
      },
      { rootMargin: '200px' }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [processedProducts, visibleCount]);

  const handleCategorySelect = (cat: CategoryType) => {
    setActiveCategory(cat);
    setVisibleCount(12); // reset pagination
    updateURLParams({ category: cat });
  };

  const handlePriceSelect = (price: PriceFilterType) => {
    setPriceFilter(price);
    setVisibleCount(12);
    updateURLParams({ price });
  };

  const handleSortSelect = (sort: SortType) => {
    setSortBy(sort);
    updateURLParams({ sort });
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    updateURLParams({ search: '' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURLParams({ search: searchQuery });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setPriceFilter('all');
    setSortBy('default');
    setOnlyEngravable(false);
    setVisibleCount(12);
    
    // Clear URL
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <section className="bg-[#070707] text-[#EDE6D6] min-h-screen pt-40 lg:pt-48 pb-24 font-sans selection:bg-[#C9A84C] selection:text-[#070707]">
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Editorial Page Header */}
        <div className="border-b border-[#F5F0E6]/10 pb-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[9px] tracking-[0.45em] uppercase text-[#C9A84C] font-semibold mb-3 block">Joias Autorais</span>
              <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0E6] uppercase tracking-wide">
                O Acervo
              </h1>
            </div>
            <p className="text-[11px] text-[#EDE6D6]/40 max-w-sm font-light leading-relaxed uppercase tracking-wider">
              Peças desenhadas e esculpidas à mão no atelier. Acabamentos polidos, pedras selecionadas e garantia vitalícia de autenticidade.
            </p>
          </div>
        </div>

        {/* Catalog Container Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SIDEBAR: FILTERS */}
          <aside className="lg:col-span-3 flex flex-col gap-10 lg:sticky lg:top-28">
            
            {/* Search Input In Sidebar */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-[#C9A84C]/25 py-2 mb-2">
              <Search className="w-3.5 h-3.5 text-[#C9A84C] mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Filtrar nesta página..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-[9px] tracking-[0.25em] text-[#EDE6D6] placeholder-[#EDE6D6]/30 focus:outline-none w-full uppercase border-none font-sans font-light"
              />
              {searchQuery && (
                <button type="button" onClick={handleSearchClear} className="text-[#EDE6D6]/30 hover:text-white p-1">
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>

            {/* CATEGORIES SECTION */}
            <div>
              <h3 className="font-serif text-[13px] tracking-widest text-[#EDE6D6]/90 mb-6 border-b border-[#C9A84C]/15 pb-2 uppercase font-light">
                Categorias
              </h3>
              <ul className="flex flex-col gap-4">
                {(
                  [
                    { id: 'all', label: 'Todas as Joias' },
                    { id: 'anel', label: 'Anéis' },
                    { id: 'colar', label: 'Colares & Escapulários' },
                    { id: 'pulseira', label: 'Pulseiras' },
                    { id: 'brinco', label: 'Brincos & Trios' },
                    { id: 'pingente', label: 'Pingentes & Medalhas' },
                    { id: 'personalizavel', label: 'Personalizáveis' },
                  ] as const
                ).map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`flex items-center justify-between w-full text-left transition-colors duration-300 py-1.5 ${
                        activeCategory === cat.id
                          ? 'text-[#C9A84C]'
                          : 'text-[#EDE6D6]/50 hover:text-[#EDE6D6]'
                      }`}
                    >
                      <span className="text-[10px] tracking-[0.2em] uppercase font-sans font-light">
                        {cat.label}
                      </span>
                      <span className="text-[9px] text-[#EDE6D6]/20 font-mono font-light">
                        ({categoryCounts[cat.id] || 0})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* PRICE FILTER SECTION */}
            <div>
              <h3 className="font-serif text-[13px] tracking-widest text-[#EDE6D6]/90 mb-6 border-b border-[#C9A84C]/15 pb-2 uppercase font-light">
                Faixas de Preço
              </h3>
              <div className="flex flex-col gap-4">
                {(
                  [
                    { id: 'all', label: 'Todos os Valores' },
                    { id: 'under-100', label: 'Até R$ 100' },
                    { id: '100-200', label: 'R$ 100 - R$ 200' },
                    { id: 'above-200', label: 'Acima de R$ 200' },
                  ] as const
                ).map((range) => (
                  <button
                    key={range.id}
                    onClick={() => handlePriceSelect(range.id)}
                    className="flex items-center gap-3 text-left group py-1"
                  >
                    <div
                      className={`w-3.5 h-3.5 border border-[#C9A84C]/35 flex items-center justify-center transition-all rounded-none ${
                        priceFilter === range.id
                          ? 'bg-[#C9A84C] border-[#C9A84C]'
                          : 'bg-transparent group-hover:border-[#C9A84C]'
                      }`}
                    >
                      {priceFilter === range.id && <Check className="w-2.5 h-2.5 text-[#070707] stroke-[3px]" />}
                    </div>
                    <span
                      className={`text-[10px] tracking-[0.2em] uppercase transition-colors font-sans font-light ${
                        priceFilter === range.id ? 'text-[#C9A84C]' : 'text-[#EDE6D6]/40 hover:text-[#EDE6D6]/80'
                      }`}
                    >
                      {range.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOMIZATION OPTIONS */}
            <div>
              <h3 className="font-serif text-[13px] tracking-widest text-[#EDE6D6]/90 mb-6 border-b border-[#C9A84C]/15 pb-2 uppercase font-light">
                Especificidades
              </h3>
              <button
                onClick={() => setOnlyEngravable(!onlyEngravable)}
                className="flex items-center gap-3 text-left group w-full py-1"
              >
                <div
                  className={`w-3.5 h-3.5 border border-[#C9A84C]/35 flex items-center justify-center transition-all rounded-none ${
                    onlyEngravable ? 'bg-[#C9A84C] border-[#C9A84C]' : 'bg-transparent group-hover:border-[#C9A84C]'
                  }`}
                >
                  {onlyEngravable && <Check className="w-2.5 h-2.5 text-[#070707] stroke-[3px]" />}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-[10px] tracking-[0.2em] uppercase font-sans font-light ${
                      onlyEngravable ? 'text-[#C9A84C]' : 'text-[#EDE6D6]/50 group-hover:text-[#EDE6D6]'
                    }`}
                  >
                    Personalizável à Laser
                  </span>
                  <span className="text-[8px] tracking-[0.15em] text-[#EDE6D6]/20 uppercase mt-0.5 font-sans font-light">Gravação no Atelier</span>
                </div>
              </button>
            </div>

            {/* CLEAR FILTERS BUTTON */}
            {(activeCategory !== 'all' || priceFilter !== 'all' || searchQuery !== '' || onlyEngravable) && (
              <button
                onClick={clearAllFilters}
                className="w-full h-11 border border-[#C9A84C]/25 text-[9px] uppercase tracking-[0.25em] font-semibold text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#070707] transition-all duration-300"
              >
                Limpar Todos os Filtros
              </button>
            )}
          </aside>

          {/* RIGHT COL: PRODUCT CATALOG GRID */}
          <main className="lg:col-span-9">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F5F0E6]/5 pb-6 mb-8 gap-4">
              <span className="text-[10px] tracking-widest text-[#EDE6D6]/35 uppercase">
                Exibindo {processedProducts.length} {processedProducts.length === 1 ? 'joia' : 'joias'}
              </span>

              {/* Sort Selector */}
              <div className="flex items-center gap-3">
                <span className="text-[9px] tracking-widest uppercase text-[#EDE6D6]/30">Ordenar por:</span>
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortSelect(e.target.value as SortType)}
                    className="appearance-none bg-[#141414] border border-[#F5F0E6]/10 text-[9px] tracking-widest text-[#EDE6D6]/85 uppercase px-4 py-2 pr-8 focus:outline-none focus:border-[#C9A84C] cursor-pointer rounded-none"
                  >
                    <option value="default">Relevância</option>
                    <option value="price-asc">Menor Preço</option>
                    <option value="price-desc">Maior Preço</option>
                    <option value="name-asc">Ordem A - Z</option>
                    <option value="name-desc">Ordem Z - A</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-[#C9A84C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active search filter badge */}
            {searchParam && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[9px] tracking-widest text-[#EDE6D6]/40 uppercase">Busca ativa por:</span>
                <span className="bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] text-[9px] uppercase tracking-widest px-3 py-1 flex items-center gap-2">
                  "{searchParam}"
                  <button onClick={handleSearchClear} className="hover:text-white">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              </div>
            )}

            {/* PRODUCT GRID */}
            {processedProducts.length > 0 ? (
              <div className="prod-grid !grid-cols-2 md:!grid-cols-2 lg:!grid-cols-3 !gap-4 md:!gap-8">
                {processedProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              // Empty State
              <div className="border border-[#F5F0E6]/5 bg-[#141414] p-16 text-center flex flex-col items-center gap-4">
                <span className="font-serif text-lg text-[#EDE6D6]/80 font-light">Nenhuma joia encontrada no acervo</span>
                <p className="text-[10px] text-[#EDE6D6]/30 uppercase tracking-widest max-w-xs leading-relaxed">
                  Não encontramos correspondência para os filtros aplicados. Tente ajustar sua busca.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-6 py-2.5 bg-[#C9A84C] text-[#070707] text-[9px] uppercase tracking-widest font-bold hover:bg-[#E2C97E] transition-all"
                >
                  Ver Todo o Acervo
                </button>
              </div>
            )}

            {/* INFINITE SCROLL SENTINEL */}
            <div id="scroll-sentinel" className="h-20 w-full flex items-center justify-center mt-6">
              {processedProducts.length > visibleCount && (
                <span className="text-[9px] tracking-[0.35em] text-[#C9A84C]/50 uppercase font-light animate-pulse font-sans">
                  Carregando mais joias...
                </span>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
