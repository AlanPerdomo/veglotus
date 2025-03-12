'use client';
import React, { useState } from 'react';
import { userService } from '@/service/user.service';
import { format } from 'path';

export default function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const formatCpf = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    const formattedValue = cleanedValue
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');

    return formattedValue;
  };

  const formatTel = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    let formattedValue = '';
    switch (cleanedValue.length) {
      case 8:
        formattedValue = cleanedValue.replace(/^(\d{4})(\d{4})$/, '$1-$2');
        break;
      case 9:
        formattedValue = cleanedValue.replace(/^(\d{5})(\d{4})$/, '$1-$2');
        break;
      case 10:
        formattedValue = cleanedValue.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        break;
      case 11:
        formattedValue = cleanedValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        break;
      default:
        formattedValue = cleanedValue;
        break;
    }

    return formattedValue;
  };

  const formatName = (value: string) => {
    const formattedValue = value.replace(/\b\w/g, char => char.toUpperCase());
    return formattedValue;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCpf(e.target.value);
    setCpf(formattedCpf);
  };

  const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedTel = formatTel(e.target.value);
    setPhone(formattedTel);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedName = formatName(e.target.value);
    setName(formattedName);
  };

  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedSurname = formatName(e.target.value);
    setSurname(formattedSurname);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    setErrorMessage('');
    e.preventDefault();

    if (password != confirmPassword) {
      setErrorMessage('As senhas não coincidem. Por favor, verifique.');
      return;
    }

    const data = {
      name: name,
      surname: surname,
      email: email,
      cpf: cpf.replace(/\D/g, ''),
      password: password,
      phone: phone.replace(/\D/g, ''),
    };

    try {
      const response = await userService.cadastrar(data);
      if (response.status) {
        alert('Usuario cadastrado com sucesso!');
        await userService.login(email, password);
        window.location.href = '/user/login';
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage('Erro ao registrar usuario: \n' + error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-[#f0ad31] mb-6">Cadastro</h1>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              *Nome:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Seu nome"
              required
            />
          </div>
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
              *Sobrenome:
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={surname}
              onChange={handleSurnameChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Seu sobrenome"
              required
            />
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
              CPF:
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={cpf}
              onChange={handleCpfChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="123.456.789-10"
              maxLength={14}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              *E-mail:
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              *Celular:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={handleTelChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="(21) 00000-0000"
              maxLength={15}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              *Senha:
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
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              *Confirme a senha:
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Confirme a senha"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#f0ad31] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#d69b2c] transition duration-200"
          >
            Cadastrar
          </button>
        </form>
        {errorMessage && (
          <p id="errorMessage" className="text-red-500 text-sm mt-4 text-center">
            {errorMessage}
          </p>
        )}{' '}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Já possui uma conta?{' '}
            <a
              id="login-button"
              href="/user/login"
              className="text-green-500 font-medium hover:underline hover:text-blue-500"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
