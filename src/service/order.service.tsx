const BASE_URL_NGROK = 'https://winning-lately-dodo.ngrok-free.app/';
const BASE_URL = 'http://localhost:3000/';

class OrderService {
  async listar() {
    const response = await fetch(BASE_URL + 'carrinho', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    return response;
  }

  async save(data: any) {
    //@ts-check criar a logica real para salvar no banco de dados
    console.log('salvando no banco de dados' + JSON.stringify(data));
  }
}

const orderService = new OrderService();
export { orderService };
