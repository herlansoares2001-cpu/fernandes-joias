'use client';

export default function Footer() {
  return (
    <footer>
      <div className="max-w-7xl mx-auto w-full">
        <div className="footer-top">
          <div className="footer-col footer-brand">
            <div className="nav-logo" style={{ color: 'var(--off-white)' }}>
              FERNANDES <span style={{ color: 'var(--gold)' }}>Joias Finas</span>
            </div>
            <p>Concebendo uma estética inigualável. Uma verdadeira instituição brasileira de luxo e tradição ourivesaria.</p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Instagram">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
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
      </div>
    </footer>
  );
}
