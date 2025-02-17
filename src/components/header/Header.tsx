'use client';
import { useState, useEffect, useRef } from 'react';

export const Header = () => {
  // Inicializa os estados com valores padrão
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Verifica se estamos no ambiente do navegador
    if (typeof window !== 'undefined') {
      // Atualiza o estado do usuário
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setIsLoggedIn(true);
          setUserName(user.name);
        }
      } catch (error) {
        console.log('Erro ao ler o usuário do localStorage:', error);
      }

      // Atualiza o contador do carrinho
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const cart = JSON.parse(storedCart);
          const totalItems = cart.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
          setCartCount(totalItems);
        }
      } catch (error) {
        console.log('Erro ao ler o carrinho do localStorage:', error);
      }

      // Função para atualizar o contador do carrinho quando ocorrer mudanças em outras abas
      const updateCartCount = () => {
        try {
          const storedCart = localStorage.getItem('cart');
          if (storedCart) {
            const cart = JSON.parse(storedCart);
            const totalItems = cart.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
            setCartCount(totalItems);
          } else {
            setCartCount(0);
          }
        } catch (error) {
          console.log(error);
        }
      };

      window.addEventListener('storage', updateCartCount);
      return () => window.removeEventListener('storage', updateCartCount);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };
    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setIsLoggedIn(false);
    setUserName('');
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header className="bg-[#f0ad31] p-3 px-8 flex justify-between items-center">
      <div>
        <a className="flex items-center gap-4" href="/">
          <img className="w-14 h-14" src="/logo.png" alt="Veglótus" />
          <h1 className="text-3xl font-bold drop-shadow-xl">
            <span className="text-[#378b3a]">Veg</span>
            <span className="text-[#e967a8]">lótus</span>
          </h1>
        </a>
      </div>
      <nav>
        <ul className="flex gap-4 text-[#000000] font-bold drop-shadow-sm">
          <li className="hover:text-[#e967a8]">
            <a href="/">Home</a>
          </li>
          <li className="hover:text-[#e967a8]">
            <a href="/produtos">Produtos</a>
          </li>
          <li className="text-[#378b3a] hover:text-[#30b646]">
            <a href="https://wa.me/5521990808515">WhatsApp</a>
          </li>
          <li className="relative">
            {isLoggedIn ? (
              <div>
                <button onClick={toggleDropdown} className="hover:text-[#e967a8]">
                  {userName}
                </button>
                {dropdownVisible && (
                  <ul
                    ref={dropdownRef}
                    id="dropdown-menu"
                    className="absolute top-8 right-0 bg-gray-200 shadow-lg rounded-lg p-4 w-40 text-md text-gray-700"
                  >
                    <li className="hover:text-[#e967a8]">
                      <a href="/user/dashboard">Perfil</a>
                    </li>
                    <li className="hover:text-[#e967a8] ">
                      <a href="/pedidos">Meus Pedidos</a>
                    </li>
                    {/* <li className="hover:text-[#e967a8]">
                      <a href="/settings">Configurações</a>
                    </li> */}
                    <li className="hover:text-red-500">
                      <button onClick={handleLogout}>Sair</button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <a href="/user/login" className="hover:text-[#e967a8]">
                Login
              </a>
            )}
          </li>
          <li className="relative">
            <a href="/carrinho" className="relative">
              <img src="/sacola.png" alt="Sacola" className="w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                  {cartCount}
                </span>
              )}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
