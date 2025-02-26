const BASE_URL = 'http://localhost:3001/pagamento';
class PaymentService {
  async createMLPayment(orderId: number) {
    const response = await fetch(`${BASE_URL}/mercado-pago/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'bearer ' + localStorage.getItem('token'),
      },
    });
    // console.log(response);

    return response.json();
  }
}
const paymentService = new PaymentService();
export { paymentService };
