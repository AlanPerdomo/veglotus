'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { productService } from '@/service/product.service';
import { FiSearch } from 'react-icons/fi';
import { API_URL } from '@/service/config.service';

export default function Produtos() {
  interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    active: boolean;
    estoque: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [windowSize, setWindowSize] = useState<number>(0);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      const response = await productService.listar();
      if (response) {
        setProducts(response);

        const initialExpandedState = response.reduce((acc: Record<string, boolean>, product: Product) => {
          acc[product.category] = true;
          return acc;
        }, {});
        setExpandedCategories(initialExpandedState);

        const initialQuantities = response.reduce((acc: Record<string, number>, product: Product) => {
          acc[product.id] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      }
    };
    fetchProdutos();
  }, []);

  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();
    const filtered = products.filter(product => product.name.toLowerCase().includes(lowerCaseSearch));
    setFilteredProducts(filtered);
  }, [search, products]);

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.min(100, Math.max(1, value)),
    }));
  };

  const incrementQuantity = (productId: number) => {
    handleQuantityChange(productId, quantities[productId] + 1);
  };

  const decrementQuantity = (productId: number) => {
    handleQuantityChange(productId, quantities[productId] - 1);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const quantity = quantities[product.id];

    const existingProductIndex = cart.findIndex((item: Product & { quantity?: number }) => item.id === product.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));

    closeProductModal();
  };

  const openProductModal = (product: Product) => {
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1,
    }));
    setSelectedProduct(product);
  };

  const groupedProducts = filteredProducts.reduce<Record<string, Product[]>>((acc, product) => {
    const { category } = product;
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const toggleCategory = (categoria: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  return (
    <div className="container sm:mx-auto sm:px-4 px-2 sm:p-6 p-4 ">
      <div className="flex items-center justify-center flex-col text-center">
        <h2 className="text-2xl sm:text-3xl flex-1 font-semibold text-center sm:mb-4 mb-2 text-black">Produtos</h2>
        <div className="sm:mb-4 mb-2 flex justify-center relative">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="sm:hidden text-black bg-gray-200 p-1 rounded-full"
          >
            <FiSearch size={20} />
          </button>
          {(showSearch || windowSize >= 640) && (
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="border border-gray-200 text-black rounded-lg p-1  w-full max-w-md sm:block"
            />
          )}
        </div>
      </div>

      {Object.keys(groupedProducts).map(categoria => (
        <div key={categoria} className="mb-2 sm:mb-4">
          <div className="flex items-center justify-between bg-gray-200 sm:p-2 p-1 sm:pl-4 pl-2 sm:pr-5 pr-3 rounded-xl">
            <h3 className="text-sm sm:text-2xl font-semibold text-[#378b3a] capitalize">{categoria}</h3>
            <button
              onClick={() => toggleCategory(categoria)}
              className="sm:text-sm text-xs bg-[#f0ad31] text-white font-semibold sm:py-1 sm:px-2 px-1 rounded-md"
            >
              {expandedCategories[categoria] ? 'v' : '>'}
            </button>
          </div>
          {expandedCategories[categoria] && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-2 gap-1 sm:mt-2 sm:mb-2 mt-1 mb-1">
              {groupedProducts[categoria].map(product => {
                if (product.active && product.estoque > 0) {
                  return (
                    <div
                      key={product.id}
                      className={`rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow bg-white sm:p-2 p-1 max-w-sm cursor-pointer hover:scale-110 h-auto flex flex-col justify-between`}
                      onClick={() => openProductModal(product)}
                    >
                      <div className="flex-1 flex items-center justify-center bg-gray-100">
                        <Image
                          src={product.image !== null ? `${API_URL}produtos/img/${product.id}` : '/no-image.jpg'}
                          alt="product.name"
                          width={400}
                          height={50}
                          priority={false}
                          className="flex sm:h-52 h-fit w-fit  object-cover text-black"
                        />
                      </div>

                      <div className="p-2 flex sm:flex-col justify-between text-xs sm:text-base font-bold">
                        <h3 className="text-black">{product.name}</h3>
                        <p className="text-green-600 text-sm sm:text-md">R$ {(product.price / 100).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      ))}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button onClick={closeProductModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              &times;
            </button>
            {selectedProduct.image && (
              <Image
                src={selectedProduct.image !== '' ? `${API_URL}produtos/img/${selectedProduct.id}` : '/no-image.jpg'}
                alt={selectedProduct.name}
                width={200}
                height={100}
                className="w-300 h-300 object-cover rounded-md mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-black mb-2">{selectedProduct.name}</h3>
            <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
            <p className="text-green-600 font-bold text-lg">R$ {(selectedProduct.price / 100).toFixed(2)}</p>
            <div className="flex items-center mb-4 mt-4">
              <button
                onClick={() => decrementQuantity(selectedProduct.id)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded-l-lg"
              >
                -
              </button>
              <input
                id={`quantidade-${selectedProduct.id}`}
                name={`quantidade-${selectedProduct.id}`}
                type="text"
                value={quantities[selectedProduct.id]}
                readOnly
                className="w-12 text-center border-y border-gray-300 text-black"
              />
              <button
                onClick={() => incrementQuantity(selectedProduct.id)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded-r-lg"
              >
                +
              </button>
            </div>
            <button
              onClick={() => handleAddToCart(selectedProduct)}
              className="w-full bg-[#f0ad31] hover:bg-[#e6942c] text-black font-semibold py-2 rounded-md"
            >
              Adicionar ao Carrinho{' '}
              <span className="text-green-800 font-bold">
                R${((quantities[selectedProduct.id] * selectedProduct.price) / 100).toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
