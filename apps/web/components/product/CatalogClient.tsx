'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, X, Check, ChevronDown, Sparkles, Circle, Layers, Sparkle, Gem, Award, PenTool } from 'lucide-react';
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

  // Monogram scroll rotation state
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setRotation(window.scrollY * 0.04);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
    <div 
      className="bg-[#0B0B0B] text-[#EDE6D6] min-h-screen pb-24 font-sans selection:bg-[#C9A84C] selection:text-[#0B0B0B] relative"
      style={{ paddingTop: 'clamp(140px, 12vw, 180px)' }}
    >
      {/* Monogram Background "F" */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[80vh] select-none pointer-events-none z-0 transition-transform duration-75 text-[#C9A84C]/[0.02]"
        style={{ 
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`
        }}
      >
        F
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 w-full flex flex-col lg:flex-row items-start gap-12 relative z-10">
        
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className="w-[100%] lg:w-64 shrink-0 flex flex-col gap-8 lg:sticky lg:top-28 lg:h-[calc(100vh-160px)] overflow-y-auto pr-2 border-b lg:border-b-0 lg:border-r border-[#C9A84C]/15 pb-8 lg:pb-0">
          <div>
            <h2 className="font-serif text-[26px] tracking-wide font-light text-[#F5F0E6] uppercase mb-1.5">
              Filtros
            </h2>
            <p className="font-sans text-[11px] tracking-[0.22em] text-[#EDE6D6]/45 uppercase font-light">Refine sua seleção</p>
          </div>

          {/* Search Input In Sidebar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-[#141414] border border-[#C9A84C]/20 focus-within:border-[#C9A84C]/65 transition-all duration-300 px-4 py-3 rounded-none">
            <Search className="w-4 h-4 text-[#C9A84C] mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Filtrar nesta página..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[11px] lg:text-xs tracking-[0.18em] text-[#EDE6D6] placeholder-[#EDE6D6]/35 focus:outline-none w-full uppercase border-none font-sans font-light"
            />
            {searchQuery && (
              <button type="button" onClick={handleSearchClear} className="text-[#EDE6D6]/35 hover:text-white p-1 ml-1.5">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* CATEGORIES MENU SECTION */}
          <div className="flex flex-col gap-1.5">
            {(
              [
                { id: 'all', label: 'Todas as Joias', icon: <Sparkles className="w-[17px] h-[17px] shrink-0" /> },
                { id: 'anel', label: 'Anéis', icon: <Circle className="w-[17px] h-[17px] shrink-0" /> },
                { id: 'colar', label: 'Colares & Escapulários', icon: <Layers className="w-[17px] h-[17px] shrink-0" /> },
                { id: 'pulseira', label: 'Pulseiras', icon: <Sparkle className="w-[17px] h-[17px] shrink-0" /> },
                { id: 'brinco', label: 'Brincos', icon: <Gem className="w-[17px] h-[17px] shrink-0" /> },
                { id: 'pingente', label: 'Pingentes & Medalhas', icon: <Award className="w-[17px] h-[17px] shrink-0" /> },
                { id: 'personalizavel', label: 'Personalizáveis', icon: <PenTool className="w-[17px] h-[17px] shrink-0" /> },
              ] as const
            ).map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`pl-5 pr-4 py-3 flex items-center gap-3.5 transition-all text-left w-full border-l-[3px] rounded-none ${
                    isActive
                      ? 'text-[#C9A84C] font-semibold border-[#C9A84C] bg-[#C9A84C]/10'
                      : 'text-[#EDE6D6]/60 hover:text-white border-transparent hover:border-[#EDE6D6]/20 hover:bg-[#EDE6D6]/3'
                  }`}
                >
                  {cat.icon}
                  <span className="font-sans text-[11px] lg:text-xs tracking-[0.18em] uppercase font-light">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-[#EDE6D6]/30 font-mono font-medium ml-auto">
                    ({categoryCounts[cat.id] || 0})
                  </span>
                </button>
              );
            })}
          </div>

          {/* DYNAMIC PRICE SECTORS */}
          <div className="flex flex-col gap-4 border-t border-[#C9A84C]/10 pt-6">
            <div className="flex items-center gap-2.5 text-[#EDE6D6]/70">
              <ChevronDown className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-sans text-[11.5px] lg:text-xs tracking-[0.18em] uppercase font-light">Preço</span>
            </div>
            <div className="flex flex-col gap-3 pl-6">
              {(
                [
                  { id: 'all', label: 'Todos os Valores' },
                  { id: 'under-100', label: 'Até R$ 100' },
                  { id: '100-200', label: 'R$ 100 - R$ 200' },
                  { id: 'above-200', label: 'Acima de R$ 200' },
                ] as const
              ).map((range) => {
                const isActive = priceFilter === range.id;
                return (
                  <button
                    key={range.id}
                    onClick={() => handlePriceSelect(range.id)}
                    className="flex items-center gap-3.5 text-left group py-1 w-full"
                  >
                    <div
                      className={`w-4 h-4 border flex items-center justify-center transition-all duration-300 rounded-none shrink-0 ${
                        isActive
                          ? 'bg-[#C9A84C] border-[#C9A84C]'
                          : 'bg-transparent border-[#C9A84C]/35 group-hover:border-[#C9A84C]'
                      }`}
                    >
                      {isActive && <Check className="w-3 h-3 text-[#0B0B0B] stroke-[3px]" />}
                    </div>
                    <span
                      className={`text-[11px] lg:text-xs tracking-[0.15em] uppercase transition-colors duration-300 font-sans font-light ${
                        isActive ? 'text-[#C9A84C]' : 'text-[#EDE6D6]/45 group-hover:text-white'
                      }`}
                    >
                      {range.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC SPECIFICITIES SECTOR */}
          <div className="flex flex-col gap-4 border-t border-[#C9A84C]/10 pt-6">
            <div className="flex items-center gap-2.5 text-[#EDE6D6]/70">
              <ChevronDown className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-sans text-[11.5px] lg:text-xs tracking-[0.18em] uppercase font-light">Especificidades</span>
            </div>
            <div className="flex flex-col gap-3 pl-6">
              <button
                onClick={() => setOnlyEngravable(!onlyEngravable)}
                className="flex items-center gap-3.5 text-left group w-full py-1"
              >
                <div
                  className={`w-4 h-4 border flex items-center justify-center transition-all duration-300 rounded-none shrink-0 ${
                    onlyEngravable ? 'bg-[#C9A84C] border-[#C9A84C]' : 'bg-transparent border-[#C9A84C]/35 group-hover:border-[#C9A84C]'
                  }`}
                >
                  {onlyEngravable && <Check className="w-3 h-3 text-[#0B0B0B] stroke-[3px]" />}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-[11px] lg:text-xs tracking-[0.15em] uppercase font-sans font-light transition-colors duration-300 ${
                      onlyEngravable ? 'text-[#C9A84C]' : 'text-[#EDE6D6]/45 group-hover:text-white'
                    }`}
                  >
                    Personalizável à Laser
                  </span>
                  <span className="text-[9px] tracking-[0.15em] text-[#EDE6D6]/25 uppercase mt-0.5 font-sans font-light">Gravação no Atelier</span>
                </div>
              </button>
            </div>
          </div>

          {/* CLEAR FILTERS BUTTON */}
          {(activeCategory !== 'all' || priceFilter !== 'all' || searchQuery !== '' || onlyEngravable) && (
            <div className="mt-auto pt-6">
              <button
                onClick={clearAllFilters}
                className="w-full h-11 border border-[#C9A84C]/45 text-[11px] lg:text-xs uppercase tracking-[0.25em] font-semibold text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0B0B0B] transition-all duration-500 font-sans"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </aside>

        {/* RIGHT COL: PRODUCT CATALOG GALLERY */}
        <section className="flex-1">
          {/* Gallery Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#C9A84C]/15 pb-8 mb-12 gap-6">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-[#F5F0E6] uppercase tracking-wide">
                Acervo Completo
              </h1>
              <p className="text-[11px] text-[#EDE6D6]/40 max-w-md font-sans font-light leading-relaxed uppercase tracking-wider mt-4">
                Uma curadoria de peças atemporais, esculpidas à mão com os metais e gemas mais raros do mundo.
              </p>
            </div>
            
            {/* Sort Selector */}
            <div className="flex items-center gap-3.5 pb-2 border-b border-[#C9A84C]/20 self-start md:self-end">
              <span className="font-sans text-[9px] tracking-[0.2em] text-[#EDE6D6]/40 uppercase">ORDENAR POR:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortSelect(e.target.value as SortType)}
                  className="appearance-none bg-transparent border-none text-[#C9A84C] font-sans text-[9px] tracking-[0.2em] uppercase focus:ring-0 focus:outline-none cursor-pointer pr-5"
                >
                  <option value="default">Relevância</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name-asc">Ordem A - Z</option>
                  <option value="name-desc">Ordem Z - A</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#C9A84C] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </header>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {processedProducts.slice(0, visibleCount).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            // Empty State
            <div className="border border-[#F5F0E6]/5 bg-[#141414] p-16 text-center flex flex-col items-center gap-4">
              <span className="font-serif text-lg text-[#EDE6D6]/80 font-light">Nenhuma joia encontrada no acervo</span>
              <p className="text-[10px] text-[#EDE6D6]/30 uppercase tracking-widest max-w-xs leading-relaxed font-sans font-light">
                Não encontramos correspondência para os filtros aplicados. Tente ajustar sua busca.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#C9A84C] text-[#0B0B0B] text-[9px] uppercase tracking-widest font-bold hover:bg-[#E2C97E] transition-all font-sans font-medium"
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
        </section>
      </div>
    </div>
  );
}
