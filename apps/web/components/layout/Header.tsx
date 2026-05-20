'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, ShoppingBag, User, X, Menu, Heart } from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { useWishlist } from '../../lib/wishlist-context';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [, startTransition] = useTransition();

  // Sync search input value with searchParams when URL changes
  useEffect(() => {
    setSearchVal(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchVal(val);
    
    startTransition(() => {
      const params = new URLSearchParams();
      if (val) {
        params.set('search', val);
      }
      
      const queryStr = params.toString();
      if (pathname === '/catalog') {
        router.push(`/catalog${queryStr ? `?${queryStr}` : ''}`, { scroll: false });
      } else {
        router.push(`/catalog${queryStr ? `?${queryStr}` : ''}`);
      }
    });
  };

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-full px-4 md:px-8">
          {/* Brand logo (Left) */}
          <Link href="/" className="nav-logo">
            FERNANDES <span>Joias Finas</span>
          </Link>

          {/* Prominent Search bar (Center) */}
          <div className="flex-1 max-w-xs md:max-w-sm mx-4 md:mx-8 relative flex items-center border-b border-[#C9A84C]/25 py-2">
            <Search className="w-3.5 h-3.5 text-[#C9A84C] mr-3" />
            <input
              type="text"
              placeholder="BUSCAR NO ACERVO..."
              value={searchVal}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-transparent text-[9px] tracking-[0.25em] text-[#EDE6D6] placeholder-[#EDE6D6]/30 focus:outline-none w-full uppercase font-light border-none outline-none"
            />
            {searchVal && (
              <button 
                onClick={() => handleSearchChange('')} 
                className="text-[#EDE6D6]/40 hover:text-white p-1"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Navigation links & actions (Right) */}
          <div className="flex items-center gap-4 md:gap-10">
            <ul className="nav-links hidden lg:flex">
              <li><Link href="/catalog">Acervo</Link></li>
              <li><a href="/#categories">Coleções</a></li>
              <li><a href="/#testimonials">Depoimentos</a></li>
            </ul>

            <div className="nav-actions flex items-center gap-4">
              {/* Wishlist Link */}
              <Link href="/catalog?wishlist=true" className="relative p-1 hover:text-[#C9A84C] transition-colors" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C9A84C] text-[#070707] rounded-full text-[8px] w-3.5 h-3.5 flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* User Profile Trigger */}
              <button 
                onClick={() => setShowAuthModal(true)} 
                aria-label="User profile"
                className="p-1 hover:text-[#C9A84C] transition-colors"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Shopping Cart Link */}
              <Link 
                href="/checkout" 
                className="cart-badge p-1 hover:text-[#C9A84C] transition-colors block" 
                aria-label={`Shopping Cart with ${totalItems} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="cart-count">{totalItems}</span>
                )}
              </Link>

              {/* Mobile Drawer Trigger */}
              <button
                className="lg:hidden p-1 hover:text-[#C9A84C] transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#0B0B0B] border-l border-[#C9A84C]/15 p-8 flex flex-col justify-between shadow-2xl transition-transform duration-300">
            <div>
              <div className="flex justify-between items-center mb-12">
                <span className="font-serif text-sm tracking-[0.2em] text-[#C9A84C]">MENU</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#EDE6D6]/50 hover:text-white p-1"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="flex flex-col gap-8">
                <Link 
                  href="/catalog" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-xs tracking-[0.3em] uppercase text-[#EDE6D6]/80 hover:text-[#C9A84C] transition-colors"
                >
                  Acervo
                </Link>
                <a 
                  href="/#categories" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-xs tracking-[0.3em] uppercase text-[#EDE6D6]/80 hover:text-[#C9A84C] transition-colors"
                >
                  Coleções
                </a>
                <a 
                  href="/#testimonials" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-xs tracking-[0.3em] uppercase text-[#EDE6D6]/80 hover:text-[#C9A84C] transition-colors"
                >
                  Depoimentos
                </a>
                <Link 
                  href="/catalog?wishlist=true" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-xs tracking-[0.3em] uppercase text-[#EDE6D6]/80 hover:text-[#C9A84C] transition-colors flex items-center gap-2"
                >
                  Lista de Desejos ({wishlist.length})
                </Link>
              </nav>
            </div>

            <div className="border-t border-[#C9A84C]/10 pt-8 text-center">
              <p className="text-[8px] tracking-[0.2em] text-[#EDE6D6]/30 uppercase">
                Fernandes Joias Atelier
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Luxury Auth Placeholder Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-[#0F0F0F] border border-[#C9A84C]/25 max-w-sm w-full p-8 text-center shadow-2xl">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-[#EDE6D6]/40 hover:text-white"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="mb-6 flex justify-center">
              <User className="w-8 h-8 text-[#C9A84C] stroke-[1.2]" />
            </div>

            <h3 className="font-serif text-xl text-[#F5F0E6] mb-3">Atelier & Clientes</h3>
            <div className="w-12 h-[1px] bg-[#C9A84C]/30 mx-auto mb-4" />
            
            <p className="text-xs text-[#EDE6D6]/70 leading-relaxed mb-6 font-light">
              Em breve, a Área do Cliente personalizada estará ativa. Você poderá gerenciar pedidos de alta joalharia e visualizar certificados exclusivos de autenticidade.
            </p>

            <button 
              onClick={() => setShowAuthModal(false)}
              className="w-full py-3 bg-[#C9A84C] text-[#070707] text-[10px] tracking-[0.25em] uppercase hover:bg-[#C9A84C]/80 transition-colors font-medium cursor-pointer"
            >
              Prosseguir
            </button>
          </div>
        </div>
      )}
    </>
  );
}

