const BASE_URL_NGROK = 'http://api.veglotus.com.br/';

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
