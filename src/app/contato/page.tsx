export default function Contato() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-2">
      <h1 className="text-4xl font-bold mb-4">Contato</h1>
      <p className="text-lg mb-4">Estamos aqui para ajudar!</p>
      <p className="text-lg mb-4">Entre em contato conosco através do WhatsApp:</p>
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        WhatsApp
      </a>

      <p className="text-lg mt-4">Ou envie um e-mail para:</p>
      <a href="mailto:alanperdomo@hotmail.com" className="text-blue-500 hover:underline">
        contato@veglotus.com.br
      </a>
    </div>
  );
}
