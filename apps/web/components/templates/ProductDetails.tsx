'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Shield, Gem, Award, Clock, Check, Sparkles, ArrowLeft, ArrowUpRight, X, Heart } from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { useWishlist } from '../../lib/wishlist-context';

interface Variant {
  id: string;
  sku: string;
  size: string;
  priceAdjustment: number;
  inventory?: {
    quantityAvailable: number;
    quantityReserved: number;
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
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const getStock = (v: any) => {
    if (!v.inventory) return 99; // Fallback to in-stock if inventory data is not present
    return typeof v.inventory.quantityAvailable === 'number'
      ? v.inventory.quantityAvailable
      : (typeof v.inventory.quantity === 'number' ? v.inventory.quantity : 0);
  };

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(() => {
    const inStock = product.variants.find((v) => getStock(v) > 0);
    return inStock || (product.variants.length > 0 ? (product.variants[0] ?? null) : null);
  });

  const [engravingText, setEngravingText] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState<number>(
    Number(product.basePrice) + (selectedVariant ? Number(selectedVariant.priceAdjustment) : 0)
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [isAddedToBag, setIsAddedToBag] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Zoom State
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  // Dynamic price calculation with API debounce
  useEffect(() => {
    if (!selectedVariant) return;

    const baseAndVariantPrice = Number(product.basePrice) + Number(selectedVariant.priceAdjustment);

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
          const resJson = await res.json();
          if (resJson && resJson.success && typeof resJson.data?.totalCost === 'number') {
            setCalculatedPrice(resJson.data.totalCost);
          } else {
            const costPerChar = 10;
            setCalculatedPrice(baseAndVariantPrice + engravingText.length * costPerChar);
          }
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
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: selectedVariant ? selectedVariant.sku : null,
      size: selectedVariant ? selectedVariant.size : null,
      engravingText: engravingText,
      unitPrice: calculatedPrice,
      imageUrl: product.certificationUrl,
      quantity: 1
    });

    setIsAddedToBag(true);
    setTimeout(() => {
      setIsAddedToBag(false);
    }, 2500);
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="min-h-screen bg-[#070707] text-[#EDE6D6] font-sans antialiased selection:bg-[#C9A84C] selection:text-[#070707]">
      
      {/* Split Magazine Layout */}
      <main className="max-w-7xl mx-auto px-6 pt-36 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div 
              className="aspect-[3/4] relative bg-[#141414] overflow-hidden border border-[#F5F0E6]/5 cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {product.certificationUrl ? (
                <img
                  src={product.certificationUrl}
                  alt={product.name}
                  className="w-full h-full object-cover filter brightness-[0.9] transition-transform duration-100"
                  style={isZoomed ? {
                    transform: 'scale(2.2)',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                  } : {}}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gem className="w-20 h-20 text-[#EDE6D6]/10" />
                </div>
              )}
              
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#0B0B0B]/90 border border-[#C9A84C]/25 text-[8px] tracking-[0.45em] uppercase text-[#C9A84C] flex items-center gap-2 pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" /> Alta Joalheria
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
              <div className="flex justify-between items-start">
                <span className="text-[9px] tracking-[0.45em] uppercase text-[#C9A84C] font-semibold mb-4 block">Boutique Exclusiva</span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-[#EDE6D6]/60 hover:text-[#C9A84C] transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#C9A84C] text-[#C9A84C]' : ''}`} />
                  {wishlisted ? 'Guardado' : 'Desejar'}
                </button>
              </div>
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
                  <button 
                    onClick={() => setShowSizeGuide(true)} 
                    className="text-[8px] text-[#C9A84C] hover:underline uppercase tracking-[0.3em] font-medium bg-transparent border-none outline-none cursor-pointer"
                  >
                    Guia de Medidas
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const quantity = getStock(v);
                    const isOutOfStock = quantity <= 0;
                    const isSelected = selectedVariant?.sku === v.sku;

                    return (
                      <button
                        key={v.id || v.sku}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedVariant(v)}
                        className={`min-w-[48px] h-12 flex items-center justify-center border text-[11px] tracking-wider relative transition-all duration-300 ${
                          isOutOfStock
                            ? 'border-[#F5F0E6]/5 text-[#EDE6D6]/20 cursor-not-allowed'
                            : isSelected
                              ? 'border-[#C9A84C] bg-[#C9A84C] text-[#0B0B0B] font-semibold'
                              : 'border-[#F5F0E6]/10 hover:border-[#F5F0E6]/30 bg-[#141414] text-[#EDE6D6]'
                        }`}
                      >
                        {v.size}
                        {isOutOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="absolute w-[1px] h-full bg-[#EDE6D6]/20 rotate-45" />
                          </span>
                        )}
                      </button>
                    );
                  })}
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

      {/* Premium Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)} />
          <div className="relative bg-[#0F0F0F] border border-[#C9A84C]/25 max-w-md w-full p-8 shadow-2xl">
            <button 
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 text-[#EDE6D6]/40 hover:text-white"
              aria-label="Close guide"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-serif text-2xl text-[#F5F0E6] mb-2 text-center">Guia de Medidas</h3>
            <p className="text-[10px] tracking-[0.2em] text-[#C9A84C] uppercase text-center mb-6">Aro de Anel & Diâmetro</p>
            
            <div className="max-h-[300px] overflow-y-auto border-t border-b border-[#C9A84C]/15 py-2">
              <table className="w-full text-left text-xs text-[#EDE6D6]/80">
                <thead>
                  <tr className="border-b border-[#C9A84C]/10 text-[9px] uppercase tracking-wider text-[#C9A84C]">
                    <th className="py-2">Aro</th>
                    <th className="py-2">Circunferência (mm)</th>
                    <th className="py-2">Diâmetro (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    [10, 50.0, 15.9],
                    [12, 52.0, 16.5],
                    [14, 54.0, 17.2],
                    [16, 56.0, 17.8],
                    [18, 58.0, 18.5],
                    [20, 60.0, 19.1],
                    [22, 62.0, 19.7],
                    [24, 64.0, 20.3],
                    [26, 66.0, 21.0]
                  ] as const).map(([aro, circ, diam]) => (
                    <tr key={aro} className="border-b border-[#EDE6D6]/5 hover:bg-[#C9A84C]/5">
                      <td className="py-2 font-medium">{aro}</td>
                      <td className="py-2">{circ.toFixed(1)}</td>
                      <td className="py-2">{diam.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[9px] text-[#EDE6D6]/40 mt-4 leading-relaxed uppercase tracking-wider text-center">
              Dica: Use uma fita ao redor do dedo e compare a medida em milímetros com a tabela.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
