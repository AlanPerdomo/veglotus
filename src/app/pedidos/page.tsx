'use client';
import { orderService } from '@/service/order.service';
import { paymentService } from '@/service/payment.service';
import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

interface order {
  id: number;
  deliveryFee: number;
  total: number;
  status: string;
  address: string;
  orderProducts: orderProduct[];
  paymentStatus: string;
  MLpaymentId: string;
  createdAt: string;
  updatedAt: string;
}

interface orderProduct {
  id: number;
  quantity: number;
  product: product;
  price: number;
}

interface product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<order[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      initMercadoPago(process.env.MERCADO_PAGO_PUBLIC_KEY!, {});
      const newOrder = localStorage.getItem('newOrder');
      let pedidos = JSON.parse(localStorage.getItem('orders')!);

      if (!pedidos) {
        await meusPedidos();
        pedidos = JSON.parse(localStorage.getItem('orders')!);
      } else {
        sortOrders(pedidos);
      }

      if (newOrder && pedidos) {
        console.log('newOrder:', newOrder);
        await meusPedidos();
        const pedidoId = JSON.parse(newOrder);
        const pedido = pedidos.find((pedido: order) => pedido.id === pedidoId);
        setSelectedPedido(pedido);
        setModalOpen(true);
      }
    };

    fetchData();
  }, []);

  const meusPedidos = async () => {
    if (localStorage.getItem('isLogged') === 'true') {
      const pedidos = await orderService.listar();
      sortOrders(pedidos);
    } else {
      window.location.href = '/user/login';
    }
  };

  const sortOrders = (pedidos: order[]) => {
    const sortedPedidos = pedidos.sort((a, b) => b.id - a.id);
    setPedidos(sortedPedidos);
  };

  const openModal = (pedido: order) => {
    setSelectedPedido(pedido);
    setModalOpen(true);
  };

  const closeModal = () => {
    localStorage.removeItem('newOrder');
    setSelectedPedido(null);
    setModalOpen(false);
  };

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 10);
  };

  const parseEndereco = (enderecoStr: string) => {
    try {
      return JSON.parse(enderecoStr);
    } catch (error) {
      return null;
    }
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} às ${hours}:${minutes}h`;
  }

  const cancelarPedido = async (pedidoId: number) => {
    try {
      await orderService.cancel(pedidoId);
      await meusPedidos();
    } catch (error) {
      console.error('Erro ao cancelar o pedido:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-black mb-8">Meus Pedidos</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {pedidos.length === 0 ? (
            <div className="text-center text-gray-500">Você ainda não fez nenhum pedido.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pedidos.slice(0, visibleCount).map(pedido => (
                <div
                  key={pedido.id}
                  onClick={() => openModal(pedido)}
                  className="cursor-pointer border p-4 rounded-lg hover:shadow-xl transition-all bg-white"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-auto">
                      <h3 className="text-black font-semibold">Pedido #{pedido.id}</h3>
                      <p className="text-black  ">Pedido realizado em {formatDate(pedido.createdAt)}</p>
                    </div>
                    <div className="flex flex-col items-end text-black gap-auto">
                      <p className="text-gray-500">Status: {pedido.status}</p>
                      <p className="text-green-800 font-bold ">
                        <span className="text-black">Total: </span> R$ {pedido.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {pedidos.length > visibleCount && (
            <button
              onClick={loadMore}
              className="mt-6 w-full flex justify-center items-center bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold rounded-md py-2"
            >
              Exibir Mais Pedidos
            </button>
          )}
          <button
            onClick={meusPedidos}
            className="mt-6 w-full flex justify-center items-center bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md py-2"
          >
            Atualizar Pedidos
          </button>
        </div>
      </div>
      {modalOpen && selectedPedido && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full p-6 text-black overflow-y-auto max-h-screen max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Detalhes do Pedido #{selectedPedido.id}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-3xl leading-none">
                &times;
              </button>
            </div>
            <div className="text-black mb-4 ">
              <span className="font-semibold">Pedido feito:</span> {formatDate(selectedPedido.createdAt)}
              <p>
                <span className="font-semibold">Status do Pedido:</span> {selectedPedido.status}
              </p>
              <p className="mt-4">
                <span className="font-semibold">Entrega:</span> R$ {selectedPedido.deliveryFee.toFixed(2)}
              </p>
              <p>
                <span className="font-semibold">Total:</span> R$ {selectedPedido.total.toFixed(2)}
              </p>
              {selectedPedido.address &&
                (() => {
                  const endereco = parseEndereco(selectedPedido.address);
                  return endereco ? (
                    <div className="mt-4">
                      <p className="font-bold">Endereço:</p>
                      <p>
                        {endereco.rua.toUpperCase()}, {endereco.numero}
                        {endereco.complemento ? ` - ${endereco.complemento}` : ''}
                      </p>
                      <p>
                        {endereco.bairro}, {endereco.cidade} - {endereco.estado}
                      </p>
                      <p>
                        {endereco.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}, {endereco.pais}
                      </p>
                    </div>
                  ) : (
                    <p>
                      <span className="font-semibold">Endereço:</span> {selectedPedido.address}
                    </p>
                  );
                })()}
              {selectedPedido.orderProducts && (
                <div className="mt-4">
                  <p className="font-semibold">Produtos do Pedido:</p>
                  <ul>
                    {selectedPedido.orderProducts.map(orderProduct => (
                      <li key={orderProduct.id} className="flex justify-between">
                        <div>{orderProduct.product.name.toUpperCase()}</div>
                        <div className="flex gap-4">
                          <p>Quantidade: {orderProduct.quantity}</p>
                          <p>| Preço Unitário: R$ {orderProduct.price.toFixed(2)}</p>
                          <p>| Subtotal: R$ {(orderProduct.price * orderProduct.quantity).toFixed(2)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedPedido.status === 'Aguardando Pagamento' && (
                <div>
                  <Wallet initialization={{ preferenceId: selectedPedido.MLpaymentId, redirectMode: 'self' }} />
                </div>
              )}
              <button className="text-black hover:text-red-600" onClick={() => cancelarPedido(selectedPedido.id)}>
                Cancelar Pedido
              </button>
              {/* <button className=" text-black hover:text-blue-600  ">Acompanhar Entrega</button>  */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
