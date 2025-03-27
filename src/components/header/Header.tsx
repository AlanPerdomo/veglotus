'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAdmin, setAdmin] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLUListElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setIsLoggedIn(true);
          setUserName(user.name);
          if (user.type === 'admin') {
            setAdmin(true);
          }
        }
      } catch (error) {
        console.log('Erro ao ler o usuário do localStorage:', error);
      }

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
      const dropdownButton = document.getElementById('dropdown-button');

      if (
        dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node) &&
        dropdownButton &&
        dropdownButton.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }

      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log(typeof window);
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setIsLoggedIn(false);
    setUserName('');
    setDropdownVisible(false);
    window.location.href = '/';
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-[#f0ad31] p-3 px-4 sm:px-8 flex justify-between items-center relative">
      <div>
        <Link className="flex items-center gap-2 sm:gap-4" href="/">
          <Image
            className="w-10 h-10 sm:w-14 sm:h-14"
            src="/logo.png"
            alt="Veglótus"
            width={0}
            height={0}
            sizes="100vw"
          />
          <h1 className="text-xl sm:text-3xl sm:font-bold font-semibold drop-shadow-xl">
            <span className="text-green-600">Veg</span>
            <span className="text-[#e967a8]">lótus</span>
          </h1>
        </Link>
      </div>
      <div className="sm:hidden flex gap-6">
        <Link href="/carrinho" className="relative">
          <Image src="/sacola.png" alt="Sacola" className="w-5" width={0} height={0} sizes="100vw" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
              {cartCount}
            </span>
          )}
        </Link>
        <button onClick={toggleMobileMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      <nav className="hidden sm:block">
        <ul className="flex gap-4 text-[#000000] font-bold drop-shadow-sm">
          <li className="hover:text-[#e967a8]">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-[#e967a8]">
            <Link href="/produtos">Produtos</Link>
          </li>
          <li className="text-green-600 hover:text-green-500">
            <Link href="https://wa.me/5521990808515">WhatsApp</Link>
          </li>
          <li className="relative">
            {isLoggedIn ? (
              <div>
                <button id="dropdown-button" onClick={toggleDropdown} className="hover:text-[#e967a8]">
                  {userName}
                </button>
                {dropdownVisible && (
                  <ul
                    ref={dropdownRef}
                    id="dropdown-menu"
                    className="absolute top-8 right-0 bg-gray-200 shadow-lg rounded-lg p-4 w-40 text-md text-gray-700"
                  >
                    <li className="hover:text-[#e967a8]">
                      <Link href="/user/dashboard" onClick={e => e.stopPropagation()}>
                        Perfil
                      </Link>
                    </li>
                    {isAdmin ? (
                      <li className="hover:text-green-600">
                        <Link href="/admin/dashboard" onClick={e => e.stopPropagation()}>
                          Dashboard
                        </Link>
                      </li>
                    ) : null}
                    <li className="hover:text-[#e967a8] ">
                      <Link href="/pedidos" onClick={e => e.stopPropagation()}>
                        Meus Pedidos
                      </Link>
                    </li>
                    <li className="text-red-500 hover:text-red-700">
                      <button onClick={handleLogout}>Sair</button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link href="/user/login" className="hover:text-[#e967a8]">
                Login
              </Link>
            )}
          </li>
          <li className="relative">
            <Link href="/carrinho" className="relative">
              <Image src="/sacola.png" alt="Sacola" className="w-5" width={0} height={0} sizes="100vw" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="sm:hidden absolute top-16 right-0 bg-[#f0ad31] w-full p-4 shadow-lg z-50 text-black font-semibold"
        >
          <ul className="flex flex-col gap-4">
            <li className="hover:text-[#e967a8]">
              <Link href="/">Home</Link>
            </li>
            <li className="hover:text-[#e967a8]">
              <Link href="/produtos">Produtos</Link>
            </li>
            <li className="text-green-600 hover:text-green-500">
              <Link href="https://wa.me/5521990808515">WhatsApp</Link>
            </li>
            <li>
              {isLoggedIn ? (
                <div>
                  <button id="dropdown-button" onClick={toggleDropdown} className="hover:text-[#e967a8]">
                    {userName}
                  </button>
                  {dropdownVisible && (
                    <ul className="mt-2 bg-gray-200 shadow-lg rounded-lg p-4 w-40 text-md text-gray-700">
                      <li className="hover:text-[#e967a8]">
                        <Link href="/user/dashboard">Perfil</Link>
                      </li>
                      {isAdmin ? (
                        <li className="hover:text-green-600">
                          <Link href="/admin/dashboard">Dashboard</Link>
                        </li>
                      ) : null}
                      <li className="hover:text-[#e967a8] ">
                        <Link href="/pedidos">Meus Pedidos</Link>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <Link href="/user/login" className="hover:text-[#e967a8]">
                  Login
                </Link>
              )}
            </li>
            <li>
              {isLoggedIn && (
                <button className="text-red-500 hover:text-red-700" onClick={handleLogout}>
                  Sair
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
