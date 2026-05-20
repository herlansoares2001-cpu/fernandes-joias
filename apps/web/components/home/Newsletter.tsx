'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="nl-ornament">FERNANDES</div>
        
        <div className="sec-header reveal" style={{ marginBottom: '2rem' }}>
          <div className="sec-tag">O Culto ao Belo</div>
          <h2 className="sec-title">Acesso <em>Privilegiado</em></h2>
          <p className="sec-desc">
            Convites exclusivos, revelações antecipadas de coleções e curadoria editorial diretamente ao seu alcance.
          </p>
        </div>

        <div className="reveal reveal-delay-1 flex flex-col items-center">
          {subscribed ? (
            <div className="px-8 py-4 bg-[#141414] border border-[#C9A84C]/30 text-center max-w-md">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C]">Acesso concedido. Bem-vindo à Maison.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="nl-form">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="nl-input" 
                placeholder="Seu correio eletrônico" 
                required
              />
              <button type="submit" className="nl-submit">Inscrever</button>
            </form>
          )}
          <p className="nl-note">Respeitamos a sua privacidade absoluta.</p>
        </div>
      </div>
    </section>
  );
}
