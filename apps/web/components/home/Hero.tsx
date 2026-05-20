'use client';

import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero">
      <div className="hero-bg"></div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10 flex items-center min-h-screen">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line"></div>
            <span>Nova Coleção 2026</span>
          </div>
          
          <h1 className="hero-title">
            O Fascínio da<br />
            <em>Realeza Tropical</em>
          </h1>
          
          <p className="hero-subtitle">
            O esplendor do ouro polido artesanalmente encontra a intensidade das pedras preciosas brasileiras. 
            Uma declaração majestosa de estilo e exclusividade absoluta.
          </p>
          
          <div className="hero-actions">
            <button onClick={handleScrollToCatalog} className="btn-primary">
              <span>Descubra a Coleção</span>
            </button>
            <button onClick={handleScrollToCatalog} className="btn-ghost">
              Ver Lookbook <ArrowUpRight className="w-4 h-4 text-[#C9A84C]" />
            </button>
          </div>
        </div>
        
        <div className="hero-scroll" onClick={handleScrollToCatalog} style={{ cursor: 'pointer', left: '0' }}>
          <div className="scroll-line"></div>
          <span className="scroll-text">Scroll</span>
        </div>

        <div className="hero-stats" style={{ right: '0' }}>
          <div className="stat">
            <div className="stat-num">18K</div>
            <div className="stat-label">Ouro Maciço</div>
          </div>
          <div className="stat">
            <div className="stat-num">VVS1</div>
            <div className="stat-label">Clareza Mínima</div>
          </div>
        </div>
      </div>

      <div className="hero-image-wrap">
        <img 
          src="https://images.unsplash.com/photo-1599643478514-4a888fccdf15?q=80&w=1600&auto=format&fit=crop" 
          alt="Model wearing luxury jewelry" 
          referrerPolicy="no-referrer" 
        />
      </div>
    </div>
  );
}
