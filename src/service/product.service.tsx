import { API_URL } from './config.service';
import { Product } from '../app/admin/produtos/page';

class ProductService {
  // async cadastrar( Product) {}
  async atualizar(product: Product) {
    const response = await fetch(API_URL + 'produtos/atualizar', {
      method: 'PATCH',
      headers: {
        authorization: 'bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(product),
    });
    return response;
  }
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
