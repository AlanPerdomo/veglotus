import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex items-center justify-center ">
      <div className="  text-black container bg-white p-5 rounded-xl justify-center justify-items-center m-5 ">
        <Image src="/logo.png" alt="Logo Veglotus" className="w-32 h-32 " width={0} height={0} sizes="100vw" />
        <h1>Nosso site está em desenvolvimento!!</h1>
        <p>Estamos trabalhando duro para trazer uma experiência incrível.</p>
        <p>Em breve, você poderá acessar nossa loja online e conferir todos os nossos produtos veganos.</p>
        <p>Aguarde novidades!</p>
      </div>
    </div>
  );
}

// https://xalingo.vteximg.com.br/arquivos/ids/158654-500-500/0966.9---Casinha-Kids-House.jpg?v=637974716694930000
// https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg
// https://dummyimage.com/400x300/ddd/000&text=Produto
// https://dummyimage.com/400x300/ddd/000&text=Produto45
// https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg
