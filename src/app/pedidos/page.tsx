'use client';
import { orderService } from '@/service/order.service';
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
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true);
      initMercadoPago('APP_USR-4e2c712e-1b41-412b-8d15-5a9761bb0883', {});

      const newOrder = localStorage.getItem('newOrder');
      let pedidos = JSON.parse(localStorage.getItem('orders')!);

      if (!pedidos) {
        await meusPedidos();
        pedidos = JSON.parse(localStorage.getItem('orders')!);
      } else {
        sortOrders(pedidos);
      }

      if (newOrder && pedidos) {
        const pedidoId = JSON.parse(newOrder);
        const pedido = pedidos.find((pedido: order) => pedido.id === pedidoId);
        setSelectedPedido(pedido);
        setModalOpen(true);
      }
    };
    const meusPedidos = async () => {
      if (localStorage.getItem('isLogged') === 'true') {
        const pedidos = await orderService.meusPedidos();
        sortOrders(pedidos);
      } else {
        window.location.href = '/user/login';
      }
    };

    fetchData();
    // setIsLoading(false);
  }, []);

  const meusPedidos = async () => {
    if (localStorage.getItem('isLogged') === 'true') {
      const pedidos = await orderService.meusPedidos();
      sortOrders(pedidos);
    } else {
      window.location.href = '/user/login';
    }
  };

  const getStatusColor = (status: string) => {
    status = status.toLowerCase();
    switch (status) {
      case 'aguardando pagamento':
        return 'bg-yellow-100 border-yellow-300';
      case 'pago':
        return 'bg-blue-100 border-blue-300';
      case 'preparando':
        return 'bg-purple-100 border-purple-300';
      case 'enviado':
        return 'bg-indigo-100 border-indigo-300';
      case 'entregue':
        return 'bg-green-100 border-green-300';
      case 'cancelado':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
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
      return error;
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
      const response = await orderService.cancel(pedidoId);
      if (response.status === 'Cancelado') {
        closeModal();
        await meusPedidos();
      }
    } catch (error) {
      console.error('Erro ao cancelar o pedido:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 sm:p-4 p-1">
      <div className="max-w-screen sm:mx-auto p-8">
        <div className="bg-white shadow-lg rounded-lg flex flex-col border-gray-200 border pl-4 pr-4">
          <h1 className="text-lg sm:text-4xl font-bold text-center text-black m-4 sm:m-8">Meus Pedidos</h1>
          {pedidos.length === 0 ? (
            <div className="text-center text-gray-500">Você ainda não fez nenhum pedido.</div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-2 sm:gap-4">
              {pedidos.slice(0, visibleCount).map(pedido => (
                <div
                  key={pedido.id}
                  onClick={() => openModal(pedido)}
                  className={`cursor-pointer border sm:p-3 p-2 rounded-lg hover:shadow-xl transition-all ${getStatusColor(
                    pedido.status,
                  )}`}
                >
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col sm:gap-2 gap-1 ">
                      <h3 className="text-black font-semibold sm:font-bold">Pedido #{pedido.id}</h3>
                      <p className="text-black">Realizado em {formatDate(pedido.createdAt)}</p>
                    </div>
                    <div className="flex flex-col sm:items-end items-center text-black sm:gap-1 ">
                      <p className="text-gray-500 text-center">{pedido.status}</p>
                      <p className="text-green-800 sm:font-bold font-semibold">
                        <span className="text-black">Total: </span> R$ {pedido.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 text-white sm:font-semibold">
            {pedidos.length > visibleCount && (
              <button onClick={loadMore} className=" bg-[#f0ad31] hover:bg-[#e6942c] w-full rounded-xl sm:p-1">
                Exibir Mais Pedidos
              </button>
            )}
            <button onClick={meusPedidos} className=" bg-green-500 hover:bg-green-600 w-full rounded-xl m-2 sm:p-1">
              Atualizar Pedidos
            </button>
          </div>
        </div>
      </div>
      {modalOpen && selectedPedido && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-xl  text-black p-4 sm:p-8 w-full sm:w-3/4 max-h-5xl overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl sm:font-bold font-semibold">Detalhes do Pedido #{selectedPedido.id}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-3xl sm:text-4xl">
                &times;
              </button>
            </div>
            <div className="text-black mb-4 text-xs sm:text-base">
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
                <div className="mt-4 max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Produtos</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Quantidade</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Preço Unitário</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Subtotal </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPedido.orderProducts.map(orderProduct => (
                        <tr key={orderProduct.id} className="border border-gray-300">
                          <td className="border border-gray-300 px-4 py-2">
                            {orderProduct.product.name.toUpperCase()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{orderProduct.quantity}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            R$ {orderProduct.price.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            R$ {(orderProduct.price * orderProduct.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex flex-col sm:flex-row-reverse sm:justify-between items-center mt-4">
                {selectedPedido.status === 'Aguardando Pagamento' && (
                  <div>
                    <Wallet initialization={{ preferenceId: selectedPedido.MLpaymentId, redirectMode: 'blank' }} />
                  </div>
                )}
                {selectedPedido.status !== 'CANCELADO' && (
                  <div>
                    <button
                      className="text-white bg-red-500 hover:bg-red-600 rounded-xl m-2 sm:p-1"
                      onClick={() => cancelarPedido(selectedPedido.id)}
                    >
                      Cancelar Pedido
                    </button>
                  </div>
                )}
              </div>
              {/* <button className=" text-black hover:text-blue-600">Acompanhar Entrega</button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
