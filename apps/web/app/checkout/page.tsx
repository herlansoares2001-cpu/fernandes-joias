"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '../../lib/cart-context';
import { Shield, CreditCard, Lock, Trash2, ArrowRight, Gem } from 'lucide-react';

export default function CheckoutPage() {
  const { items, removeItem, totalPrice, clearCart, isLoaded } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    card: '',
    exp: '',
    cvc: '',
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Ensure all items have a SKU (products with variants require a size selection)
      const itemsWithoutSku = items.filter(item => !item.sku);
      if (itemsWithoutSku.length > 0) {
        throw new Error(`Por favor, selecione um tamanho para: ${itemsWithoutSku.map(i => i.name).join(', ')}.`);
      }

      const payload = {
        items: items.map(item => ({
          sku: item.sku as string,
          quantity: item.quantity,
          engravingText: item.engravingText || undefined,
        })),
        idempotencyKey: typeof window !== 'undefined' && window.crypto ? window.crypto.randomUUID() : undefined,
      };

      const res = await fetch('http://localhost:3002/api/v1/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        // Handle array validation error message from NestJS ValidationPipe
        const message = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : (errorData.message || 'Erro ao processar a reserva de checkout.');
          
        throw new Error(message);
      }

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        clearCart();
      } else {
        throw new Error('Falha no processamento da transação.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao processar sua reserva segura.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#070707] text-[#EDE6D6] flex items-center justify-center font-sans">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] animate-pulse">Carregando Acervo...</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#070707] text-[#EDE6D6] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#0F0F0F] border border-[#C9A84C]/25 p-10 text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6 stroke-[1.2]" />
          </div>
          <h2 className="font-serif text-3xl text-[#F5F0E6] mb-3">Reserva Confirmada</h2>
          <div className="w-12 h-[1px] bg-[#C9A84C]/30 mx-auto mb-6" />
          <p className="text-xs text-[#EDE6D6]/70 leading-relaxed mb-8 font-light">
            Seu pedido de alta joalharia foi processado com sucesso. Nossos artesãos iniciarão a preparação das suas peças e o certificado digital de autenticidade será enviado para seu e-mail.
          </p>
          <Link 
            href="/" 
            className="w-full py-4 bg-[#C9A84C] text-[#070707] text-[10px] tracking-[0.25em] uppercase hover:bg-[#C9A84C]/80 transition-colors font-medium cursor-pointer block text-center"
          >
            Voltar ao Atelier
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#070707] text-[#EDE6D6] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center py-20">
          <h2 className="font-serif text-3xl text-[#F5F0E6] mb-4">Sua Sacola está Vazia</h2>
          <div className="w-12 h-[1px] bg-[#C9A84C]/30 mx-auto mb-6" />
          <p className="text-xs text-[#EDE6D6]/50 mb-8 font-light uppercase tracking-wider leading-relaxed">
            Nenhuma joia selecionada para reserva neste momento. Explore nosso catálogo exclusivo.
          </p>
          <Link 
            href="/catalog" 
            className="inline-block px-8 py-4 border border-[#C9A84C] text-[#C9A84C] text-[10px] tracking-[0.25em] uppercase hover:bg-[#C9A84C] hover:text-[#070707] transition-all duration-300 font-medium"
          >
            Explorar Acervo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-[#EDE6D6] py-32 px-4 sm:px-6 lg:px-8 flex justify-center font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left: Checkout Form */}
        <div className="lg:col-span-7 bg-[#0F0F0F] border border-[#F5F0E6]/5 p-8 md:p-12 shadow-2xl h-fit">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-serif font-light text-[#F5F0E6]">Checkout Exclusivo</h2>
          </div>
          
          <form onSubmit={handleCheckout} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-[9px] uppercase tracking-[0.2em] text-[#EDE6D6]/60 mb-2 font-medium">Nome Completo</label>
                <input 
                  type="text" 
                  id="name" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="COMO CONSTA NO CARTÃO"
                  className="w-full bg-[#141414] border border-[#F5F0E6]/10 px-4 py-3 text-xs tracking-widest focus:border-[#C9A84C] focus:outline-none placeholder-[#EDE6D6]/20 transition-all uppercase text-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[9px] uppercase tracking-[0.2em] text-[#EDE6D6]/60 mb-2 font-medium">Endereço de E-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="EXEMPLO@LUXO.COM"
                  className="w-full bg-[#141414] border border-[#F5F0E6]/10 px-4 py-3 text-xs tracking-widest focus:border-[#C9A84C] focus:outline-none placeholder-[#EDE6D6]/20 transition-all uppercase text-white"
                />
              </div>
            </div>
            
            <div className="pt-6 border-t border-[#F5F0E6]/10">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] mb-6 flex items-center gap-2 font-medium">
                <CreditCard className="w-4 h-4" /> Pagamento Seguro por Cartão
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="card" className="block text-[9px] uppercase tracking-[0.2em] text-[#EDE6D6]/60 mb-2 font-medium">Número do Cartão</label>
                  <input 
                    type="text" 
                    id="card" 
                    required
                    value={formData.card}
                    onChange={(e) => setFormData({...formData, card: e.target.value})}
                    placeholder="0000 0000 0000 0000" 
                    className="w-full bg-[#141414] border border-[#F5F0E6]/10 px-4 py-3 text-xs tracking-widest focus:border-[#C9A84C] focus:outline-none placeholder-[#EDE6D6]/20 transition-all text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="exp" className="block text-[9px] uppercase tracking-[0.2em] text-[#EDE6D6]/60 mb-2 font-medium">Validade</label>
                    <input 
                      type="text" 
                      id="exp" 
                      required
                      value={formData.exp}
                      onChange={(e) => setFormData({...formData, exp: e.target.value})}
                      placeholder="MM/AA" 
                      className="w-full bg-[#141414] border border-[#F5F0E6]/10 px-4 py-3 text-xs tracking-widest focus:border-[#C9A84C] focus:outline-none placeholder-[#EDE6D6]/20 transition-all text-white text-center"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-[9px] uppercase tracking-[0.2em] text-[#EDE6D6]/60 mb-2 font-medium">CVC</label>
                    <input 
                      type="password" 
                      id="cvc" 
                      required
                      maxLength={4}
                      value={formData.cvc}
                      onChange={(e) => setFormData({...formData, cvc: e.target.value})}
                      placeholder="000" 
                      className="w-full bg-[#141414] border border-[#F5F0E6]/10 px-4 py-3 text-xs tracking-widest focus:border-[#C9A84C] focus:outline-none placeholder-[#EDE6D6]/20 transition-all text-white text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-950/35 border border-red-500/25 text-red-200 text-[10px] tracking-wider uppercase leading-relaxed font-light">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full py-5 bg-[#C9A84C] hover:bg-[#E2C97E] text-[#070707] text-[10px] tracking-[0.3em] uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>Processando Reserva...</>
              ) : (
                <>
                  Confirmar Reserva Segura <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            <div className="flex justify-center items-center gap-4 text-[8px] text-[#EDE6D6]/40 uppercase tracking-[0.3em]">
              <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-[#C9A84C]" /> Proteção SSL</span>
              <span>•</span>
              <span>Criptografia de Ponta a Ponta</span>
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-[#0F0F0F] border border-[#F5F0E6]/5 p-8 md:p-12 shadow-2xl h-fit">
          <h2 className="text-xl font-serif text-[#F5F0E6] mb-8 pb-4 border-b border-[#F5F0E6]/10">Resumo da Sacola</h2>
          
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-[#F5F0E6]/10">
              {items.map((item) => (
                <li key={`${item.productId}-${item.sku || 'nosku'}-${item.engravingText || 'noengrave'}`} className="flex items-start py-6">
                  <div className="h-20 w-16 flex-shrink-0 overflow-hidden border border-[#F5F0E6]/5 bg-[#141414]">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center filter brightness-95" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gem className="w-6 h-6 text-[#EDE6D6]/10" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-xs font-serif text-[#EDE6D6]">
                        <h3 className="pr-4 leading-relaxed font-light">{item.name}</h3>
                        <p className="text-[#C9A84C] whitespace-nowrap font-sans text-[11px] font-semibold">
                          R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      {item.size && (
                        <p className="mt-1 text-[8px] text-[#EDE6D6]/40 uppercase tracking-widest font-sans">Tamanho / Aro: {item.size}</p>
                      )}
                      {item.engravingText && (
                        <p className="mt-1 text-[8px] text-[#C9A84C]/80 uppercase tracking-widest font-sans italic">Gravação: &quot;{item.engravingText}&quot;</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[9px] text-[#EDE6D6]/30 uppercase tracking-widest font-sans">Qtd: {item.quantity}</span>
                      <button 
                        onClick={() => removeItem(item.productId, item.sku)}
                        className="text-[#EDE6D6]/30 hover:text-red-400 p-1 transition-colors flex items-center gap-1.5 text-[8px] uppercase tracking-wider font-medium"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t border-[#F5F0E6]/10 mt-8 pt-8 space-y-4 text-xs text-[#EDE6D6]/60">
            <div className="flex justify-between font-light">
              <p className="uppercase tracking-widest text-[9px]">Subtotal</p>
              <p className="font-sans text-[11px] font-medium text-[#EDE6D6]">
                R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex justify-between font-light">
              <p className="uppercase tracking-widest text-[9px]">Seguro & Envio Privado</p>
              <p className="text-[#C9A84C] uppercase tracking-widest text-[9px] font-medium">Grátis</p>
            </div>
            <div className="flex justify-between text-[#F5F0E6] border-t border-[#F5F0E6]/10 pt-6">
              <p className="font-serif text-lg font-light">Total</p>
              <p className="font-sans text-xl font-semibold text-[#C9A84C]">
                R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
