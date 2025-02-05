'use client';
import { orderService } from '@/service/order.service';
import { useEffect, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image: string;
  category?: string;
  quantity: number;
}

export default function Carrinho() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    setCart(storedCart ? JSON.parse(storedCart) : []);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    updateCart(updatedCart);
  };

  const incrementQuantity = (productId: string) => {
    const updatedCart = cart.map(item => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));
    updateCart(updatedCart);
  };

  const decrementQuantity = (productId: string) => {
    const updatedCart = cart
      .map(item => (item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
      .filter(item => item.quantity > 0);
    updateCart(updatedCart);
  };

  const concluirPedido = () => {};

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity) / 100, 0);

  const handlePayment = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Usuário não autenticado!');
      window.location.href = '/user/login';
      return;
    }
    const userId = JSON.parse(user)?.user?.id;

    if (!userId) {
      alert('Erro ao obter dados do usuário.');
      return;
    }

    const data = {
      userId: userId,
      produtos: cart,
      paymentStatus: 'PENDENTE',
    };

    orderService
      .save(data)
      .then(() => {
        alert('Pedido realizado com sucesso!');
        setCart([]);
        localStorage.removeItem('cart');
      })
      .catch(() => {
        alert('Erro ao realizar o pedido.');
      });
    // console.log(cart);
    // console.log(user);
    // const response = await fetch('http://localhost:3000/pagamento/criar-preferencia', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     userId: userId,
    //     produtos: cart.map(item => ({
    //       id: item.id,
    //       nome: item.nome,
    //       quantity: item.quantity,
    //       preco: item.preco,
    //       category: item.categoria,
    //       description: item.descricao,
    //     })),
    //   }),
    // });

    // const responseData = await response.json();
    // // console.log(data);
    // if (responseData.id) {
    //   // window.location.href = data.init_point;
    //   // window.location.href = data.sandbox_init_point;
    //   // 6666336041257509
    //   // 6666336041257509
    //   // 2240991837
    // }
  };

  return (
    <div className="container mx-auto px-4 p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">Carrinho</h2>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500">Seu carrinho está vazio.</div>
      ) : (
        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between border p-4 rounded-lg shadow-md bg-white">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <div className="flex-1 ml-4">
                <h3 className="text-black font-semibold">{item.name}</h3>
                <p className="text-green-600 font-bold">R${(item.price / 100).toFixed(2)}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => decrementQuantity(item.id)}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded-l-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  value={item.quantity}
                  readOnly
                  className="w-12 text-center border-y border-gray-300 text-black"
                />
                <button
                  onClick={() => incrementQuantity(item.id)}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded-r-lg"
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
          <div className="text-right font-bold text-xl text-black">Total: R$ {totalPrice.toFixed(2)}</div>
          <button
            onClick={handlePayment}
            className="w-full bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold py-3 rounded-md"
          >
            Pagar com Mercado Pago
          </button>
        </div>
      )}
    </div>
  );
}
