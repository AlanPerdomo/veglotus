import { API_URL } from './config.service';
import { Product, NewProduct } from '../app/admin/produtos/page';

function getHeaders(auth: boolean = false, file: boolean = false): HeadersInit {
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

  if (file) {
    headers['Content-Type'] = 'multipart/form-data';
  } else {
    headers['Content-Type'] = 'application/json';
  }
  console.log('headers', headers);
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

  async atualizar(product: Product, file?: any): Promise<Product> {
    if (file) {
      await this.uploadImage(file, product.id);
    }
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

  async uploadImage(file: File, id: number): Promise<void> {
    try {
      console.log('file', file);
      const formData = new FormData();
      formData.append('image', file, file.name);

      const response = await fetch('http://localhost:3001/produtos/teste', {
        method: 'POST',
        headers: getHeaders(true, true),
        body: formData,
        redirect: 'follow',
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
