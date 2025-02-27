'use client';
import { orderService } from '@/service/order.service';
import { paymentService } from '@/service/payment.service';
import { useEffect, useState } from 'react';

interface order {
  id: number;
  total: number;
  status: string;
  address: string;
  orderProducts: orderProduct[];
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface orderProduct {
  id: number;
  quantity: number;
  product: product;
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
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pedidos = JSON.parse(localStorage.getItem('orders')!);
    if (pedidos) {
      sortOrders(pedidos);
    } else {
      meusPedidos();
    }
  }, []);

  const meusPedidos = async () => {
    if (localStorage.getItem('isLogged') === 'true') {
      const pedidos = await orderService.listar();
      sortOrders(pedidos);
    } else {
      window.location.href = '/user/login';
    }
  };

  const sortOrders = (pedidos: any) => {
    const sortedPedidos = pedidos.sort((a, b) => b.id - a.id);
    setPedidos(sortedPedidos);
  };

  const openModal = pedido => {
    setSelectedPedido(pedido);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPedido(null);
    setModalOpen(false);
  };

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 10);
  };

  const parseEndereco = enderecoStr => {
    try {
      return JSON.parse(enderecoStr);
    } catch (error) {
      return null;
    }
  };

  const handleMercadoPago = async () => {
    setLoading(true);
    try {
      const response = await paymentService.createMPPayment(selectedPedido!.id);
      console.log(response);
      console.log(response.result.sandbox_init_point);
      if (response) {
        setLoading(false);

        window.location.href = response.result.sandbox_init_point;
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
    } finally {
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
                  <h3 className="text-black font-semibold">Pedido #{pedido.id}</h3>
                  <p className="text-green-600 font-bold">R$ {pedido.total}</p>
                  <p className="text-gray-500">Status: {pedido.status}</p>
                </div>
              ))}
            </div>
          )}
          {pedidos.length > visibleCount && (
            <button
              onClick={loadMore}
              className="mt-6 w-full flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2"
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
              <p>
                <span className="font-semibold">Status do Pedido:</span> {selectedPedido.status}
              </p>
              <p>
                <span className="font-semibold">Total:</span> R$ {selectedPedido.total}
              </p>

              {selectedPedido.address &&
                (() => {
                  const endereco = parseEndereco(selectedPedido.address);
                  return endereco ? (
                    <div className=" mt-4">
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
                    {selectedPedido.orderProducts.map(op => (
                      <li key={op.id} className="mb-2 flex justify-between">
                        <div>{op.product.name.toUpperCase()}</div>
                        <div className="flex gap-4">
                          <p>Quantidade: {op.quantity}</p>
                          <p>| Preço Unitário: R$ {op.price.toFixed(2)}</p>
                          <p>| Subtotal: R$ {(op.price * op.quantity).toFixed(2)}</p>
                        </div>
                      </li>
                    ))}
                    {/* <li className="font-bold">frete: R$ {selectedPedido.deliveryfee.toFixed(2)}</li> */}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-3">
              {selectedPedido.status === 'Aguardando Pagamento' && (
                <div className="flex flex-col space-y-3 ">
                  <p className="text-end font-semibold"> Selecione a forma de pagamento:</p>
                  <div className="flex items-center justify-end space-x-4">
                    <p className=" font-bold">Total: R$ {selectedPedido.total.toFixed(2)}</p>
                    <button
                      onClick={() => {}}
                      className="flex items-center bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold rounded-md py-2 px-4"
                    >
                      <img src="/icon_pix.png" alt="Pix" className="w-6 h-6 mr-2" />
                      Pix
                    </button>
                    <button
                      onClick={handleMercadoPago}
                      className="flex items-center bg-[#f0ad31]  hover:bg-[#e6942c] text-white font-semibold rounded-md py-2 px-4"
                    >
                      <img src="/icon_mercadoPago.png" alt="Mercado Pago" className="w-6 h-6 mr-2" />
                      Mercado Pago
                    </button>
                  </div>
                </div>
              )}

              {/* <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">Cancelar Pedido</button> */}
              {/* <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
                Acompanhar Entrega
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
