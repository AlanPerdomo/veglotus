import { API_URL } from './config.service';

interface Contact {
  name: string;
  email: string;
  message: string;
}

class ContactService {
  async sendContactMessage(contact: Contact) {
    const response = await (
      await fetch(API_URL + 'contato', {
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
