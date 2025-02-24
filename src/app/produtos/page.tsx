'use client';
import { useEffect, useState } from 'react';
import { productService } from '@/service/product.service';

export default function Produtos() {
  interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      const response = await productService.listar();

      if (response.ok) {
        const data = await response.json();
        setProducts(data);

        const initialExpandedState = data.reduce((acc: Record<string, boolean>, product: Product) => {
          acc[product.category] = true;
          return acc;
        }, {});

        setExpandedCategories(initialExpandedState);

        const initialQuantities = data.reduce((acc: Record<string, number>, product: Product) => {
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

    alert('Produto adicionado ao carrinho!');
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
    <div className="container mx-auto px-4 p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">Produtos</h2>

      {/* Barra de busca */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar produtos..."
          className="border border-gray-200 text-black rounded-lg p-2 w-full max-w-md"
        />
      </div>

      {/* Exibição dos produtos por categoria */}
      {Object.keys(groupedProducts).map(categoria => (
        <div key={categoria} className="mb-8">
          <div className="flex items-center justify-between bg-gray-200 p-2 pl-4 pr-5 rounded-xl">
            <h3 className="text-2xl font-semibold text-[#378b3a] capitalize bg-gray-200 rounded-xl">{categoria}</h3>
            <button
              onClick={() => toggleCategory(categoria)}
              className="text-sm bg-[#f0ad31] text-white font-semibold py-1 px-2 rounded-md"
            >
              {expandedCategories[categoria] ? '-' : '+'}
            </button>
          </div>
          {expandedCategories[categoria] && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 mt-4">
              {groupedProducts[categoria].map(product => (
                <div
                  key={product.id}
                  className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow bg-white p-4 max-w-sm"
                  onClick={() => openProductModal(product)}
                >
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                  <div className="p-2">
                    <h3 className="text-sm text-black font-semibold truncate">{product.name}</h3>
                    <p className="text-green-600 font-bold text-sm">
                      R$ {(Math.trunc(product.price * 100) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modal de visualização do produto */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg relative">
            <button onClick={closeProductModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              &times;
            </button>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-bold text-black mb-2">{selectedProduct.name}</h3>
            <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
            <p className="text-green-600 font-bold text-lg">
              R$ {(Math.trunc(selectedProduct.price * 100) / 100).toFixed(2)}
            </p>
            <div className="flex items-center mb-4">
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
              className="w-full bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold py-2 rounded-md"
            >
              Adicionar ao Carrinho R${''}
              {((quantities[selectedProduct.id] * Math.trunc(selectedProduct.price * 100)) / 100).toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
