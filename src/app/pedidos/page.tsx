'use client';
import { orderService } from '@/service/order.service';
import { useState } from 'react';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);

  const meusPedidos = async () => {
    const pedidos = await orderService.listar();
    setPedidos(pedidos);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-500 mb-6">Pedidos</h1>
      </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-green-500 mb-6">Pedidos</h1>
          {pedidos.length === 0 ? (
            <div className="text-center text-gray-500">Você ainda não fez nenhum pedido.</div>
          ) : (
            <div className="space-y-6">
              {pedidos.map((pedido: any) => (
                <div
                  key={pedido.id}
                  className="flex items-center justify-between border p-4 rounded-lg shadow-md bg-white"
                >
                  <div className="flex-1 ml-4">
                    <h3 className="text-black font-semibold">Pedido #{pedido.id}</h3>
                    <p className="text-green-600 font-bold">R$ {pedido.total}</p>
                    <p className="text-gray-500">Status: {pedido.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={meusPedidos}
        className="flex items-center bg-[#f0ad31] hover:bg-[#e6942c] text-white font-semibold  rounded-md py-2 px-4"
      >
        atualizar
      </button>
    </div>
  );
}
