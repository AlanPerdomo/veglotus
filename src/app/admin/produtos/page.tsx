'use client';
import { productService } from '@/service/product.service';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  estoque: number;
  active: boolean;
}

export default function Produtos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productModal, setProductModal] = useState(false);

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

  const toggleActive = async (productId: number) => {
    const product = products.find(product => product.id === productId);
    if (product) {
      product.active = !product.active;
      await productService.atualizar(product);
      setProducts([...products]);
    }
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setProductModal(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setProductModal(false);
  };

  return (
    <div className="container sm:mx-auto sm:px-4 px-2 sm:p-6 p-4">
      <h2 className="text-2xl sm:text-3xl flex-1 font-semibold text-center sm:mb-6 mb-4 text-black">Produtos</h2>
      <div>
        {products.map(product => (
          <div
            key={product.id}
            className="border items-center flex p-4 mb-4 justify-between cursor-pointer hover:bg-gray-100 transition"
            onClick={() => openProductModal(product)}
          >
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="w-32 h-32 object-cover"
              />
            ) : (
              <Image
                src="/no-image.jpg"
                alt={product.name}
                width={200}
                height={200}
                className="w-32 h-32 object-cover"
              />
            )}
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-700 font-semibold mt-2">Preço: R$ {product.price.toFixed(2)}</p>
              <p className="text-sm">Estoque: {product.estoque}</p>
              <p className="text-sm">Categoria: {product.category}</p>
            </div>

            <div className="flex items-center ml-4" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => toggleActive(product.id)}
                className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${
                  product.active ? 'bg-green-400' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                    product.active ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {productModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative transform transition-all duration-300 animate-scale-in">
            <button onClick={closeProductModal} className="absolute top-2 right-2 text-gray-600 hover:text-black">
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">Editar Produto</h2>

            <div className="space-y-4">
              <input
                type="text"
                value={selectedProduct.name}
                onChange={e => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                placeholder="Nome"
                className="border p-2 w-full rounded"
              />
              <textarea
                value={selectedProduct.description}
                onChange={e => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                placeholder="Descrição"
                className="border p-2 w-full rounded"
              />
              <input
                type="number"
                value={selectedProduct.price}
                onChange={e => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                placeholder="Preço, ex: 120,00"
                className="border p-2 w-full rounded"
              />
              <input
                type="number"
                value={selectedProduct.estoque}
                onChange={e => setSelectedProduct({ ...selectedProduct, estoque: parseInt(e.target.value) })}
                placeholder="Estoque"
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                value={selectedProduct.category}
                onChange={e => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                placeholder="Categoria"
                className="border p-2 w-full rounded"
              />
              <div className="flex items-center space-x-2">
                <label>Ativo:</label>
                <input
                  type="checkbox"
                  checked={selectedProduct.active}
                  onChange={e => setSelectedProduct({ ...selectedProduct, active: e.target.checked })}
                />
              </div>

              {/* <div>
                <label>Imagem:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async e => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];

                      const formData = new FormData();
                      formData.append('file', file);

                      const uploadResponse = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      });

                      if (uploadResponse.ok) {
                        const { imageUrl } = await uploadResponse.json();
                        setSelectedProduct({ ...selectedProduct, image: imageUrl });
                      }
                    }
                  }}
                  className="mt-2"
                />
              </div> */}

              {selectedProduct.image && (
                <div className="mt-4">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width={300}
                    height={300}
                    className="rounded-md object-cover"
                  />
                </div>
              )}

              <button
                onClick={async () => {
                  if (selectedProduct) {
                    await productService.atualizar(selectedProduct);
                    // Atualizar o produto na lista
                    setProducts(products.map(p => (p.id === selectedProduct.id ? selectedProduct : p)));
                    closeProductModal();
                  }
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
