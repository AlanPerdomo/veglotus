import { API_URL } from './config.service';

class ProductService {
  async listar() {
    const response = await fetch(API_URL + 'produtos', {
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
