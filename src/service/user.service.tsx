import { get } from 'http';

// const BASE_URL_NGROK = 'https://winning-lately-dodo.ngrok-free.app/';
const BASE_URL = 'http://localhost:3001/';
class UserService {
  async cadastrar(data: any) {
    const response = await (
      await fetch(BASE_URL + 'user/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    ).json();

    return response;
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
      await this.getUser(data.access_token);
      await this.getAddresses(data.access_token);

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('isLogged', 'true');
    }

    return response;
  }

  async getUser(token: string) {
    try {
      const response = await (
        await fetch(BASE_URL + 'user/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).json();
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getAddresses(token: string) {
    try {
      const response = await (
        await fetch(BASE_URL + 'endereco/my', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).json();

      localStorage.setItem('addresses', JSON.stringify(response));

      const address = JSON.parse(localStorage.getItem('addresses')!).find((address: any) => address.isPrincipal);
      localStorage.setItem('address', JSON.stringify(address));

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // async saveAddress(data: any, token: string) {}

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

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async registerAddress(data: any, token: string) {
    const response = await (
      await fetch(BASE_URL + 'endereco/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
    ).json();
    return response;
  }

  async deleteAddress(addressID: string, token: string) {
    console.log(addressID);
    const response = await (
      await fetch(BASE_URL + `endereco/${addressID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();

    return response;
  }

  async setPrincipalAddress(addressId: string, token: string) {
    const response = await (
      await fetch(BASE_URL + `endereco/set-principal/${addressId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();

    await this.getAddresses(token);

    return response;
  }
}

const userService = new UserService();
export { userService };
