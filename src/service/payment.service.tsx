const BASE_URL = 'http://api.veglotus.com.br/pagamento';
class PaymentService {
  async createMPPayment(orderId: number) {
    const response = await fetch(`${BASE_URL}/mercado-pago/${orderId}`, {
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
