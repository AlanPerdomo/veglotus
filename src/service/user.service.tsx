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
      localStorage.setItem('user', JSON.stringify(data));
    }

    return response;
  }

  // async getUser(userToken: string) {
  //   return await fetch(BASE_URL + 'user/login', {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${userToken}`,
  //     },
  //   });
  // }
}

const userService = new UserService();
export { userService };
