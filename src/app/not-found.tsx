import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">A pagina que vocé procurou nao existe</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Voltar para a Home
      </Link>
    </div>
  );
}
