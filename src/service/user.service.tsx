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
      data.data = await this.getUser(data.access_token);
      localStorage.setItem('user', JSON.stringify(data));
    }

    return response;
  }

  async getUser(token: string) {
    console.log(token);
    try {
      const response = await fetch(BASE_URL + 'user/me', {
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
  async updateUser(data: any) {}
}

const userService = new UserService();
export { userService };
