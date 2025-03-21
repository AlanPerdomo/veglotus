const BASE_URL_NGROK = 'https://winning-lately-dodo.ngrok-free.app/';
// const BASE_URL = 'http://localhost:3001/';

class ProductService {
  async listar() {
    const response = await fetch(BASE_URL_NGROK + 'produtos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return response;
  }
}
const productService = new ProductService();
export { productService };
