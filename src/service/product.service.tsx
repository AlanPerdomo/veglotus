const BASE_URL_NGROK = 'https://winning-lately-dodo.ngrok-free.app/';
const BASE_URL = 'http://localhost:3000/';

class ProductService {
  async listar() {
    const response = await fetch(BASE_URL + 'produtos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });
    console.log(response);
    return response;
  }
}
const productService = new ProductService();
export { productService };
