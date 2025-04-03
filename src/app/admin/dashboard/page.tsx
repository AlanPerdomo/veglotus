'use client';
import { orderService } from '@/service/order.service';
import { useEffect, useState } from 'react';

interface Order {
  id: number;
  status: string;
  paymentStatus: string;
  MLpaymentId: string | null;
  currency: string;
  subTotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    surname: string;
    phone: string;
    cpf: string;
    email: string;
    type: string;
    avatar: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  orderProducts: [
    {
      id: number;
      price: number;
      quantity: number;
      product: {
        id: number;
        name: string;
        description: string;
        price: number;
      };
    },
  ];
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Estados para os filtros
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [customerFilterByName, setCustomerFilterByName] = useState<string>('');
  const [customerFilterByOrderNumber, setCustomerFilterByOrderNumber] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await orderService.listar();
        setOrders(orders);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para aplicar os filtros
  const filteredOrders = orders.filter(order => {
    return (
      (statusFilter === '' || order.status.toLowerCase() === statusFilter.toLowerCase()) &&
      (paymentStatusFilter === '' || order.paymentStatus.toLowerCase() === paymentStatusFilter.toLocaleLowerCase()) &&
      (customerFilterByName === '' || order.user.name.toLowerCase().includes(customerFilterByName.toLowerCase())) &&
      (customerFilterByOrderNumber === '' || order.id.toString().includes(customerFilterByOrderNumber))
    );
  });

  // Agrupar pedidos por usuário (após aplicar filtros)
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const userId = order.user.id;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(order);
    return acc;
  }, {} as Record<number, Order[]>);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setShowDetails(false);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="text-black min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-black mb-8">Todos os pedidos</h1>

        {/* Filtros */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-2 text-xl font-semibold mb-4">Filtrar Pedidos</h2>
            <div className="flex gap-4 text-sm justify-normal">
              <button
                className="text-gray-500 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                onClick={() => window.location.reload()}
              >
                Atualizar Pedidos
              </button>
              <button
                className="text-gray-500 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                onClick={() => {
                  setStatusFilter('');
                  setPaymentStatusFilter('');
                  setCustomerFilterByName('');
                  setCustomerFilterByOrderNumber('');
                }}
              >
                limpar filtros
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status do Pedido</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-gray-500 mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos</option>
                <option value="Aguardando Pagamento">Aguardando Pagamento</option>
                <option value="Pago">Pago</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status do Pagamento</label>
              <select
                value={paymentStatusFilter}
                onChange={e => setPaymentStatusFilter(e.target.value)}
                className="text-gray-500 mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cliente</label>
              <input
                type="text"
                value={customerFilterByName}
                onChange={e => setCustomerFilterByName(e.target.value)}
                placeholder="Buscar por nome"
                className="text-gray-500 mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nº do pedido</label>
              <input
                type="text"
                value={customerFilterByOrderNumber}
                onChange={e => setCustomerFilterByOrderNumber(e.target.value)}
                placeholder="Buscar por Nº do pedido"
                className="text-gray-500 mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-black">
          {Object.entries(groupedOrders).map(([userId, userOrders]) => (
            <div key={userId} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {userOrders[0].user.name} {userOrders[0].user.surname}
              </h2>
              <div className="space-y-4">
                {userOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openModal(order)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Pedido #{order.id}</span>
                      <span
                        className={`text-sm ${
                          order.status === 'Aguardando Pagamento' ? 'text-yellow-600' : 'text-green-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Total: R$ {order.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Data: {new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {modalOpen && selectedOrder && (
        <div className="text-black fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Detalhes do Pedido #{selectedOrder.id}</h2>
            <div className="space-y-2">
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Pagamento:</strong> {selectedOrder.paymentStatus}
              </p>
              <p>
                <strong>Total:</strong> R$ {selectedOrder.total.toFixed(2)}
              </p>
              <p>
                <strong>Endereço:</strong> {JSON.parse(selectedOrder.address).rua},{' '}
                {JSON.parse(selectedOrder.address).numero}
              </p>
              <p>
                <strong>Data:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
              {showDetails && (
                <div className="border border-gray-300">
                  <h3 className="text-center text-lg font-semibold mt-2 mb-4">Itens do Pedido</h3>
                  <ul className="list-disc pl-6">
                    {selectedOrder.orderProducts.map(item => (
                      <li key={item.id} className="mb-2">
                        {item.product.name} - R$ {item.price.toFixed(2)} - Quantidade: {item.quantity}
                      </li>
                    ))}
                    <li className="mb-2 ">Frete: R$ {selectedOrder.deliveryFee}</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
              >
                {showDetails ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
