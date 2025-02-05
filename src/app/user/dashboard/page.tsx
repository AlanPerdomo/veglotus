'use client';
import { userService } from '@/service/user.service';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('user');
      if (token) {
        const userData = JSON.parse(token).user;
        setUser(userData);
        setFormData(userData);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const response = await userService.updateUser(formData);
    if (response.ok) {
      setUser(formData);
      setEditMode(false);
      alert('Informações atualizadas com sucesso!');
    } else {
      alert('Erro ao atualizar informações.');
    }
  };

  return (
    <div className="container mx-auto px-4 p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">Dashboard</h2>
      {user ? (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone:
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome:</label>
                <p className="text-black">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail:</label>
                <p className="text-black">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone:</label>
                <p className="text-black">{user.phone || 'Não informado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço:</label>
                <p className="text-black">{user.address || 'Não informado'}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Editar
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Carregando...</p>
      )}
    </div>
  );
}
