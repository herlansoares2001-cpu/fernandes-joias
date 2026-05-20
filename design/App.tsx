import React, { useEffect, useState } from 'react';
import { Search, User, ShoppingBag, ArrowUpRight, Star, Instagram, Facebook, Twitter } from 'lucide-react';

function useCustomCursor() {
  useEffect(() => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const onMouseMove = (e: MouseEvent) => {
      if (!dot || !ring) return;
      dot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      ring.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);
}

export default function App() {
  useCustomCursor();
  useReveal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div id="cursor">
        <div id="cursor-dot"></div>
        <div id="cursor-ring"></div>
      </div>

      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-logo">
          FERNANDES <span>Joias Finas</span>
        </div>
        <ul className="nav-links">
          <li><a href="#">Coleções</a></li>
          <li><a href="#">Lançamentos</a></li>
          <li><a href="#">Noivado & Casamento</a></li>
          <li><a href="#">Alta Relojoaria</a></li>
          <li><a href="#">Maison</a></li>
        </ul>
        <div className="nav-actions">
          <button><Search className="w-5 h-5" /></button>
          <button><User className="w-5 h-5" /></button>
          <button className="cart-badge"><ShoppingBag className="w-5 h-5" /></button>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line"></div>
            <span>Nova Coleção 2026</span>
          </div>
          <h1 className="hero-title">O Fascínio da<br/><em>Realeza Tropical</em></h1>
          <p className="hero-subtitle">
            O esplendor do ouro polido artesanalmente encontra a intensidade das pedras preciosas brasileiras. 
            Uma declaração majestosa de estilo e exclusividade absoluta.
          </p>
          <div className="hero-actions">
            <button className="btn-primary"><span>Descubra a Coleção</span></button>
            <button className="btn-ghost">Ver Lookbook <ArrowUpRight className="w-4 h-4 text-gold" /></button>
          </div>
        </div>
        
        <div className="hero-scroll">
          <div className="scroll-line"></div>
          <span className="scroll-text">Scrolar</span>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">18K</div>
            <div className="stat-label">Ouro Maciço</div>
          </div>
          <div className="stat">
            <div className="stat-num">VVS1</div>
            <div className="stat-label">Clareza Mínima</div>
          </div>
        </div>

        <div className="hero-image-wrap">
          <img src="https://images.unsplash.com/photo-1599643478514-4a888fccdf15?q=80&w=1600&auto=format&fit=crop" alt="Model wearing luxury jewelry" referrerPolicy="no-referrer" />
        </div>
      </div>

      <div className="ornament">
        <div className="ornament-line"></div>
        <div className="ornament-diamond"></div>
        <div className="ornament-line"></div>
      </div>

      {/* Categorias Expandidas */}
      <section className="categories">
        <div className="sec-header reveal">
          <div className="sec-tag">Universo Fernandes</div>
          <h2 className="sec-title">Explore por <em>Design</em></h2>
          <p className="sec-desc">
            Cada categoria revela uma faceta distinta da nossa herança. Desde peças atemporais em diamante puro
            a ousadas combinações de gemas contemporâneas.
          </p>
        </div>
        
        <div className="cat-grid reveal reveal-delay-1">
          <div className="cat-card">
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop" alt="Anéis" className="cat-img" referrerPolicy="no-referrer" />
            <div className="cat-overlay"></div>
            <div className="cat-content">
              <h3 className="cat-name">Anéis</h3>
              <span className="cat-count">+240 Peças</span>
            </div>
            <a href="#" className="cat-arrow"><ArrowUpRight className="w-4 h-4" /></a>
          </div>
          <div className="cat-card">
            <img src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop" alt="Colares" className="cat-img" referrerPolicy="no-referrer" />
            <div className="cat-overlay"></div>
            <div className="cat-content">
              <h3 className="cat-name">Colares</h3>
              <span className="cat-count">+180 Peças</span>
            </div>
            <a href="#" className="cat-arrow"><ArrowUpRight className="w-4 h-4" /></a>
          </div>
          <div className="cat-card">
            <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop" alt="Braceletes" className="cat-img" referrerPolicy="no-referrer" />
            <div className="cat-overlay"></div>
            <div className="cat-content">
              <h3 className="cat-name">Braceletes</h3>
              <span className="cat-count">+95 Peças</span>
            </div>
            <a href="#" className="cat-arrow"><ArrowUpRight className="w-4 h-4" /></a>
          </div>
          <div className="cat-card">
            <img src="https://images.unsplash.com/photo-1523268755815-fe7c372a0349?q=80&w=800&auto=format&fit=crop" alt="Relógios" className="cat-img" referrerPolicy="no-referrer"/>
            <div className="cat-overlay"></div>
            <div className="cat-content">
              <h3 className="cat-name">Relógios</h3>
              <span className="cat-count">+45 Peças</span>
            </div>
            <a href="#" className="cat-arrow"><ArrowUpRight className="w-4 h-4" /></a>
          </div>
        </div>
      </section>

      <section className="marquee-strip">
        <div className="marquee-track">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="marquee-item">Alta Joalheria Brasileira</div>
              <div className="marquee-sep"></div>
              <div className="marquee-item">Ouro 18k Certificado</div>
              <div className="marquee-sep"></div>
              <div className="marquee-item">Gemas Éticas Naturais</div>
              <div className="marquee-sep"></div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Editorial 1 */}
      <section className="editorial">
        <div className="editorial-img">
          <img src="https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=1200&auto=format&fit=crop" alt="Artesão trabalhando" referrerPolicy="no-referrer" />
        </div>
        <div className="editorial-content">
          <div className="editorial-inner reveal">
            <div className="sec-tag">NOSSA HERANÇA</div>
            <h2 className="editorial-title">Artesanato que <em>Transcende o Tempo</em></h2>
            <p className="editorial-body">
              Nos nossos ateliês, cada joia ganha vida pelas mãos de mestres ourives. 
              Ao aliar técnicas seculares a designs vanguardistas, a Fernandes cria não apenas ornamentos, 
              mas relíquias familiares concebidas para a eternidade. Nossos diamantes são rigorosamente 
              selecionados pelo seu fogo e brilho incomparáveis.
            </p>
            <div className="btn-ghost" style={{ cursor: 'pointer' }}>Conheça o Ateliê <ArrowUpRight className="w-4 h-4 text-gold"/></div>
            <div className="editorial-sig">Fernandes Joias</div>
          </div>
        </div>
      </section>

      {/* Produtos Extendidos */}
      <section className="products">
        <div className="sec-header reveal">
          <div className="sec-tag">Gabinete de Curiosidades</div>
          <h2 className="sec-title">Peças <em>Exclusivas</em></h2>
          <p className="sec-desc">Uma seleção meticulosa de obras-primas contemporâneas. Exclusividade absoluta para instantes inesquecíveis.</p>
        </div>
        
        <div className="prod-grid">
          {/* Produto 1 */}
          <div className="prod-card reveal">
            <div className="prod-img-wrap">
              <img src="https://images.unsplash.com/photo-1515562141207-7a8e7343e0d8?q=80&w=800&auto=format&fit=crop" alt="Brinco" referrerPolicy="no-referrer" />
              <div className="prod-badge">Novo</div>
              <div className="prod-actions">
                <button className="prod-btn prod-btn-main">Adicionar</button>
                <button className="prod-btn prod-btn-wish">Lista de Desejos</button>
              </div>
            </div>
            <div className="prod-info">
              <h4 className="prod-brand">Coleção Aurora</h4>
              <h3 className="prod-name">Brincos Solitaire Gota</h3>
              <div className="prod-price-row">
                <span className="prod-price">R$ 14.500</span>
              </div>
              <div className="prod-stars">
                {[...Array(5)].map((_, i) => <Star key={i} className="text-gold fill-gold" />)}
              </div>
            </div>
          </div>

          {/* Produto 2 */}
          <div className="prod-card reveal reveal-delay-1">
            <div className="prod-img-wrap">
              <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop" alt="Anel" referrerPolicy="no-referrer" />
              <div className="prod-actions">
                <button className="prod-btn prod-btn-main">Adicionar</button>
                <button className="prod-btn prod-btn-wish">Lista de Desejos</button>
              </div>
            </div>
            <div className="prod-info">
              <h4 className="prod-brand">Edição Limitada</h4>
              <h3 className="prod-name">Anel Diamante Negro</h3>
              <div className="prod-price-row">
                <span className="prod-price">R$ 28.900</span>
                <span className="prod-price-old">R$ 32.000</span>
              </div>
              <div className="prod-stars">
                {[...Array(5)].map((_, i) => <Star key={i} className="text-gold fill-gold" />)}
              </div>
            </div>
          </div>

          {/* Produto 3 */}
          <div className="prod-card reveal reveal-delay-2">
            <div className="prod-img-wrap">
              <img src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=800&auto=format&fit=crop" alt="Colar" referrerPolicy="no-referrer" />
              <div className="prod-actions">
                <button className="prod-btn prod-btn-main">Adicionar</button>
                <button className="prod-btn prod-btn-wish">Lista de Desejos</button>
              </div>
            </div>
            <div className="prod-info">
              <h4 className="prod-brand">Clássicos</h4>
              <h3 className="prod-name">Colar Pérola do Tahiti</h3>
              <div className="prod-price-row">
                <span className="prod-price">R$ 9.200</span>
              </div>
               <div className="prod-stars">
                {[...Array(5)].map((_, i) => <Star key={i} className="text-gold fill-gold" />)}
              </div>
            </div>
          </div>

          {/* Produto 4 */}
          <div className="prod-card reveal reveal-delay-3">
            <div className="prod-img-wrap">
              <img src="https://images.unsplash.com/photo-1614164185128-f4cb0ba88733?q=80&w=800&auto=format&fit=crop" alt="Relógio" referrerPolicy="no-referrer" />
              <div className="prod-badge">Best Seller</div>
              <div className="prod-actions">
                <button className="prod-btn prod-btn-main">Adicionar</button>
                <button className="prod-btn prod-btn-wish">Lista de Desejos</button>
              </div>
            </div>
            <div className="prod-info">
              <h4 className="prod-brand">Alta Relojoaria</h4>
              <h3 className="prod-name">Cronógrafo Royal Oak</h3>
              <div className="prod-price-row">
                <span className="prod-price">R$ 98.000</span>
              </div>
               <div className="prod-stars">
                {[...Array(5)].map((_, i) => <Star key={i} className="text-gold fill-gold" />)}
              </div>
            </div>
          </div>

          {/* Produto 5 */}
          <div className="prod-card reveal">
            <div className="prod-img-wrap">
              <img src="https://images.unsplash.com/photo-1573408301145-b98c3093b163?q=80&w=800&auto=format&fit=crop" alt="Pulseira" referrerPolicy="no-referrer" />
              <div className="prod-actions">
                <button className="prod-btn prod-btn-main">Adicionar</button>
                <button className="prod-btn prod-btn-wish">Lista de Desejos</button>
              </div>
            </div>
            <div className="prod-info">
              <h4 className="prod-brand">Coleção Aurora</h4>
              <h3 className="prod-name">Pulseira Rígida Ouro 18K</h3>
              <div className="prod-price-row">
                <span className="prod-price">R$ 21.300</span>
              </div>
               <div className="prod-stars">
                {[...Array(5)].map((_, i) => <Star key={i} className="text-gold fill-gold" />)}
              </div>
            </div>
          </div>

          {/* Produto 6 */}
          <div className="prod-card reveal reveal-delay-1">
            <div className="prod-img-wrap">
              <img src="https://images.unsplash.com/photo-1596704017254-9b121068fb20?q=80&w=800&auto=format&fit=crop" alt="Aliança" referrerPolicy="no-referrer" />
              <div className="prod-actions">
                <button className="prod-btn prod-btn-main">Adicionar</button>
                <button className="prod-btn prod-btn-wish">Lista de Desejos</button>
              </div>
            </div>
            <div className="prod-info">
              <h4 className="prod-brand">Casamento</h4>
              <h3 className="prod-name">Par de Alianças Eternidade</h3>
              <div className="prod-price-row">
                <span className="prod-price">R$ 11.500</span>
                <span className="prod-price-old">R$ 13.000</span>
              </div>
               <div className="prod-stars">
                {[...Array(5)].map((_, i) => <Star key={i} className="text-gold fill-gold" />)}
              </div>
            </div>
          </div>

          {/* Produto 7 */}
          <div className="prod-card reveal reveal-delay-2">
            <div className="prod-img-wrap">
              <img src="https://images.unsplash.com/photo-1620656798579-1984d9e87df5?q=80&w=800&auto=format&fit=crop" alt="Gargantilha" referrerPolicy="no-referrer" />
              <div className="prod-badge">1 Peça Única</div>
              <div className="prod-actions">
                <button className="prod-btn prod-btn-main">Adicionar</button>
                <button className="prod-btn prod-btn-wish">Lista de Desejos</button>
              </div>
            </div>
            <div className="prod-info">
              <h4 className="prod-brand">Privilege</h4>
              <h3 className="prod-name">Gargantilha Esmeralda Real</h3>
              <div className="prod-price-row">
                <span className="prod-price">R$ 145.000</span>
              </div>
               <div className="prod-stars">
                {[...Array(5)].map((_, i) => <Star key={i} className="text-gold fill-gold" />)}
              </div>
            </div>
          </div>

          {/* Produto 8 */}
          <div className="prod-card reveal reveal-delay-3">
            <div className="prod-img-wrap">
              <img src="https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=800&auto=format&fit=crop" alt="Pingente" referrerPolicy="no-referrer" />
              <div className="prod-actions">
                <button className="prod-btn prod-btn-main">Adicionar</button>
                <button className="prod-btn prod-btn-wish">Lista de Desejos</button>
              </div>
            </div>
            <div className="prod-info">
              <h4 className="prod-brand">Clássicos</h4>
              <h3 className="prod-name">Pingente Solitário</h3>
              <div className="prod-price-row">
                <span className="prod-price">R$ 7.800</span>
              </div>
               <div className="prod-stars">
                {[...Array(5)].map((_, i) => <Star key={i} className="text-gold fill-gold" />)}
              </div>
            </div>
          </div>

        </div>
        
        <div className="flex justify-center mt-16 reveal">
           <button className="btn-ghost" style={{ cursor: 'pointer' }}>Ver Todo o Catálogo <ArrowUpRight className="w-4 h-4" /></button>
        </div>
      </section>

      {/* Editorial 2 */}
      <section className="editorial" style={{ direction: 'rtl' }}>
        <div className="editorial-img">
          <img src="https://images.unsplash.com/photo-1629813134914-9980556db1e2?q=80&w=1200&auto=format&fit=crop" alt="Diamantes Lapidados" referrerPolicy="no-referrer" style={{ filter: 'grayscale(0.5) contrast(1.1) brightness(0.8)' }} />
        </div>
        <div className="editorial-content" style={{ direction: 'ltr' }}>
          <div className="editorial-inner reveal">
             <div className="sec-tag">CERTIFICAÇÃO DE EXCELÊNCIA</div>
             <h2 className="editorial-title">Padrões de <em>Pureza Inatingíveis</em></h2>
             <p className="editorial-body">
               Excedemos as normas da indústria de joalheria. Nossos especialistas avaliam pessoalmente cada gema, 
               recusando tudo o que não seja perfeito. Ao escolher uma peça Fernandes, você adquire a promessa de 
               uma imutabilidade valiosa e beleza transcendental.
             </p>
             <button className="btn-primary" style={{ marginTop: '1rem' }}><span>Entenda os 4C's</span></button>
          </div>
        </div>
      </section>

      <div className="ornament">
        <div className="ornament-line"></div>
        <div className="ornament-diamond"></div>
        <div className="ornament-line"></div>
      </div>

      <section className="testimonials">
         <div className="sec-header reveal">
          <div className="sec-tag">Ecos de Elegância</div>
          <h2 className="sec-title">Vozes de <em>Distinção</em></h2>
        </div>
        <div className="testi-grid reveal">
          <div className="testi-card">
            <div className="testi-quote">"</div>
            <p className="testi-text">"Acima de tudo, adquiri uma joia de arte. A precisão do acabamento me deixa maravilhada todos os dias. Exclusividade verdadeira."</p>
            <div className="testi-author">
              <div className="testi-avatar">C</div>
              <div>
                <div className="testi-name">Camila Vasconcelos</div>
                <div className="testi-loc">São Paulo, SP</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-quote">"</div>
            <p className="testi-text">"Para o meu casamento, queria algo que fosse além do ouro. A Fernandes nos entregou poesia em formato de alianças. Serviço impecável."</p>
            <div className="testi-author">
              <div className="testi-avatar">R</div>
              <div>
                <div className="testi-name">Rodrigo & Mariana</div>
                <div className="testi-loc">Curitiba, PR</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-quote">"</div>
            <p className="testi-text">"Coleciono alta joalheria há anos. O colar da coleção Aurora é tranquilamente uma das peças mais arrebatadoras da minha coleção."</p>
            <div className="testi-author">
              <div className="testi-avatar">M</div>
              <div>
                <div className="testi-name">Marcos Lazzotto</div>
                <div className="testi-loc">Rio de Janeiro, RJ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="nl-ornament">FERNANDES</div>
        <div className="sec-header reveal" style={{ marginBottom: '2rem' }}>
          <div className="sec-tag">O Culto ao Belo</div>
          <h2 className="sec-title">Acesso <em>Privilegiado</em></h2>
          <p className="sec-desc">Convites exclusivos, revelações antecipadas de coleções e curadoria editorial diretamente ao seu alcance.</p>
        </div>
        <div className="reveal reveal-delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="nl-form">
            <input type="email" className="nl-input" placeholder="Seu correio eletrônico" />
            <button className="nl-submit">Inscrever</button>
          </div>
          <p className="nl-note">Respeitamos a sua privacidade absoluta.</p>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div className="footer-col footer-brand">
            <div className="nav-logo" style={{ color: 'var(--off-white)' }}>
              FERNANDES <span style={{ color: 'var(--gold)' }}>Joias Finas</span>
            </div>
            <p>Concebendo uma estética inigualável. Uma verdadeira instituição brasileira de luxo e tradição ourivesaria.</p>
            <div className="footer-socials">
              <a href="#" className="social-link"><Instagram /></a>
              <a href="#" className="social-link"><Facebook /></a>
              <a href="#" className="social-link"><Twitter /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Descubra</h4>
            <ul>
              <li><a href="#">Maison Fernandes</a></li>
              <li><a href="#">Coleções 2026</a></li>
              <li><a href="#">Catálogo Geral</a></li>
              <li><a href="#">Guias de Presente</a></li>
              <li><a href="#">Diamantes Certificados</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Assistência</h4>
            <ul>
              <li><a href="#">Cuidados com a Joia</a></li>
              <li><a href="#">Garantia Perpétua</a></li>
              <li><a href="#">Envio e Rastreio</a></li>
              <li><a href="#">Trocas Artísticas</a></li>
            </ul>
          </div>
          <div className="footer-col footer-contact">
            <h4>Boutiques</h4>
            <p><strong>São Paulo</strong><br/>Shopping Cidade Jardim, Térreo</p>
            <p><strong>Rio de Janeiro</strong><br/>VillageMall, Piso L1</p>
            <div style={{ marginTop: '1.5rem' }}>
              <p><strong>Concierge:</strong><br/>+55 (11) 3000-0000</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Fernandes Joias Finas. Criado com maestria.</p>
          <div className="payment-icons">
            <span className="pay-icon">VISA</span>
            <span className="pay-icon">MASTER</span>
            <span className="pay-icon">AMEX</span>
            <span className="pay-icon">PIX</span>
          </div>
          <p><a href="#">Termos de Uso</a> &nbsp;|&nbsp; <a href="#">Privacidade</a></p>
        </div>
      </footer>
    </>
  );
}
