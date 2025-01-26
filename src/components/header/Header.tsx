export const Header = () => {
  return (
    <header className="bg-[#f0ad31] p-4 px-8 flex justify-between items-center">
      <div>
        <a className="flex items-center gap-4 " href="/">
          <img className="w-14 h-14" src="/logo.png" alt="Veglótus" />
          <h1 className="text-3xl font-bold drop-shadow-xl ">
            <span className="text-[#378b3a]">Veg</span>
            <span className="text-[#e967a8]">lótus</span>
          </h1>
        </a>
      </div>
      <nav>
        <ul className="flex gap-4 text-[#378b3a] font-bold drop-shadow-sm">
          <li className=" hover:text-[#e967a8]">
            <a href="/">Home</a>
          </li>
          <li className=" hover:text-[#e967a8]">
            <a href="/produtos">Produtos</a>
          </li>
          <li className=" hover:text-[#30b646]">
            <a href="https://wa.me/5521990808515">WhatsApp</a>
          </li>
          <li className=" hover:text-[#e967a8]">
            <a href="/user/login">Login</a>
            <ul id="dropdown-menu">
              <li>
                <a href="perfil.html">Meu Perfil</a>
              </li>
              <li>
                <a href="settings.html">Configurações</a>
              </li>
              <li>
                <button id="logout-button">Sair</button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
