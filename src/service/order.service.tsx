const BASE_URL = 'https://winning-lately-dodo.ngrok-free.app/';
// const BASE_URL = 'http://localhost:3001/';

interface newOrder {
  address: Address;
  deliveryFee: number;
  totalPrice: number;
  cart: CartItem[];
}

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

class OrderService {
  async meusPedidos() {
    const response = await (
      await fetch(BASE_URL + 'pedidos/my', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
    ).json();

    localStorage.setItem('orders', JSON.stringify(response));

    return response;
  }

  async listar() {
    const response = await (
      await fetch(BASE_URL + 'pedidos/listar', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
    ).json();

    localStorage.setItem('allOrders', JSON.stringify(response));

    return response;
  }

  async cancel(id: number) {
    const response = await (
      await fetch(BASE_URL + 'pedidos/cancelar/' + id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
    ).json();

    return response;
  }

  async save(data: newOrder) {
    const order = {
      orderProducts: data.cart,
      status: 'Aguardando Pagamento',
      paymentStatus: 'PENDENTE',
      subTotal: data.totalPrice,
      deliveryFee: data.deliveryFee,
      total: data.totalPrice + data.deliveryFee,
      address: data.address,
    };

    const response = await (
      await fetch(BASE_URL + 'pedidos/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(order),
      })
    ).json();

    return response;
  }

  async getQuotation(address: string) {
    const response = await (
      await fetch(BASE_URL + 'frete/calcular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: address,
      })
    ).json();

    response.addressId = JSON.parse(address).id;
    response.createdAt = new Date().toISOString();
    localStorage.setItem('quotation', JSON.stringify(response));

    return response;
  }
}

const orderService = new OrderService();
export { orderService };

//  const response = await fetch('http://localhost:3000/pagamento/criar-preferencia', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId: userId,
//         produtos: cart.map(item => ({
//           id: item.id,
//           nome: item.nome,
//           quantity: item.quantity,
//           preco: item.preco,
//           category: item.categoria,
//           description: item.descricao,
//         })),
//       }),
//     });

//     // const responseData = await response.json();
//     // // console.log(data);
//     // if (responseData.id) {
//     //   // window.location.href = data.init_point;
//     //   // window.location.href = data.sandbox_init_point;
//     //   // 6666336041257509
//     //   // 6666336041257509
//     //   // 2240991837
//     // }
