import { API_URL } from './config.service';
import { Product, NewProduct } from '../app/admin/produtos/page';

function getHeaders(auth: boolean = false): HeadersInit {
  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.authorization = `bearer ${token}`;
    }
  }

  return headers;
}

class ProductService {
  async cadastrar(product: NewProduct): Promise<Product> {
    try {
      const response = await fetch(API_URL + 'produtos/cadastrar', {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error(`Erro ao cadastrar produto: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async atualizar(product: Product): Promise<Product> {
    try {
      const response = await fetch(API_URL + 'produtos/atualizar', {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar produto: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async listar(): Promise<Product[]> {
    try {
      const response = await fetch(API_URL + 'produtos', {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao listar produtos: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

const productService = new ProductService();
export { productService };
