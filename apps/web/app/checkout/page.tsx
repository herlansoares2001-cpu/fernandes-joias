"use client";

import { useState } from 'react';
import { Button } from '../../components/atoms/Button';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Mocking the payment intent flow
    // 1. Backend Redis Lock acquired
    // 2. Stripe/MercadoPago payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 shadow-xl rounded-lg text-center"
        >
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif text-gray-900 mb-2">Pedido Confirmado</h2>
          <p className="text-gray-600 mb-6">Sua joia exclusiva foi reservada e o pagamento foi aprovado com sucesso.</p>
          <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
            Voltar à Vitrine
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Checkout Form */}
        <div className="bg-white p-8 shadow-sm rounded-lg">
          <h2 className="text-2xl font-serif font-light text-gray-900 mb-6">Checkout Exclusivo</h2>
          <form onSubmit={handleCheckout} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Guest Checkout)</label>
              <input type="email" id="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" />
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pagamento Seguro</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="card" className="block text-sm font-medium text-gray-700">Número do Cartão</label>
                  <input type="text" id="card" placeholder="0000 0000 0000 0000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="exp" className="block text-sm font-medium text-gray-700">Validade</label>
                    <input type="text" id="exp" placeholder="MM/AA" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                    <input type="text" id="cvc" placeholder="123" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" size="lg" disabled={isProcessing}>
              {isProcessing ? 'Processando...' : 'Finalizar Compra Segura'}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 p-8 shadow-sm rounded-lg h-fit">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Resumo do Pedido</h2>
          <div className="flow-root">
            <ul className="-my-4 divide-y divide-gray-200">
              <li className="flex items-center py-4">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                  <img src="https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&q=80&w=200" alt="Anel" className="h-full w-full object-cover object-center" />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>Anel de Diamante em Ouro 18k</h3>
                      <p className="ml-4">R$ 14.500,00</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Aro 14</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-6 space-y-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>R$ 14.500,00</p>
            </div>
            <div className="flex justify-between">
              <p>Frete (Seguro Incluso)</p>
              <p>Grátis</p>
            </div>
            <div className="flex justify-between font-medium text-gray-900 text-lg border-t border-gray-200 pt-4">
              <p>Total</p>
              <p>R$ 14.500,00</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
