'use client';
import { useEffect, useState } from 'react';
import { productService } from '@/service/product.service';

export default function Produtos() {
  interface Product {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    imagem: string;
    categoria: string;
  }
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      const response = await productService.listar();

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    };

    fetchProdutos();
  }, []);

  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();
    const filtered = products.filter(product => product.nome.toLowerCase().includes(lowerCaseSearch));
    setFilteredProducts(filtered);
  }, [search, products]);

  const groupedProducts = filteredProducts.reduce<Record<string, Product[]>>((acc, product) => {
    const { categoria } = product;
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(product);
    return acc;
  }, {});

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
          className="border border-gray-00 text-black rounded-lg p-2 w-full max-w-md"
        />
      </div>

      {/* Exibição dos produtos por categoria */}
      {Object.keys(groupedProducts).map(categoria => (
        <div key={categoria} className="mb-8">
          <h3 className="text-2xl font-semibold text-[#378b3a] mb-4 capitalize bg-gray-200 p-2 pl-4 rounded-xl ">
            {categoria}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {groupedProducts[categoria].map(product => (
              <div
                key={product.id}
                className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow bg-white p-4"
              >
                <img src={product.imagem} alt={product.nome} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg text-black font-semibold">{product.nome}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.descricao}</p>
                  <p className="text-green-600 font-bold text-lg">R$ {(product.preco / 100).toFixed(2)}</p>
                  <button className="mt-4 w-full bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold py-2 rounded-md">
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
