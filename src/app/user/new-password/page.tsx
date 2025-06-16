'use client';
import { userService } from '@/service/user.service';
import { useEffect, useState } from 'react';

export default function NewPassword() {
  const [tokenKey, setTokenKey] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        setTokenKey(token);
        params.delete('token');
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
      setShowForm(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const password = document.getElementById('password') as HTMLInputElement;
    const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;

    if (password.value !== confirmPassword.value) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    await userService.updateUser({ password: password.value }, tokenKey).then(response => {
      if (response?.ok) {
        console.log('Senha atualizada com sucesso!');
        setLoading(false);
        setSuccess(true);
        window.location.href = '/login';
      } else {
        setErrorMessage('Ocorreu um erro ao atualizar a senha.');
        console.error('Erro ao atualizar a senha:');
        setSuccess(true);
        setLoading(false);
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4 ">
      {!success ? (
        <div
          className={`bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-700 ease-out ${
            showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Nova Senha</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Digite sua nova senha"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Confirme sua senha"
                required
              />
            </div>

            {errorMessage && <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
            >
              {loading ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center animate-fade-in">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Senha atualizada com sucesso!</h2>
          <p className="text-gray-600">Agora você já pode fazer login com sua nova senha.</p>
        </div>
      )}
    </div>
  );
}
