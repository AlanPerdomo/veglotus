import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-[#f0ad31] text-white  ">
      <div className="flex flex-col sm:flex-row justify-between items-center m-4 text-center gap-2">
        <div className="text-2xl font-bold drop-shadow-xl justify-between">
          <p>
            <span className="text-green-600">Veg</span>
            <span className="text-[#e967a8]">Lótus</span>
          </p>
          <p className="text-sm text-white">Considere o Veganismo!</p>
        </div>
        <div className="text-center flex-1 text-xs text-white/80 ">
          <p>© 2025 VegLótus. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por{' '}
            <Link href="https://github.com/AlanPerdomo" className="underline hover:text-blue-500">
              Alan Perdomo
            </Link>
          </p>
        </div>
        <div className="text-2xl font-bold drop-shadow-xl justify-between">
          <p className="text-sm text-white/80 shadow-xl">
            <a href="https://wa.me/5521990808515" className="hover:text-white">
              WhatsApp (21) 99080-8515
            </a>
          </p>
          <p className="text-sm text-white/80 shadow-xl">
            ✉️{' '}
            <a href="mailto:contato@veglotus.com.br" className="hover:text-white">
              contato@veglotus.com.br
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
