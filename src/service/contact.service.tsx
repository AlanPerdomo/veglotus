const BASE_URL = 'https://winning-lately-dodo.ngrok-free.app/';

interface Contact {
  name: string;
  email: string;
  message: string;
}

class ContactService {
  async sendContactMessage(contact: Contact) {
    const response = await (
      await fetch(BASE_URL + 'contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(contact),
      })
    ).json();

    return response;
  }
}

export default ContactService;
