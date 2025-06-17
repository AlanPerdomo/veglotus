import Link from 'next/link';
import Image from 'next/image';
export const Footer = () => {
  return (
    <footer className="bg-[#f0ad31] text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center m-4 text-center gap-2">
        <div className="text-2xl font-bold drop-shadow-xl justify-between order-1 sm:order-none">
          <p>
            <span className="text-green-600">Veg</span>
            <span className="text-[#e967a8]">Lótus</span>
          </p>
          <p className="text-sm text-white">Considere o Veganismo!</p>
        </div>
        <div className="text-center flex-1 text-xs text-white/80 order-3 sm:order-none">
          <p>© 2025 VegLótus. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por{' '}
            <Link href="https://alanperdomo.github.io/" className="underline hover:text-blue-500">
              Alan Perdomo
            </Link>
          </p>
        </div>
        <div className="text-2xl font-bold drop-shadow-xl justify-between order-2 sm:order-none">
          <p className="text-sm text-white/80 shadow-xl flex items-center">
            <Image src="/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5" width={0} height={0} sizes="100vw" />

            <a href="https://wa.me/5521990808515" className="hover:text-white">
              WhatsApp (21) 99080-8515
            </a>
          </p>
          <p className="text-sm text-white/80 shadow-xl">
            ✉️{' '}
            <a href="/contato" className="hover:text-white">
              contato@veglotus.com.br
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
