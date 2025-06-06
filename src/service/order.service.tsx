import { API_URL } from './config.service';

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
      await fetch(API_URL + 'pedidos/my', {
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
      await fetch(API_URL + 'pedidos/listar', {
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
      await fetch(API_URL + 'pedidos/cancelar/' + id, {
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
      await fetch(API_URL + 'pedidos/cadastrar', {
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
      await fetch(API_URL + 'frete/calcular', {
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
