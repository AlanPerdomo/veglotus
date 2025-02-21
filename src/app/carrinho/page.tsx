'use client';
import { orderService } from '@/service/order.service';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
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
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity) / 100, 0);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    setCart(storedCart ? JSON.parse(storedCart) : []);

    const storedAddress = localStorage.getItem('address');
    setAddress(storedAddress ? JSON.parse(storedAddress) : null);

    const calculateDeliveryFee = async () => {
      const quotation = await orderService.getQuotation(localStorage.getItem('address'));

      const fee = parseFloat(quotation.valorFrete.priceBreakdown.total);
      console.log(typeof fee);

      setDeliveryFee(fee);
    };
    calculateDeliveryFee();
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
    const order = {
      address,
      deliveryFee,
      totalPrice,
      cart,
    };

    const response = await orderService.save(order);
    if (response) {
      console.log('Pedido criado com sucesso!');
    }
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
                <p className="text-green-600 font-bold">R$ {(item.price / 100).toFixed(2)}</p>
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
          <div className="text-right font-bold text-xl text-black">Subtotal: R$ {totalPrice.toFixed(2)}</div>
          {address ? (
            <div className="mt-4 text-right text-black">
              <p className="text-sm">{`${address.rua}, ${address.numero}${
                address.complemento ? `, ${address.complemento}` : ''
              }`}</p>
              <p className="text-sm">{`${address.bairro}, ${address.cidade} - ${address.estado}`}</p>
              <p className="text-sm">{`CEP: ${address.cep}`}</p>
            </div>
          ) : (
            <div className="text-right text-sm text-gray-500">Nenhum endereço principal cadastrado.</div>
          )}

          <div className="text-right font-bold text-xl text-black">Frete: R$ {deliveryFee.toFixed(2)}</div>
          <div className="flex justify-end items-center space-x-4">
            <div className="text-right font-bold text-xl text-black">
              Total: R$ {(totalPrice + deliveryFee).toFixed(2)}
            </div>
            <button
              onClick={checkout}
              className="flex items-center bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold  rounded-md py-2 px-4"
            >
              Fechar pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

{
  /* <button
    // onClick={'pixPago'}
    className="flex items-center bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold  rounded-md py-2 px-4"
  >
    <img src="/icon_pix.png" alt="Pix" className="w-6 h-6 mr-2" />
    Pix
  </button>
  <button
    // onClick={'mercadoPago'}
    className="flex items-center bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold rounded-md py-2 px-4"
  >
    <img src="/icon_mercadoPago.png" alt="Mercado Pago" className="w-8 h-8 mr-2" />
    Mercado Pago
  </button> */
}

// export function CarrinhoOld() {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const storedCart = localStorage.getItem('cart');
//     setCart(storedCart ? JSON.parse(storedCart) : []);
//   }, []);

//   const updateCart = (newCart: CartItem[]) => {
//     setCart(newCart);
//     localStorage.setItem('cart', JSON.stringify(newCart));
//   };

//   const incrementQuantity = (productId: string) => {
//     const updatedCart = cart.map(item => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));
//     updateCart(updatedCart);
//   };

//   const decrementQuantity = (productId: string) => {
//     const updatedCart = cart
//       .map(item => (item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
//       .filter(item => item.quantity > 0);
//     updateCart(updatedCart);
//   };

//   // Função para fechar o pedido e redirecionar para a página de pagamento
//   const handleCloseOrder = async () => {
//     const user = localStorage.getItem('user');
//     if (!user) {
//       alert('Usuário não autenticado!');
//       router.push('/user/login');
//       return;
//     }
//     // Supondo que a estrutura do objeto de usuário esteja aninhada (ajuste se necessário)
//     const userId = JSON.parse(user)?.user?.id || JSON.parse(user)?.id;
//     if (!userId) {
//       alert('Erro ao obter dados do usuário.');
//       return;
//     }

//     const data = {
//       userId: userId,
//       produtos: cart,
//       paymentStatus: 'PENDENTE',
//     };

//     try {
//       const orderResponse = await orderService.save(data);
//       if (orderResponse && orderResponse.id) {
//         alert('Pedido realizado com sucesso!');
//         // Salva os dados do pedido para a página de pagamento
//         localStorage.setItem('order', JSON.stringify(orderResponse));
//         // Limpa o carrinho
//         setCart([]);
//         localStorage.removeItem('cart');
//         // Redireciona para a página de pagamento
//         router.push('/pagamento');
//       } else {
//         alert('Erro ao realizar o pedido.');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Erro ao realizar o pedido.');
//     }
//   };
// }
