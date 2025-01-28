const BASE_URL = 'http://localhost:3000/';

class ProductService {
  async listar() {
    const response = await fetch(BASE_URL + 'produtos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  }
}
const productService = new ProductService();
export { productService };
