import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
// import Head from '../components/head/Head';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Veglótus',
  description: 'Sua loja de produtos veganos!',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Veglótus',
    description: 'Sua loja de produtos veganos!',
    images: ['/logo.png'],
    siteName: 'Veglótus',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veglótus',
    description: 'Sua loja de produtos veganos!',
    images: ['/logo.png'],
    creator: '@Veglotus',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-Br">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex text-black flex-col min-h-screen`}>
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
