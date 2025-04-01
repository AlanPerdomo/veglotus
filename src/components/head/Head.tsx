import Head from 'next/head';
export const head = () => {
  return (
    <Head>
      <title> Veglótus </title>
      <link rel="icon" href="/logo.png" />
      <script src="https://sdk.mercadopago.com/js/v2" async></script>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};

export default Head;
