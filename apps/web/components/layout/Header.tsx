'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, ShoppingBag, User, X } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [scrolled, setScrolled] = useState(false);
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
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-full">
        {/* Brand logo (Left) */}
        <Link href="/" className="nav-logo">
          FERNANDES <span>Joias Finas</span>
        </Link>

        {/* Prominent Search bar (Center) */}
        <div className="flex-1 max-w-sm mx-8 relative flex items-center border-b border-[#C9A84C]/25 py-2">
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
        <div className="flex items-center gap-10">
          <ul className="nav-links">
            <li><Link href="/catalog">Acervo</Link></li>
            <li><a href="/#categories">Coleções</a></li>
            <li><a href="/#testimonials">Depoimentos</a></li>
          </ul>

          <div className="nav-actions">
            <button aria-label="User profile">
              <User className="w-5 h-5" />
            </button>
            <button className="cart-badge" aria-label="Shopping Cart">
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
