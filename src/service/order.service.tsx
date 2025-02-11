const BASE_URL_NGROK = 'https://winning-lately-dodo.ngrok-free.app/';
const BASE_URL = 'http://localhost:3000/';

class OrderService {
  async listar() {
    const response = await fetch(BASE_URL + 'pedidos/listar', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    return response;
  }

  async save(data: any) {
    return {
      teste: 'testando',
      id: 1,
      tudo: 'asdf',
    };
  }

  async createPaymentPreference() {
    const response = await fetch(BASE_URL + 'pagamento/criar-preferencia');
  }
}

const orderService = new OrderService();
export { orderService };

// const orderService = new OrderService();
// export { orderService };
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
