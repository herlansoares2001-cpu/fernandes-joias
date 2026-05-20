'use client';

export default function Testimonials() {
  const reviews = [
    {
      avatar: 'C',
      author: 'Camila Vasconcelos',
      location: 'São Paulo, SP',
      text: 'Acima de tudo, adquiri uma joia de arte. A precisão do acabamento me deixa maravilhada todos os dias. Exclusividade verdadeira.',
    },
    {
      avatar: 'R',
      author: 'Rodrigo & Mariana',
      location: 'Curitiba, PR',
      text: 'Para o meu casamento, queria algo que fosse além do ouro. A Fernandes nos entregou poesia em formato de alianças. Serviço impecável.',
    },
    {
      avatar: 'M',
      author: 'Marcos Lazzotto',
      location: 'Rio de Janeiro, RJ',
      text: 'Coleciono alta joalheria há anos. O colar da coleção Aurora é tranquilamente uma das peças mais arrebatadoras da minha coleção.',
    },
  ];

  return (
    <section id="testimonials" className="testimonials">
      <div className="max-w-7xl mx-auto w-full">
        <div className="sec-header reveal">
          <div className="sec-tag">Ecos de Elegância</div>
          <h2 className="sec-title">Vozes de <em>Distinção</em></h2>
        </div>
        
        <div className="testi-grid reveal">
          {reviews.map((review, idx) => (
            <div key={idx} className="testi-card">
              <div className="testi-quote">"</div>
              <p className="testi-text">
                "{review.text}"
              </p>
              <div className="testi-author">
                <div className="testi-avatar">{review.avatar}</div>
                <div>
                  <div className="testi-name">{review.author}</div>
                  <div className="testi-loc">{review.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
