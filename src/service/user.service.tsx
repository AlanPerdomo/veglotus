const BASE_URL = 'https://winning-lately-dodo.ngrok-free.app/';
// const BASE_URL = 'http://localhost:3001/';

interface Address {
  id: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais?: string;
  isPrincipal: boolean;
  createdAt?: string;
  updatedAt?: string;
}
interface User {
  id?: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  cpf?: string;
  addresses?: Address[];
}
class UserService {
  async cadastrar(data: User) {
    const response = await (
      await fetch(BASE_URL + 'user/cadastrar', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
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
        'ngrok-skip-browser-warning': 'true',
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
            'ngrok-skip-browser-warning': 'true',
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
            'ngrok-skip-browser-warning': 'true',
            Authorization: `Bearer ${token}`,
          },
        })
      ).json();
      localStorage.setItem('addresses', JSON.stringify(response));
      const address = JSON.parse(localStorage.getItem('addresses')!).find((address: Address) => address.isPrincipal);
      localStorage.setItem('address', JSON.stringify(address));

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // async saveAddress(data: any, token: string) {}

  async updateUser(data: User, token: string) {
    try {
      console.log('data:', data);
      const response = await fetch(BASE_URL + 'user/update-user', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
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

  async registerAddress(data: Address, token: string) {
    const response = await (
      await fetch(BASE_URL + 'endereco/cadastrar', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
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
          'ngrok-skip-browser-warning': 'true',
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
          'ngrok-skip-browser-warning': 'true',
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
