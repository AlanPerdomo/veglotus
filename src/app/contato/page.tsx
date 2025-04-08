'use client';
import { useState } from 'react';
import ContactService from '@/service/contact.service';

export default function Contato() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const contactService = new ContactService();
      const response = await contactService.sendContactMessage(form);
      if (response.status) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      setStatus('error');
    }
  };
  return (
    <div className="bg-gray-100 flex-1 flex flex-col items-center justify-center">
      <div className=" max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-[#f0ad31]">Fale com a gente</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-row gap-2">
            <input
              type="text"
              name="name"
              placeholder="Seu nome (opcional)"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-4 py-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Seu e-mail"
              required
              value={form.email}
              onChange={handleChange}
              className="border rounded px-4 py-2"
            />
          </div>
          <textarea
            name="message"
            placeholder="Escreva sua mensagem..."
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="border rounded px-4 py-2"
          />
          <button>
            {status === 'sending' ? 'Enviando...' : status === 'success' ? 'Mensagem enviada!' : 'Enviar'}
          </button>
          {status === 'success' && (
            <p className="text-green-600 font-medium text-center">Mensagem enviada com sucesso! 🌱</p>
          )}

          {status === 'error' && (
            <p className="text-red-500 font-medium text-center">Erro ao enviar. Tente novamente.</p>
          )}
        </form>
      </div>
    </div>
  );
}
