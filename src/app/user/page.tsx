'use client';
import React, { useState, useEffect } from 'react';
import { userService } from '@/service/user.service';
import { AnimatePresence, motion } from 'framer-motion'; // IMPORTANTE

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('user');
    if (token) {
      window.location.href = '/produtos';
    }
  }, []);

  const formatCpf = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    return cleanedValue
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  };

  const formatTel = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    switch (cleanedValue.length) {
      case 8:
        return cleanedValue.replace(/^(\d{4})(\d{4})$/, '$1-$2');
      case 9:
        return cleanedValue.replace(/^(\d{5})(\d{4})$/, '$1-$2');
      case 10:
        return cleanedValue.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
      case 11:
        return cleanedValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      default:
        return cleanedValue;
    }
  };

  const formatName = (value: string) => {
    return value.replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem. Por favor, verifique.');
      return;
    }

    const data = {
      name,
      surname,
      email,
      cpf: cpf.replace(/\D/g, ''),
      password,
      phone: phone.replace(/\D/g, ''),
    };

    try {
      const response = await userService.cadastrar(data);
      if (response.status) {
        alert('Usuário cadastrado com sucesso!');
        await userService.login(email, password);
        window.location.href = '/user/login';
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage('Erro ao registrar usuário: ' + error);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const response = await userService.login(email, password);
    if (response.ok) {
      window.location.href = '/produtos';
    } else {
      setErrorMessage('Email ou senha incorretos');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 m-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Login</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail:
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite seu e-mail"
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
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Entrar
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-center text-[#f0ad31] mb-6">Cadastro</h1>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">*Nome:</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(formatName(e.target.value))}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">*Sobrenome:</label>
                    <input
                      type="text"
                      value={surname}
                      onChange={e => setSurname(formatName(e.target.value))}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF:</label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={e => setCpf(formatCpf(e.target.value))}
                      maxLength={14}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="123.456.789-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">*Celular:</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(formatTel(e.target.value))}
                      maxLength={15}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="(DDD) 12345-6789"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">*E-mail:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">*Senha:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">*Confirme a senha:</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#f0ad31] text-white py-2 rounded-lg hover:bg-[#d69b2c] transition"
                >
                  Cadastrar
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {errorMessage && <p className="text-red-500 text-sm mt-4 text-center">{errorMessage}</p>}

        <div className="flex justify-center mb-6">
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {isLogin ? 'Ainda nao possui uma conta?' : 'Ja possui uma conta?'}{' '}
              <button
                id="login-button"
                onClick={() => setIsLogin(!isLogin)}
                className={`${
                  isLogin ? 'text-[#f0ad31]' : 'text-green-500'
                } font-medium hover:underline hover:text-blue-500`}
              >
                {isLogin ? 'Cadastrar' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
