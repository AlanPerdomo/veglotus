// 'use client';
// import { useEffect, useState } from 'react';
// import { orderService } from '@/service/order.service';

// interface Order {
//   id: string;
//   userId: string;
//   produtos: any[]; // Ajuste o tipo conforme sua estrutura de pedido
//   paymentStatus: string;
//   // Outros campos que sua API retorne...
// }

// export default function Pagamento() {
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Recupera os dados do pedido do localStorage
//     const savedOrder = localStorage.getItem('order');
//     if (savedOrder) {
//       setOrder(JSON.parse(savedOrder));
//     }
//   }, []);

//   const handleMercadoPago = async () => {
//     if (!order) {
//       alert('Nenhum pedido encontrado.');
//       return;
//     }
//     setLoading(true);
//     try {
//       // Exemplo: chamar um serviço para criar a preferência de pagamento com o Mercado Pago.
//       // Ajuste a chamada e a estrutura de resposta conforme sua implementação.
//       const response = await orderService.createPaymentPreference(order.id);
//       if (response?.init_point) {
//         // Redireciona o usuário para o gateway do Mercado Pago
//         window.location.href = response.init_point;
//       } else {
//         alert('Erro ao iniciar pagamento.');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Erro ao processar pagamento.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 p-6">
//       <h2 className="text-3xl font-bold text-center mb-6 text-black">Pagamento</h2>
//       {order ? (
//         <div className="space-y-4">
//           <h3 className="text-xl font-semibold">Resumo do Pedido:</h3>
//           {/* Exemplo de exibição dos dados do pedido */}
//           <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-700">
//             {JSON.stringify(order, null, 2)}
//           </pre>
//           <button
//             onClick={handleMercadoPago}
//             className="w-full bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold py-3 rounded-md"
//             disabled={loading}
//           >
//             {loading ? 'Processando...' : 'Pagar com Mercado Pago'}
//           </button>
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>
//       )}
//     </div>
//   );
// }
