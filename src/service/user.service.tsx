import { json } from 'stream/consumers';

const BASE_URL_NGROK = 'https://winning-lately-dodo.ngrok-free.app/';
const BASE_URL = 'http://localhost:3000/';
class UserService {
  async cadastrar(data: any) {
    return await fetch(BASE_URL + 'user/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    const response = await fetch(BASE_URL + 'user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      data.user = await this.getUser(data.access_token);
      data.addresses = await this.getAddresses(data.access_token);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('addresses', JSON.stringify(data.addresses));
      localStorage.setItem('isLogged', 'true');
    }

    return response;
  }

  async getUser(token: string) {
    try {
      const response = await fetch(BASE_URL + 'user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      return response.json();
    } catch (error) {
      console.log(error);
    }
  }

  async getAddresses(token: string) {
    try {
      const response = await fetch(BASE_URL + 'endereco/my', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    } catch (error) {
      console.log(error);
    }
  }

  // still needs to be implemented
  async updateUser(data: any, token: string) {
    try {
      console.log('data:', data);
      const response = await fetch(BASE_URL + 'user/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

const userService = new UserService();
export { userService };
