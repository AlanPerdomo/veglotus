'use client';
import { orderService } from '@/service/order.service';
import { paymentService } from '@/service/payment.service';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { initMercadoPago } from '@mercadopago/sdk-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  category?: string;
}
interface Address {
  bairro: string;
  cep: string;
  cidade: string;
  complemento: string;
  estado: string;
  id: string;
  isPrincipal: boolean;
  numero: string;
  pais: string;
  rua: string;
}

export default function Carrinho() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const totalPrice = cart.reduce((acc, item) => acc + (Math.trunc(item.price * 100) / 100) * item.quantity, 0);

  useEffect(() => {
    initMercadoPago('APP_USR-4e2c712e-1b41-412b-8d15-5a9761bb0883', {});
    const storedCart = localStorage.getItem('cart');
    setCart(storedCart ? JSON.parse(storedCart) : []);

    const storedAddress = localStorage.getItem('address');
    setAddress(storedAddress ? JSON.parse(storedAddress) : null);

    const quotation = JSON.parse(localStorage.getItem('quotation')!);
    const address = JSON.parse(localStorage.getItem('address')!);

    if (
      quotation &&
      quotation.addressId === address?.id &&
      new Date().getTime() - new Date(quotation.createdAt).getTime() <= 20 * 60 * 1000
    ) {
      setDeliveryFee(parseFloat(quotation.valorFrete.priceBreakdown.total));
    } else {
      setIsLoading(true);
      const calculateDeliveryFee = async () => {
        const quotation = await orderService.getQuotation(localStorage.getItem('address'));
        setDeliveryFee(parseFloat(quotation.valorFrete.priceBreakdown.total));
        setIsLoading(false);
      };
      calculateDeliveryFee();
    }
  }, []);

  async function updateCart(newCart: CartItem[]) {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }

  async function decrementQuantity(productId: string) {
    const updatedCart = cart.map(item =>
      item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item,
    );
    updateCart(updatedCart);
  }

  async function incrementQuantity(productId: string) {
    const updatedCart = cart.map(item => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));
    updateCart(updatedCart);
  }

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    updateCart(updatedCart);
  };

  const checkout = async () => {
    if (!address) {
      alert('Por favor, selecione um endereço de entrega.');
      return;
    }

    setIsLoading(true);

    const order = {
      address,
      deliveryFee,
      totalPrice,
      cart,
    };

    try {
      const response = await orderService.save(order);
      await paymentService.createMPPayment(response.id);

      localStorage.setItem('newOrder', JSON.stringify(response.id));
      sessionStorage.setItem('teste', JSON.stringify(response.id));
      // localStorage.removeItem('cart');
      // window.location.href = '/pedidos';
    } catch (error) {
      console.error('Erro ao finalizar o pedido:', error);
      alert('Ocorreu um erro ao finalizar o pedido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">Carrinho</h2>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500">
          <h3>Seu carrinho está vazio.</h3>
          <button
            className="bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold rounded-md py-2 px-4"
            onClick={() => (window.location.href = '/produtos')}
          >
            Continuar comprando
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between border p-4 rounded-lg shadow-md bg-white">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <div className="flex-1 ml-4">
                <h3 className="text-black font-semibold">{item.name}</h3>
                <p className="text-green-600 font-bold">R$ {Math.trunc(item.price * 100) / 100}</p>
              </div>
              <div className="flex items-center">
                {item.quantity === 1 ? (
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md"
                  >
                    <FaTrash />
                  </button>
                ) : (
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="bg-green-300 hover:bg-green-400 text-black font-semibold py-1 px-3 rounded-l-lg"
                  >
                    -
                  </button>
                )}
                <input
                  type="text"
                  value={item.quantity}
                  readOnly
                  className="w-12 text-center border-y border-gray-300 text-black"
                />
                <button
                  onClick={() => incrementQuantity(item.id)}
                  className="bg-green-300 hover:bg-green-400 text-black font-semibold py-1 px-3 rounded-r-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md"
              >
                Remover
              </button>
            </div>
          ))}
          <div className="text-right font-bold text-xl text-black">
            Subtotal: R$ {(Math.trunc(totalPrice * 100) / 100).toFixed(2)}
          </div>
          {address ? (
            <div className="mt-4 text-right text-black">
              <div>
                <p className="font-semibold">Endereço de entrega</p>
                <p className="text-sm">{`${address.rua}, ${address.numero}${
                  address.complemento ? `, ${address.complemento}` : ''
                }`}</p>
                <p className="text-sm">{`${address.bairro}, ${address.cidade} - ${address.estado}`}</p>
                <p className="text-sm">{`CEP: ${address.cep}`}</p>
              </div>
            </div>
          ) : (
            <div className="text-right text-sm text-gray-500">Nenhum endereço principal cadastrado.</div>
          )}
          <div className="text-right text-black">
            <p className="font-semibold">Entrega: R$ {deliveryFee.toFixed(2)}</p>
            <p className="font-bold text-xl">Total: R$ {(totalPrice + deliveryFee).toFixed(2)}</p>
          </div>
          <div className="flex justify-end items-center space-x-4">
            <button
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold  rounded-md py-2 px-4"
              onClick={() => (window.location.href = '/produtos')}
            >
              Continuar comprando
            </button>
            {isLoading ? (
              <button className="flex items-center bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold  rounded-md py-2 px-4">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Carregando...
              </button>
            ) : (
              <button
                onClick={checkout}
                className="flex items-center bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold  rounded-md py-2 px-4"
              >
                Fechar pedido
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
