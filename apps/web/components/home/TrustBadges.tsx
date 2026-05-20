'use client';

import { Shield, Award, RotateCcw } from 'lucide-react';

export default function TrustBadges() {
  return (
    <section id="trust" className="py-20 bg-[#070707] border-b border-[#C9A84C]/15">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="flex items-start gap-5">
            <Shield className="w-6 h-6 text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#EDE6D6] font-bold mb-2">Envio 100% Seguro</h4>
              <p className="text-xs text-[#EDE6D6]/50 leading-relaxed font-light">
                Nossas peças são enviadas em caixas lacradas com blindagem magnética e rastreabilidade total por satélite.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-5">
            <Award className="w-6 h-6 text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#EDE6D6] font-bold mb-2">Garantia Eterna do Metal</h4>
              <p className="text-xs text-[#EDE6D6]/50 leading-relaxed font-light">
                Acompanha certificado assinado e selado de autenticidade vitalícia do metal precioso Ouro 18K e Prata 925.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-5">
            <RotateCcw className="w-6 h-6 text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#EDE6D6] font-bold mb-2">Trocas Sem Complicações</h4>
              <p className="text-xs text-[#EDE6D6]/50 leading-relaxed font-light">
                Disponibilizamos suporte completo para troca de aro ou ajuste de gravação de forma totalmente grátis em até 7 dias.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
