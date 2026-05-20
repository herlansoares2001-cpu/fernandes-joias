'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

export default function Categories() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category);
    router.push(`/?${params.toString()}#catalog`, { scroll: false });
    
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categoriesData = [
    {
      name: 'Anéis',
      count: '+240 Peças',
      img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Colares',
      count: '+180 Peças',
      img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Pulseiras',
      count: '+95 Peças',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Relógios',
      count: '+45 Peças',
      img: 'https://images.unsplash.com/photo-1523268755815-fe7c372a0349?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <section id="categories" className="categories">
      <div className="max-w-7xl mx-auto w-full">
        <div className="sec-header reveal">
          <div className="sec-tag">Universo Fernandes</div>
          <h2 className="sec-title">Explore por <em>Design</em></h2>
          <p className="sec-desc">
            Cada categoria revela uma faceta distinta da nossa herança. Desde peças atemporais em diamante puro
            a ousadas combinações de gemas contemporâneas.
          </p>
        </div>
        
        <div className="cat-grid reveal reveal-delay-1">
          {categoriesData.map((cat) => (
            <div
              key={cat.name}
              className="cat-card"
              onClick={() => handleCategorySelect(cat.name === 'Braceletes' ? 'Pulseiras' : cat.name)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="cat-img"
                referrerPolicy="no-referrer"
              />
              <div className="cat-overlay"></div>
              <div className="cat-content">
                <h3 className="cat-name">{cat.name}</h3>
                <span className="cat-count">{cat.count}</span>
              </div>
              <button className="cat-arrow" aria-label={`Ver ${cat.name}`}>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
