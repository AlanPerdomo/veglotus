export const Footer = () => {
  return (
    <footer className="bg-[#f0ad31] text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mt-2 mb-2 text-center gap-2">
        <h1 className="text-2xl font-bold drop-shadow-xl sm:ml-4">
          <span className="text-green-600">Veg</span>
          <span className="text-[#e967a8]">lótus</span>
          <p className="text-sm text-white">Considere o Veganismo!</p>
        </h1>
        <div className="text-center text-xs text-white/80 sm:mr-4">© 2025 Veg Lotus. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
};

export default Footer;
