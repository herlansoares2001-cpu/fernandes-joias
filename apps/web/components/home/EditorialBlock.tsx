'use client';

import { ArrowUpRight } from 'lucide-react';

export function EditorialOne() {
  return (
    <section className="bg-[#141414] w-full">
      <div className="max-w-7xl mx-auto w-full editorial">
        <div className="editorial-img">
          <img 
            src="https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=1200&auto=format&fit=crop" 
            alt="Artesão trabalhando" 
            referrerPolicy="no-referrer" 
          />
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
            <div className="btn-ghost" style={{ cursor: 'pointer' }}>
              Conheça o Ateliê <ArrowUpRight className="w-4 h-4 text-[#C9A84C]"/>
            </div>
            <div className="editorial-sig">Fernandes Joias</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EditorialTwo() {
  return (
    <section className="bg-[#141414] w-full" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto w-full editorial">
        <div className="editorial-img">
          <img 
            src="https://images.unsplash.com/photo-1629813134914-9980556db1e2?q=80&w=1200&auto=format&fit=crop" 
            alt="Diamantes Lapidados" 
            referrerPolicy="no-referrer" 
            style={{ filter: 'grayscale(0.5) contrast(1.1) brightness(0.8)' }} 
          />
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
             <button className="btn-primary" style={{ marginTop: '1rem' }}>
               <span>Entenda os 4C's</span>
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}
