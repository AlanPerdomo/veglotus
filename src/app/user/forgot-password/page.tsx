'use client';
import { useState } from 'react';
import { userService } from '@/service/user.service';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await userService.sendPasswordResetEmail(email);
      setMessage('Se o e-mail estiver cadastrado, enviaremos um link para redefinir sua senha.');
    } catch (error) {
      setMessage('Ocorreu um erro ao tentar recuperar a senha.' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">Esqueci minha senha</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            required
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Recuperar senha'}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
