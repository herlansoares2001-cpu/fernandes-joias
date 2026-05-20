'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Shield, Gem, Award, Clock, Check, Sparkles, ArrowLeft, ArrowUpRight } from 'lucide-react';

interface Variant {
  id: string;
  sku: string;
  size: string;
  priceAdjustment: number;
  inventory?: {
    quantity: number;
  } | null;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  certificationUrl: string | null;
  variants: Variant[];
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? (product.variants[0] ?? null) : null
  );
  const [engravingText, setEngravingText] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState<number>(
    product.basePrice + (selectedVariant ? Number(selectedVariant.priceAdjustment) : 0)
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [isAddedToBag, setIsAddedToBag] = useState(false);

  // Dynamic price calculation with API debounce
  useEffect(() => {
    if (!selectedVariant) return;

    const baseAndVariantPrice = product.basePrice + Number(selectedVariant.priceAdjustment);

    if (engravingText.trim() === '') {
      setCalculatedPrice(baseAndVariantPrice);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCalculating(true);
      try {
        const res = await fetch('http://localhost:3002/api/v1/products/engraving', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sku: selectedVariant.sku,
            text: engravingText,
          }),
        });
        if (res.ok) {
          const finalPrice = await res.json();
          setCalculatedPrice(finalPrice);
        } else {
          const costPerChar = 10;
          setCalculatedPrice(baseAndVariantPrice + engravingText.length * costPerChar);
        }
      } catch (err) {
        console.error('Failed to calculate engraving price:', err);
        const costPerChar = 10;
        setCalculatedPrice(baseAndVariantPrice + engravingText.length * costPerChar);
      } finally {
        setIsCalculating(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [engravingText, selectedVariant, product.basePrice]);

  const handleAddToBag = () => {
    setIsAddedToBag(true);
    setTimeout(() => {
      setIsAddedToBag(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#EDE6D6] font-sans antialiased selection:bg-[#C9A84C] selection:text-[#070707]">
      
      {/* 2. Split Magazine Layout */}
      <main className="max-w-7xl mx-auto px-6 pt-36 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="aspect-[3/4] relative bg-[#141414] overflow-hidden border border-[#F5F0E6]/5">
              {product.certificationUrl ? (
                <img
                  src={product.certificationUrl}
                  alt={product.name}
                  className="w-full h-full object-cover filter brightness-[0.9]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gem className="w-20 h-20 text-[#EDE6D6]/10" />
                </div>
              )}
              
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#0B0B0B]/90 border border-[#C9A84C]/25 text-[8px] tracking-[0.45em] uppercase text-[#C9A84C] flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Alta Joalheria
              </div>
            </div>

            {/* Atelier details cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-[#F5F0E6]/5 bg-[#141414] p-8 flex items-start gap-5">
                <Award className="w-5 h-5 text-[#C9A84C] shrink-0" />
                <div>
                  <h4 className="font-serif text-base text-[#F5F0E6] font-light mb-2">Prata de Lei 925</h4>
                  <p className="text-[11px] text-[#EDE6D6]/50 leading-relaxed font-light">
                    Selo de autenticidade atestando a pureza máxima do metal e lapidação artesanal impecável.
                  </p>
                </div>
              </div>
              <div className="border border-[#F5F0E6]/5 bg-[#141414] p-8 flex items-start gap-5">
                <Clock className="w-5 h-5 text-[#C9A84C] shrink-0" />
                <div>
                  <h4 className="font-serif text-base text-[#F5F0E6] font-light mb-2">Garantia Eterna</h4>
                  <p className="text-[11px] text-[#EDE6D6]/50 leading-relaxed font-light">
                    Cobertura vitalícia para manutenção estrutural, polimento anual e preservação do acabamento de luxo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Details */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            
            {/* Header info */}
            <div className="border-b border-[#F5F0E6]/10 pb-8 mb-8">
              <span className="text-[9px] tracking-[0.45em] uppercase text-[#C9A84C] font-semibold mb-4 block">Boutique Exclusiva</span>
              <h1 className="font-serif text-4xl md:text-5xl leading-tight text-[#F5F0E6] mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-3xl font-serif text-[#C9A84C]">
                  R$ {calculatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                {isCalculating && (
                  <span className="text-[8px] uppercase tracking-[0.3em] text-[#EDE6D6]/30 animate-pulse">
                    Recalculando...
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-[9px] tracking-[0.4em] uppercase text-[#EDE6D6]/60 mb-3 font-semibold">Narrativa</h3>
              <p className="text-[12px] text-[#EDE6D6]/50 leading-relaxed font-light">
                {product.description.replace(/<[^>]*>/g, '')}
              </p>
            </div>

            {/* Size selector */}
            {product.variants.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[9px] tracking-[0.4em] uppercase text-[#EDE6D6]/60 font-semibold">Aro (Tamanho)</h3>
                  <a href="#" className="text-[8px] text-[#C9A84C] hover:underline uppercase tracking-[0.3em] font-medium">
                    Guia de Medidas
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`min-w-[48px] h-12 flex items-center justify-center border text-[11px] tracking-wider transition-all duration-300 ${
                        selectedVariant?.id === v.id
                          ? 'border-[#C9A84C] bg-[#C9A84C] text-[#0B0B0B] font-semibold'
                          : 'border-[#F5F0E6]/10 hover:border-[#F5F0E6]/30 bg-[#141414] text-[#EDE6D6]'
                      }`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Laser Customization */}
            <div className="border border-[#C9A84C]/15 bg-[#C9A84C]/[0.02] p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] tracking-[0.4em] uppercase text-[#EDE6D6]/65 font-semibold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" /> Personalizar Gravação
                </span>
                <span className="text-[8px] text-[#C9A84C] uppercase tracking-[0.3em] font-semibold">
                  + R$ 10,00 por caractere
                </span>
              </div>
              <input
                type="text"
                maxLength={30}
                placeholder="Ex: AMOR INCONDICIONAL"
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value)}
                className="w-full bg-[#141414] border border-[#F5F0E6]/10 px-4 py-3 text-xs tracking-widest focus:border-[#C9A84C] focus:outline-none placeholder-[#EDE6D6]/20 transition-all uppercase text-white"
              />
              <div className="flex justify-between items-center mt-3 text-[8px] text-[#EDE6D6]/40 uppercase tracking-[0.35em]">
                <span>Esculpido à laser no atelier</span>
                <span>{engravingText.length}/30 letras</span>
              </div>
            </div>

            {/* Redis Reservation Guarantee banner */}
            <div className="flex items-start gap-4 border border-[#F5F0E6]/5 bg-[#141414] px-6 py-5 mb-8">
              <Clock className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#EDE6D6]/45 leading-relaxed font-light">
                <strong className="text-[#C9A84C] font-semibold">Garantia de Reserva:</strong> Ao reservar, o item ficará retido com exclusividade em sua sacola por <span className="underline">15 minutos</span> através de nosso banco seguro.
              </p>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleAddToBag}
              disabled={isAddedToBag}
              className={`w-full h-14 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.35em] font-bold transition-all duration-500 transform ${
                isAddedToBag
                  ? 'bg-green-700 text-[#F5F0E6]'
                  : 'bg-[#C9A84C] hover:bg-[#E2C97E] text-[#0B0B0B]'
              }`}
            >
              {isAddedToBag ? (
                <>
                  <Check className="w-4 h-4" /> Item Reservado
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Reservar Peça <ArrowUpRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Trust Footer */}
            <div className="mt-8 flex justify-center items-center gap-6 border-t border-[#F5F0E6]/5 pt-8 text-[8px] text-[#EDE6D6]/35 uppercase tracking-[0.35em]">
              <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Transação Segura</span>
              <span>•</span>
              <span>Frete com Seguro Privado</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
