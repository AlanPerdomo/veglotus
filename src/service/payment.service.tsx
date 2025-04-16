import { API_URL } from './config.service';

class PaymentService {
  async createMPPayment(orderId: number) {
    const response = await fetch(`${API_URL}/pagamento/mercado-pago/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        authorization: 'bearer ' + localStorage.getItem('token'),
      },
    });
    return response.json();
  }
}
const paymentService = new PaymentService();
export { paymentService };
