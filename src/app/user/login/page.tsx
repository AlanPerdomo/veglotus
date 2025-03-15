'use client';
import { userService } from '@/service/user.service';
import { useState, useEffect } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('user');

    if (token) {
      window.location.href = '/produtos';
    }
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await userService.login(email, password);

    if (response.ok) {
      // alert('Login realizado com sucesso!');
      // window.location.href = '/';
    } else {
      setErrorMessage('Email ou senha incorretos');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className=" bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-500 mb-6">Login</h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Digite seu email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Entrar
          </button>
        </form>
        {errorMessage && (
          <p id="errorMessage" className="text-red-500 text-sm mt-4 text-center">
            {errorMessage}
          </p>
        )}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <a
              id="register-button"
              href="/user/register"
              className="text-[#f0ad31] font-medium hover:underline hover:text-blue-500"
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
