'use client';

export default function Marquee() {
  return (
    <section className="marquee-strip">
      <div className="marquee-track">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="inline-flex items-center">
            <div className="marquee-item">Alta Joalheria Brasileira</div>
            <div className="marquee-sep"></div>
            <div className="marquee-item">Ouro 18k Certificado</div>
            <div className="marquee-sep"></div>
            <div className="marquee-item">Gemas Éticas Naturais</div>
            <div className="marquee-sep"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
