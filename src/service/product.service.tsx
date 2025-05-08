import { API_URL } from './config.service';
import { Product, NewProduct } from '../app/admin/produtos/page';

function getHeaders(auth: boolean = false): HeadersInit {
  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
    Host: 'localhost:3001',
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

  async atualizar(product: Product, file?: File | null): Promise<Product> {
    if (file) {
      console.log('com file');
      await this.uploadImage(file, product.id);
    } else {
      console.log('sem file');
    }
    try {
      const response = await fetch(API_URL + 'produtos/atualizar', {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify(product),
      });

      console.log('response', response);

      if (!response.ok) {
        throw new Error(`Erro ao atualizar produto: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async uploadImage(file: File, id: number): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('image', file, file.name);

      const response = await fetch(API_URL + 'produtos/upload-image/' + id, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar produto: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

const productService = new ProductService();
export { productService };
