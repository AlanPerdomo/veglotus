'use client';
import { userService } from '@/service/user.service';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Address {
  id: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais?: string;
  isPrincipal: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  password?: string;
  cpf?: string;
  addresses?: Address[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
    cpf: '',
  });
  const [editedFields, setEditedFields] = useState<Record<string, boolean>>({});
  const [editingFields, setEditingFields] = useState({
    name: false,
    surname: false,
    email: false,
    phone: false,
    cpf: false,
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [principalAddressId, setPrincipalAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState<Address>({
    id: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: '',
    isPrincipal: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const logged = localStorage.getItem('isLogged');
      if (logged !== 'true') {
        window.location.href = '/user';
      }

      await getUser();

      const userStorage = localStorage.getItem('user');
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        setUser(userData);
        setFormData(userData);
      }
      const addressesStorage = localStorage.getItem('addresses');
      if (addressesStorage) {
        const addressesData: Address[] = JSON.parse(addressesStorage);
        setAddresses(addressesData);
        const principal = addressesData.find(addr => addr.isPrincipal);
        if (principal) {
          setPrincipalAddressId(String(principal.id));
        } else if (addressesData.length > 0) {
          setPrincipalAddressId(String(addressesData[0].id));
        }
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setEditedFields(prev => ({
      ...prev,
      [name]: true,
    }));
  };

  const getUser = async () => {
    if (localStorage.getItem('isLogged') === 'true') {
      const user = await userService.getUser(localStorage.getItem('token')!);
      setUser(user);
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  const formatCPF = (cpf: string): string => {
    const formattedCPF = cpf.replace(/\D/g, '');
    return `***.${formattedCPF.slice(3, 6)}.${formattedCPF.slice(6, 9)}-**`;
  };

  const handleDeleteAddress = async (id: string) => {
    const token = localStorage.getItem('token')!;
    const response = await userService.deleteAddress(id, token);
    if (!response) {
      alert('Erro ao deletar endereço.');
      return;
    }
    const updatedAddresses = addresses.filter(addr => String(addr.id) !== id);
    setAddresses(updatedAddresses);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    if (id === principalAddressId) {
      if (updatedAddresses.length > 0) {
        setPrincipalAddressId(String(updatedAddresses[0].id));
      } else {
        setPrincipalAddressId('');
      }
    }
  };

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAddress = async () => {
    if (
      !addressFormData.cep ||
      !addressFormData.rua ||
      !addressFormData.numero ||
      !addressFormData.complemento ||
      !addressFormData.bairro ||
      !addressFormData.cidade ||
      !addressFormData.estado
    ) {
      alert('Preencha os campos obrigatórios do endereço.');
      return;
    }
    const newAddress: Address = {
      ...addressFormData,
    };

    const token = localStorage.getItem('token')!;
    const response = await userService.registerAddress(newAddress, token);
    if (!response) {
      alert('Erro ao cadastrar endereço.');
      return;
    }
    await userService.setPrincipalAddress(response.id, token);
    await userService.getAddresses(token);
    setAddresses(prev => [...prev, response]);

    setAddressFormData({
      id: '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: '',
      isPrincipal: false,
    });
    setShowAddressForm(false);
    if (addresses.length === 1) {
      setPrincipalAddressId(newAddress.id);
    }
    window.location.href = '/user/dashboard';
  };

  const handleSave = async () => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isPrincipal: String(addr.id) === principalAddressId,
    }));
    const updatedUser = {
      ...user,
      ...formData,
      addresses: updatedAddresses,
    };

    const response = await userService.updateUser(updatedUser, localStorage.getItem('token')!);
    if (response) {
      setUser(updatedUser);
      setEditingFields({
        name: false,
        surname: false,
        email: false,
        phone: false,
        cpf: false,
      });
      setEditedFields({});
      alert('Informações atualizadas com sucesso!');
      localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
      await userService.getUser(localStorage.getItem('token')!);
    } else {
      alert('Erro ao atualizar informações.');
    }
  };

  const handleSetPrincipalAddress = async (id: string) => {
    await userService.setPrincipalAddress(id, localStorage.getItem('token')!);
  };

  const userHasChanges = () => Object.values(editedFields).some(field => field);

  const cancelEditingField = (field: keyof typeof editingFields) => {
    setEditingFields(prev => ({ ...prev, [field]: false }));
    if (user) {
      setFormData(prev => ({
        ...prev,
        [field]: (user as User)[field],
      }));
    }
    setEditedFields(prev => ({ ...prev, [field]: false }));
  };

  return (
    <div className="flex flex-col items-center justify-center container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-lg sm:text-3xl font-bold my-4 sm:my-6 text-center sm:text-left text-black">
        Informações Pessoais
      </h2>
      {user ? (
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 max-w-4xl w-full space-y-4 sm:space-y-6 text-black">
          {/* Nome */}
          <div className="flex flex-row items-center  justify-between gap-2 sm:gap-4">
            <div className="w-full">
              {editingFields.name ? (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="w-full sm:w-1/2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                      Sobrenome:
                    </label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome:
                  </label>
                  <p>{user.name + ' ' + user.surname}</p>
                </div>
              )}
            </div>
            <div className="ml-2">
              {editingFields.name ? (
                <button onClick={() => cancelEditingField('name')} className="text-red-500" title="Cancelar edição">
                  ✖️
                </button>
              ) : (
                <button
                  onClick={() => setEditingFields(prev => ({ ...prev, name: true }))}
                  className="text-blue-500"
                  title="Editar"
                >
                  <Image src="/icon_edit.png" className="w-5" width={0} height={0} sizes="100vw" alt="Editar" />
                </button>
              )}
            </div>
          </div>
          {/* E-mail */}
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail:
              </label>
              {editingFields.email ? (
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{user.email}</p>
              )}
            </div>
            <div className="ml-2">
              {editingFields.email ? (
                <button onClick={() => cancelEditingField('email')} className="text-red-500" title="Cancelar edição">
                  ✖️
                </button>
              ) : (
                <button
                  onClick={() => setEditingFields(prev => ({ ...prev, email: true }))}
                  className="text-blue-500"
                  title="Editar"
                >
                  <Image src="/icon_edit.png" className="w-5" width={0} height={0} sizes="100vw" alt="Editar" />
                </button>
              )}
            </div>
          </div>
          {/* Telefone */}
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="w-full">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone:
              </label>
              {editingFields.phone ? (
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{user.phone ? formatPhoneNumber(user.phone) : 'Não informado'}</p>
              )}
            </div>
            <div className="ml-2">
              {editingFields.phone ? (
                <button onClick={() => cancelEditingField('phone')} className="text-red-500" title="Cancelar edição">
                  ✖️
                </button>
              ) : (
                <button
                  onClick={() => setEditingFields(prev => ({ ...prev, phone: true }))}
                  className="text-blue-500"
                  title="Editar"
                >
                  <Image src="/icon_edit.png" className="w-5" width={0} height={0} sizes="100vw" alt="Editar" />
                </button>
              )}
            </div>
          </div>
          {/* CPF */}
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="w-full">
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                CPF:
              </label>
              {editingFields.cpf ? (
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{user.cpf ? formatCPF(user.cpf) : 'Não informado'}</p>
              )}
            </div>
            <div className="ml-2">
              {editingFields.cpf ? (
                <button onClick={() => cancelEditingField('cpf')} className="text-red-500" title="Cancelar edição">
                  ✖️
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!user?.cpf) {
                      setEditingFields(prev => ({ ...prev, cpf: true }));
                    }
                  }}
                  disabled={!!user?.cpf}
                  className={`text-blue-500 ${user?.cpf ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={user?.cpf ? 'CPF não pode ser editado' : 'Editar'}
                >
                  <Image src="/icon_edit.png" className="w-5" width={0} height={0} sizes="100vw" alt="Editar" />
                </button>
              )}
            </div>
          </div>
          {userHasChanges() && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                disabled={!userHasChanges()}
                className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 disabled:bg-gray-400"
              >
                Salvar alterações
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-lg sm:text-3xl text-center text-gray-500">Carregando...</p>
      )}

      {/* Seção de Endereços */}
      <h2 className="text-lg sm:text-3xl font-bold text-center my-6 sm:my-10 text-black">Endereços</h2>
      <div className="bg-white shadow-lg mb-4 sm:mb-6 rounded-lg p-4 sm:p-6 max-w-3xl w-full space-y-4 sm:space-y-6 text-black">
        {addresses.length > 0 ? (
          <div>
            <h3 className="text-md sm:text-xl font-medium mb-2">Selecione seu endereço:</h3>
            {addresses.map(addr => (
              <div
                key={addr.id}
                className={`flex flex-row items-center justify-between border p-2 rounded-lg mb-2 ${
                  principalAddressId === String(addr.id) ? 'bg-blue-100' : 'bg-white'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="principalAddress"
                    checked={principalAddressId === String(addr.id)}
                    onChange={async () => {
                      setPrincipalAddressId(String(addr.id));
                      await handleSetPrincipalAddress(String(addr.id));
                    }}
                    className="mr-2"
                  />
                  <div>
                    <p className="text-sm">
                      {`${addr.rua}, ${addr.numero}${addr.complemento ? `, ${addr.complemento}` : ''}`}
                    </p>
                    <p className="text-sm">{`${addr.bairro}, ${addr.cidade} - ${addr.estado}`}</p>
                    <p className="text-sm">{`CEP: ${addr.cep}`}</p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleDeleteAddress(String(addr.id))}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                    title="Deletar endereço"
                  >
                    <Image className="max-w-[20px]" src="/icon_trash.png" width={0} height={0} alt="Deletar" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhum endereço cadastrado.</p>
        )}
        <div className="flex flex-auto justify-center">
          {!showAddressForm ? (
            <button
              onClick={() => setShowAddressForm(prev => !prev)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-500"
            >
              Adicionar Novo Endereço
            </button>
          ) : null}

          {showAddressForm && (
            <div className="sm:m-6 p-4 sm:p-6 bg-gray-100 shadow-lg rounded-lg w-full max-w-3xl">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Novo Endereço</h3>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                  CEP:
                </label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={addressFormData.cep}
                  onChange={handleAddressFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <label htmlFor="rua" className="block text-sm font-medium text-gray-700">
                  Rua:
                </label>
                <input
                  type="text"
                  id="rua"
                  name="rua"
                  value={addressFormData.rua}
                  onChange={handleAddressFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                  Número:
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={addressFormData.numero}
                  onChange={handleAddressFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                  Complemento:
                </label>
                <input
                  type="text"
                  id="complemento"
                  name="complemento"
                  value={addressFormData.complemento}
                  onChange={handleAddressFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
                  Bairro:
                </label>
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={addressFormData.bairro}
                  onChange={handleAddressFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
                  Cidade:
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={addressFormData.cidade}
                  onChange={handleAddressFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                  Estado:
                </label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={addressFormData.estado}
                  onChange={handleAddressFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-between mt-4 sm:mt-6">
                <button
                  onClick={handleAddAddress}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Salvar Endereço
                </button>
                <button
                  onClick={() => setShowAddressForm(prev => !prev)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
