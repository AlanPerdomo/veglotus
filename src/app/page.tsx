'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen flex-1 bg-green-50 flex items-center justify-center p-6">
      <>
        <motion.div
          className="bg-white p-10 rounded-2xl shadow-2xl text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl font-bold text-green-800 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Bem-vindo à Veg Lotus!
          </motion.h1>
          <p className="text-gray-600 text-lg mb-6">Delícias veganas direto da nossa cozinha pra sua casa.</p>
          <motion.a
            href="/produtos"
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Produtos
          </motion.a>
        </motion.div>
      </>
    </div>
  );
}
