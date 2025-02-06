'use client';
import { userService } from '@/service/user.service';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  addresses?: Address[];
}

interface Address {
  id: string;
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  pais: string;
  complemento: string;
  isPrincipal: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    email: '',
    phone: '',
    addresses: [],
  });
  const [principalAddress, setPrincipalAddress] = useState<Address | null>(null);
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  useEffect(() => {
    const fetchUserData = async () => {
      const user = localStorage.getItem('user');
      const addresses = localStorage.getItem('addresses');

      if (user && addresses) {
        const userData = JSON.parse(user);
        const addressData = JSON.parse(addresses);

        setUser(userData);
        setAddressList(addressData);

        const principalAddress = addressData.find((addr: Address) => addr.isPrincipal);
        if (principalAddress) {
          setPrincipalAddress(principalAddress);
        }
        setAddressList(addressData);
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

  const handleAddressChange = (addressId: string) => {
    const selectedAddress = addressList.find(addr => addr.id === addressId);
    if (selectedAddress) {
      setPrincipalAddress(selectedAddress);
    }
  };

  const handleSaveNewAddress = async () => {
    if (!newAddress.rua || !newAddress.numero || !newAddress.cidade || !newAddress.estado) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const updatedAddressList = [
      ...addressList,
      {
        ...newAddress,
        id: Date.now().toString(),
        isPrincipal: false,
      } as Address,
    ];
    setAddressList(updatedAddressList);
    setNewAddress({});
    setShowAddressForm(false);
  };

  const handleSave = async () => {
    const updatedUser = {
      ...user,
      ...formData,
      addresses: addressList.map(addr => ({
        ...addr,
        isPrincipal: addr.id === principalAddress?.id,
      })),
    };

    const response = await userService.updateUser(updatedUser, localStorage.getItem('token')!);
    if (response) {
      setUser(updatedUser);
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
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                  CPF:
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço:
                </label>
                <select
                  value={principalAddress?.id || ''}
                  onChange={e => handleAddressChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="">Selecione um endereço</option>
                  {addressList.map(addr => (
                    <option key={addr.id} value={addr.id}>
                      {`${addr.rua}, ${addr.numero}, ${addr.cidade}, ${addr.estado}`}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowAddressForm(true)}
                className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Adicionar Novo Endereço
              </button>

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
                <p className="text-black">
                  {principalAddress
                    ? `${principalAddress.rua}, ${principalAddress.numero}, ${principalAddress.cidade}, ${principalAddress.estado}`
                    : 'Nenhum endereço principal cadastrado.'}
                </p>
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
