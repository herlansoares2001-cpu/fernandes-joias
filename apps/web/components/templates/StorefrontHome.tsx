'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, ArrowRight, X, Star, Shield, Award, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Variant {
  id: string;
  sku: string;
  size: string;
  priceAdjustment: number;
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

interface StorefrontHomeProps {
  initialProducts: Product[];
}

export default function StorefrontHome({ initialProducts }: StorefrontHomeProps) {
  const products = initialProducts;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Monitor scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products by category and search
  const filteredProducts = products.filter((product) => {
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

  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 6);

  return (
    <div className="bg-[#070707] text-[#EDE6D6] font-sans antialiased selection:bg-[#C9A84C] selection:text-[#070707] min-h-screen relative overflow-hidden">
      
      {/* 1. Header (Navbar) - Fixed and Premium */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          isScrolled 
            ? 'h-20 bg-[#070707]/95 backdrop-blur-md border-b border-[#C9A84C]/15 shadow-2xl' 
            : 'h-28 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between gap-8">
          {/* Logo (Left) */}
          <Link href="/" className="group flex flex-col justify-start shrink-0">
            <span className="font-serif text-2xl tracking-[0.3em] uppercase font-light text-[#F5F0E6] group-hover:text-[#C9A84C] transition-colors duration-500">
              Fernandes
            </span>
            <span className="text-[8px] font-sans tracking-[0.55em] uppercase text-[#C9A84C] mt-1">
              Alta Joalharia
            </span>
          </Link>

          {/* Prominent Search Bar (Center) */}
          <div className="flex-1 max-w-lg hidden md:flex relative border border-[#C9A84C]/25 bg-[#121212]/80 px-5 py-3 items-center backdrop-blur-sm">
            <Search className="w-3.5 h-3.5 text-[#C9A84C] mr-3" />
            <input
              type="text"
              placeholder="BUSCAR NO ACERVO..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim() !== '') {
                  setShowAllProducts(true);
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-transparent text-[9px] tracking-[0.25em] text-[#EDE6D6] placeholder-[#EDE6D6]/30 focus:outline-none w-full uppercase font-light"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#EDE6D6]/40 hover:text-white p-1">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Navigation Links & Action Icons (Right) */}
          <div className="flex items-center gap-8 shrink-0">
            <div className="hidden lg:flex items-center gap-10">
              <a href="#categories" className="text-[9.5px] tracking-[0.4em] uppercase text-[#EDE6D6]/70 hover:text-[#C9A84C] transition-colors duration-300">
                Categorias
              </a>
              <a href="#catalog" className="text-[9.5px] tracking-[0.4em] uppercase text-[#EDE6D6]/70 hover:text-[#C9A84C] transition-colors duration-300">
                Acervo
              </a>
              <a href="#testimonials" className="text-[9.5px] tracking-[0.4em] uppercase text-[#EDE6D6]/70 hover:text-[#C9A84C] transition-colors duration-300">
                Depoimentos
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button aria-label="Account" className="text-[#EDE6D6]/70 hover:text-[#C9A84C] transition-colors duration-300 p-2">
                <User className="w-4 h-4" />
              </button>
              <Link href="/" aria-label="Cart" className="text-[#EDE6D6]/70 hover:text-[#C9A84C] transition-colors duration-300 p-2 relative">
                <ShoppingBag className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section - Full bleed editorial header with beautiful background */}
      <section id="hero" className="h-screen w-full relative flex items-center justify-center bg-[#070707]">
        {/* Full-bleed background image with heavy dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=90&w=1800&auto=format&fit=crop"
            alt="Anel de Ouro Fundo Editorial"
            className="w-full h-full object-cover filter brightness-[0.25] contrast-[1.1] saturation-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#070707]/60 via-transparent to-[#070707]/60"></div>
        </div>

        <div className="max-w-5xl mx-auto px-8 text-center z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] tracking-[0.6em] uppercase text-[#C9A84C] mb-8 block font-semibold">
              Acervo de Alta Joalheria
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-extralight tracking-tight leading-[1.05] mb-10 text-[#F5F0E6]">
              Formas puras, <br />
              lapidação <em>singular</em>.
            </h1>
            <p className="text-xs sm:text-sm font-sans tracking-[0.05em] leading-relaxed text-[#EDE6D6]/50 mb-14 max-w-lg font-light">
              Metais nobres certificados em Ouro 18K e Prata 925 com gravação personalizada e exclusividade garantida pelo mestre ourives.
            </p>
            <a
              href="#catalog"
              className="min-w-[220px] min-h-[56px] flex items-center justify-center border border-[#C9A84C] text-[#070707] bg-[#C9A84C] text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-transparent hover:text-[#C9A84C] transition-all duration-700 shadow-2xl"
            >
              Explorar Coleções
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
          <span className="text-[8px] tracking-[0.4em] uppercase font-light">Deslizar</span>
          <div className="w-[1px] h-10 bg-[#C9A84C] animate-pulse"></div>
        </div>
      </section>

      {/* 3. Mobile Search Header */}
      <div className="md:hidden w-full px-6 py-5 bg-[#090909] border-y border-[#C9A84C]/15">
        <div className="relative border border-[#C9A84C]/20 bg-[#121212] px-4 py-3 flex items-center">
          <Search className="w-4 h-4 text-[#C9A84C] mr-3" />
          <input
            type="text"
            placeholder="PROCURAR JOIA..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim() !== '') {
                setShowAllProducts(true);
                const el = document.getElementById('catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-transparent text-[10px] tracking-wider text-[#EDE6D6] placeholder-[#EDE6D6]/30 focus:outline-none w-full uppercase font-light"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#EDE6D6]/40 p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Asymmetric Editorial Categories Grid */}
      <section id="categories" className="py-32 bg-[#090909] border-b border-[#C9A84C]/15">
        <div className="max-w-7xl mx-auto px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24">
            <div>
              <span className="text-[9px] tracking-[0.5em] text-[#C9A94C] uppercase block mb-4 font-semibold">Navegação Curada</span>
              <h2 className="font-serif text-4xl font-light text-[#F5F0E6]">Categorias Principais</h2>
            </div>
            <p className="text-xs font-sans tracking-wide text-[#EDE6D6]/40 max-w-sm font-light mt-4 md:mt-0 leading-relaxed">
              Filtre as peças desenhadas sob medida para cada tipo de afeto e ocasião especial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Card 1 - Big Vertical (Anéis) */}
            <button
              onClick={() => {
                setSelectedCategory('Anéis');
                setShowAllProducts(true);
                const el = document.getElementById('catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="md:col-span-7 relative aspect-[16/11] md:aspect-auto md:h-[600px] bg-[#121212] group overflow-hidden border border-[#C9A84C]/15 text-left"
            >
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"
                alt="Alianças de Ouro"
                className="w-full h-full object-cover opacity-35 group-hover:opacity-60 group-hover:scale-102 transition-all duration-[1200ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/90 via-[#070707]/30 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <span className="text-[8px] tracking-[0.45em] text-[#C9A84C] uppercase block mb-2.5 font-bold">Ornamento de Compromisso</span>
                <h3 className="font-serif text-3xl text-[#F5F0E6] font-light">Anéis & Alianças</h3>
                <span className="text-[8px] tracking-[0.3em] uppercase text-[#EDE6D6]/40 mt-3 inline-flex items-center gap-2 group-hover:text-[#C9A84C] transition-colors">
                  Descobrir Peças <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>

            {/* Right stack (Colares & Pulseiras) */}
            <div className="md:col-span-5 flex flex-col gap-8 justify-between">
              
              {/* Card 2 - Horizontal (Colares) */}
              <button
                onClick={() => {
                  setSelectedCategory('Colares');
                  setShowAllProducts(true);
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative h-[284px] bg-[#121212] group overflow-hidden border border-[#C9A84C]/15 text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"
                  alt="Colares"
                  className="w-full h-full object-cover opacity-35 group-hover:opacity-60 group-hover:scale-102 transition-all duration-[1200ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/90 via-[#070707]/30 to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <span className="text-[8px] tracking-[0.45em] text-[#C9A84C] uppercase block mb-2.5 font-bold">Lapidação e Estrutura</span>
                  <h3 className="font-serif text-2xl text-[#F5F0E6] font-light">Colares & Medalhas</h3>
                  <span className="text-[8px] tracking-[0.3em] uppercase text-[#EDE6D6]/40 mt-3 inline-flex items-center gap-2 group-hover:text-[#C9A84C] transition-colors">
                    Descobrir Peças <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>

              {/* Card 3 - Horizontal (Pulseiras) */}
              <button
                onClick={() => {
                  setSelectedCategory('Pulseiras');
                  setShowAllProducts(true);
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative h-[284px] bg-[#121212] group overflow-hidden border border-[#C9A84C]/15 text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
                  alt="Pulseiras"
                  className="w-full h-full object-cover opacity-35 group-hover:opacity-60 group-hover:scale-102 transition-all duration-[1200ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/90 via-[#070707]/30 to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <span className="text-[8px] tracking-[0.45em] text-[#C9A84C] uppercase block mb-2.5 font-bold">Malhas Nobres</span>
                  <h3 className="font-serif text-2xl text-[#F5F0E6] font-light">Pulseiras</h3>
                  <span className="text-[8px] tracking-[0.3em] uppercase text-[#EDE6D6]/40 mt-3 inline-flex items-center gap-2 group-hover:text-[#C9A84C] transition-colors">
                    Descobrir Peças <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust Badges Strip */}
      <section className="py-20 bg-[#070707] border-b border-[#C9A84C]/15">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex items-start gap-5">
              <Shield className="w-6 h-6 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#F5F0E6] font-bold mb-2">Envio 100% Seguro</h4>
                <p className="text-xs text-[#EDE6D6]/50 leading-relaxed font-light">
                  Nossas peças são enviadas em caixas lacradas com blindagem magnética e rastreabilidade total por satélite.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <Award className="w-6 h-6 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#F5F0E6] font-bold mb-2">Garantia Eterna do Metal</h4>
                <p className="text-xs text-[#EDE6D6]/50 leading-relaxed font-light">
                  Acompanha certificado assinado e selado de autenticidade vitalícia do metal precioso Ouro 18K e Prata 925.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <RotateCcw className="w-6 h-6 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#F5F0E6] font-bold mb-2">Trocas Sem Complicações</h4>
                <p className="text-xs text-[#EDE6D6]/50 leading-relaxed font-light">
                  Disponibilizamos suporte completo para troca de aro ou ajuste de gravação de forma totalmente grátis em até 7 dias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Showcase Catalog Grid */}
      <section id="catalog" className="py-32 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-8">
          
          {/* Section title and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div>
              <span className="text-[9px] tracking-[0.5em] uppercase text-[#C9A84C] mb-4 block font-semibold">Peças Selecionadas</span>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-[#F5F0E6]">O Acervo Fernandes</h2>
            </div>
            
            {/* Elegant category pills */}
            <div className="flex flex-wrap gap-4 text-[9.5px] tracking-[0.3em] uppercase font-light">
              {['Todos', 'Anéis', 'Colares', 'Pulseiras'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowAllProducts(true);
                  }}
                  className={`px-5 py-2.5 transition-all border ${
                    selectedCategory === cat 
                      ? 'text-[#070707] bg-[#C9A84C] border-[#C9A84C] font-semibold' 
                      : 'text-[#EDE6D6]/60 border-[#C9A84C]/20 hover:border-[#C9A84C] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of high-end product cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence>
              {displayedProducts.map((p) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  key={p.id}
                  className="group flex flex-col relative bg-[#121212] border border-[#C9A84C]/15 hover:border-[#C9A84C] transition-all duration-500 overflow-hidden"
                >
                  {/* Image container */}
                  <Link href={`/product/${p.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#070707]">
                    {p.certificationUrl ? (
                      <img
                        src={p.certificationUrl}
                        alt={p.name}
                        className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.05] group-hover:scale-103 group-hover:brightness-[0.95] transition-all duration-[1000ms] ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10">
                        <ShoppingBag className="w-10 h-10 text-[#EDE6D6]" />
                      </div>
                    )}
                  </Link>

                  {/* Information block */}
                  <div className="p-8 flex flex-col items-stretch flex-1 justify-between">
                    <div>
                      {/* Delicate stars for conversions */}
                      <div className="flex items-center gap-1 text-[#C9A84C] mb-3">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                        <span className="text-[8px] tracking-wide text-[#EDE6D6]/40 ml-2 font-sans">(5.0)</span>
                      </div>

                      <Link href={`/product/${p.slug}`} className="font-serif text-xl text-[#F5F0E6] font-light tracking-wide group-hover:text-[#C9A84C] transition-colors mb-2 block line-clamp-1">
                        {p.name}
                      </Link>
                      
                      <span className="font-serif text-lg text-[#C9A84C] font-light block mb-6">
                        R$ {p.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Touch friendly premium CTA (Min 44px height) */}
                    <Link
                      href={`/product/${p.slug}`}
                      className="w-full min-h-[46px] flex items-center justify-center border border-[#C9A84C]/45 hover:border-[#C9A84C] text-[#EDE6D6] hover:text-[#070707] hover:bg-[#C9A84C] text-[9.5px] tracking-[0.35em] uppercase font-bold transition-all duration-500 shadow-md"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Show All Toggle */}
          {filteredProducts.length > 6 && (
            <div className="flex justify-center mt-20">
              <button
                onClick={() => setShowAllProducts(!showAllProducts)}
                className="min-h-[48px] px-12 border border-[#C9A84C] text-[#C9A84C] hover:text-[#070707] hover:bg-[#C9A84C] text-[10px] tracking-[0.35em] uppercase font-bold transition-all duration-500 shadow-lg"
              >
                {showAllProducts ? 'Recolher Acervo' : 'Ver Acervo Completo'}
              </button>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-24 bg-[#121212] border border-[#C9A84C]/15">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#EDE6D6]/40 font-light">Nenhuma joia sob estes critérios no momento.</span>
            </div>
          )}
        </div>
      </section>

      {/* 7. Prova Social (Depoimentos) */}
      <section id="testimonials" className="py-32 bg-[#090909] border-t border-[#C9A84C]/15">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <span className="text-[9px] tracking-[0.5em] uppercase text-[#C9A84C] mb-4 block font-semibold">Opiniões de Confiança</span>
            <h2 className="font-serif text-4xl font-light text-[#F5F0E6]">Vozes de Nossos Clientes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Mariana S. Silva',
                city: 'São Paulo - BR',
                quote: 'A aliança personalizada em Ouro 18K ficou maravilhosa. O laudo de autenticidade assinado pelo ourives e o seguro no transporte me deram total tranquilidade.'
              },
              {
                name: 'Ricardo Alcantara',
                city: 'Rio de Janeiro - BR',
                quote: 'Lapidação irretocável e embalagem extremamente segura. O atendimento prévio no WhatsApp tirou todas as minhas dúvidas sobre o aro antes da produção.'
              },
              {
                name: 'Helena de Souza',
                city: 'Belo Horizonte - BR',
                quote: 'Já é minha terceira compra de pingentes. A garantia vitalícia do metal e a precisão da gravação tornam as peças itens de herança familiar.'
              }
            ].map((dep, idx) => (
              <div key={idx} className="bg-[#121212] p-10 border border-[#C9A84C]/15 flex flex-col justify-between hover:border-[#C9A84C] transition-colors duration-500">
                <div>
                  <div className="flex gap-1 text-[#C9A84C] mb-6">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-[#EDE6D6]/70 font-light mb-8 italic">
                    "{dep.quote}"
                  </p>
                </div>
                <div className="border-t border-[#C9A84C]/15 pt-6">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#F5F0E6] font-bold block">{dep.name}</span>
                  <span className="text-[8px] tracking-[0.25em] text-[#C9A84C] uppercase block mt-1.5 font-light">{dep.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-[#090909] text-[#EDE6D6]/50 pt-24 pb-12 border-t border-[#C9A84C]/15 text-[10px] tracking-[0.2em] uppercase font-light">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            
            <div>
              <span className="font-serif text-xl tracking-[0.25em] text-[#F5F0E6] block mb-6">Fernandes</span>
              <p className="text-[10px] leading-relaxed text-[#EDE6D6]/40">
                Alta gemologia e ourivesaria focada no essencial. Peças sob medida de herança familiar.
              </p>
            </div>

            <div>
              <span className="text-[#F5F0E6] block mb-6 tracking-[0.3em] font-semibold">Ajuda & Suporte</span>
              <ul className="flex flex-col gap-3 text-[9px] tracking-[0.25em]">
                <li><a href="#" className="hover:text-[#C9A84C] transition-colors">Termos de Troca & Devolução</a></li>
                <li><a href="#" className="hover:text-[#C9A84C] transition-colors">Perguntas Frequentes (FAQ)</a></li>
                <li><a href="#" className="hover:text-[#C9A84C] transition-colors">Rastreamento de Pedido</a></li>
                <li><a href="#" className="hover:text-[#C9A84C] transition-colors">Segurança no Envio</a></li>
              </ul>
            </div>

            <div>
              <span className="text-[#F5F0E6] block mb-6 tracking-[0.3em] font-semibold">Coleções</span>
              <ul className="flex flex-col gap-3 text-[9px] tracking-[0.25em]">
                <li><a href="#catalog" className="hover:text-[#C9A84C] transition-colors">Alianças Exclusivas</a></li>
                <li><a href="#catalog" className="hover:text-[#C9A84C] transition-colors">Pingentes & Medalhas</a></li>
                <li><a href="#catalog" className="hover:text-[#C9A84C] transition-colors">Pulseiras Premium</a></li>
                <li><a href="#trust" className="hover:text-[#C9A84C] transition-colors">Certificados de Pureza</a></li>
              </ul>
            </div>

            <div>
              <span className="text-[#F5F0E6] block mb-6 tracking-[0.3em] font-semibold">Atendimento</span>
              <p className="text-[9px] tracking-[0.25em] lowercase text-[#EDE6D6]/40 mb-2">
                contato@fernandesjoias.com.br
              </p>
              <p className="text-[9px] tracking-[0.25em] mb-2">
                +55 (11) 9999-8888
              </p>
              <p className="text-[9px] tracking-[0.25em]">
                São Paulo, Brasil
              </p>
            </div>
          </div>

          <div className="border-t border-[#C9A84C]/15 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[8px] text-[#EDE6D6]/30">
            <span>&copy; {new Date().getFullYear()} Fernandes Joias Ltda. CNPJ: 00.000.000/0001-00.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#C9A84C] transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-[#C9A84C] transition-colors">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
