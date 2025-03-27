import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex items-center justify-center ">
      <div className="  text-black container bg-white p-5 rounded-xl justify-center justify-items-center m-5 ">
        <Image src="logo.png" alt="Logo Veglotus" className="mx-auto" />
        <h1>Nosso site está em desenvolvimento!!</h1>
        <p>Estamos trabalhando duro para trazer uma experiência incrível.</p>
        <p>Em breve, você poderá acessar nossa loja online e conferir todos os nossos produtos veganos.</p>
        <p>Aguarde novidades!</p>
      </div>
    </div>
  );
}
