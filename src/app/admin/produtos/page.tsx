'use client';
import { productService } from '@/service/product.service';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { API_URL } from '@/service/config.service';

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
export interface NewProduct {
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  estoque: number;
  active: boolean;
}

export default function Produtos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductImage, setSelectedProductImage] = useState<File | null>(null);
  const [productModal, setProductModal] = useState(false);
  const [newProductModal, setNewProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    description: '',
    price: 0,
    category: '',
    estoque: 1,
    active: true,
  });

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    const response = await productService.listar();
    if (response) {
      setProducts(response);
    }
  };

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
    fetchProdutos();
    setSelectedProduct(null);
    setSelectedProductImage(null);
    setProductModal(false);
  };

  const toggleNewProductModal = () => {
    fetchProdutos();
    setNewProductModal(!newProductModal);
  };

  const getColor = (active: boolean, estoque: number) => {
    if (!active) return 'bg-red-100';
    if (estoque <= 0) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const handleNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await productService.cadastrar(newProduct);
    if (response) {
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: '',
        estoque: 1,
        active: true,
      });
      toggleNewProductModal();
    }
  };

  const handleProductUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedProduct) {
      const response = await productService.atualizar(selectedProduct, selectedProductImage);

      if (response) {
        fetchProdutos();
        closeProductModal();
      }
    }
  };

  const handleProductUpdateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    console.log(typeof file);
    if (file) {
      setSelectedProductImage(file);
    }
  };

  const formatPriceFromString = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="container sm:mx-auto sm:px-4 px-2 sm:p-6 p-4">
      <h2 className="text-2xl sm:text-3xl flex-1 font-semibold text-center sm:mb-6 mb-4 text-black">Produtos</h2>
      <div className="flex justify-end">
        <button onClick={toggleNewProductModal} className="mb-4 text-right">
          <span className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full">Adicionar Produto</span>
        </button>
      </div>
      <div>
        {products.map(product => (
          <div
            key={product.id}
            className={`border items-center flex p-4 mb-4 justify-between cursor-pointer hover:bg-gray-300 ${getColor(
              product.active,
              product.estoque,
            )} rounded transition`}
            onClick={() => openProductModal(product)}
          >
            <Image
              src={product.image !== null ? `${API_URL}produtos/img/${product.id}` : '/no-image.jpg'}
              alt={product.name || 'Sem imagem'}
              width={200}
              height={200}
              className="w-32 h-32 object-cover rounded-md shadow-md"
            />

            <div className="ml-4 flex-1">
              <h2 className="text-xl font-bold">
                (#{product.id}) {product.name}
              </h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-700 font-semibold mt-2">Preço: R$ {product.price}</p>
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

      {newProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative transform transition-all duration-300 animate-scale-in">
            <button className="absolute top-2 right-2" onClick={toggleNewProductModal}>
              x
            </button>
            <h2 className="text-black font-bold text-center text-lg">Adicionar Produto</h2>
            <form onSubmit={handleNewProduct} className="mt-4 space-y-4">
              <div className="flex items-center space-x-2">
                <label>Nome:</label>
                <input
                  type="text"
                  id="name"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Nome"
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <label>Descrição:</label>
                <input
                  type="text"
                  id="description"
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Descrição"
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <label>Preço:</label>
                <input
                  type="text"
                  id="price"
                  autoComplete="on"
                  value={formatPriceFromString(newProduct.price)}
                  onChange={e => {
                    const onlyNumbers = e.target.value.replace(/\D/g, '');
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat((parseInt(onlyNumbers || '0') / 100).toFixed(2)),
                    });
                  }}
                  className="border p-2 w-full rounded"
                  inputMode="numeric"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <label>Estoque:</label>
                <input
                  type="number"
                  id="estoque"
                  min={0}
                  max={100}
                  value={newProduct.estoque}
                  onChange={e => setNewProduct({ ...newProduct, estoque: parseInt(e.target.value) })}
                  placeholder="Estoque"
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <label>Categoria:</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  placeholder="Categoria"
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <label>Ativo:</label>
                <input
                  type="checkbox"
                  checked={newProduct.active}
                  onChange={e => setNewProduct({ ...newProduct, active: e.target.checked })}
                />
              </div>

              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 rounded py-2 w-full">
                Adicionar Produto
              </button>
            </form>
          </div>
        </div>
      )}

      {productModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[95vh] overflow-y-auto relative transform transition-all duration-300 animate-scale-in">
            <button onClick={closeProductModal} className="absolute top-2 right-2 text-gray-600 hover:text-black">
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">Editar Produto</h2>
            <form onSubmit={handleProductUpdate} onChange={() => {}} className="mt-4">
              <div className="space-y-4">
                <input
                  type="text"
                  id="name"
                  value={selectedProduct.name}
                  onChange={e => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  placeholder="Nome"
                  className="border p-2 w-full rounded"
                />
                <textarea
                  id="description"
                  value={selectedProduct.description}
                  onChange={e => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  placeholder="Descrição"
                  className="border p-2 w-full rounded"
                />
                <input
                  id="price"
                  inputMode="numeric"
                  type="number"
                  value={selectedProduct.price}
                  onChange={e => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                  placeholder="Preço, ex: 120,00"
                  className="border p-2 w-full rounded"
                />
                <input
                  id="estoque"
                  type="number"
                  value={selectedProduct.estoque}
                  onChange={e => setSelectedProduct({ ...selectedProduct, estoque: parseInt(e.target.value) })}
                  placeholder="Estoque"
                  className="border p-2 w-full rounded"
                />
                <input
                  id="category"
                  type="text"
                  value={selectedProduct.category}
                  onChange={e => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                  placeholder="Categoria"
                  className="border p-2 w-full rounded"
                />
                <div className="flex items-center space-x-2">
                  <label>Ativo:</label>
                  <input
                    id="active"
                    type="checkbox"
                    checked={selectedProduct.active}
                    onChange={e => setSelectedProduct({ ...selectedProduct, active: e.target.checked })}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <Image
                      src={
                        selectedProductImage instanceof File
                          ? URL.createObjectURL(selectedProductImage)
                          : selectedProduct.image !== null
                          ? `${API_URL}produtos/img/${selectedProduct.id}`
                          : '/no-image.jpg'
                      }
                      alt={selectedProduct.name || 'Sem imagem'}
                      width={300}
                      height={300}
                      className="rounded-md object-cover hover:opacity-80 transition"
                    />
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProductUpdateImage}
                  />
                </div>

                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 rounded py-2 w-full">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
