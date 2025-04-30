# VegLotus – Loja Online de Comidas Veganas

**VegLotus** é uma loja online especializada em produtos veganos e sustentáveis. Nosso objetivo é oferecer uma experiência de compra simples, intuitiva e eficiente, alinhada com valores saudáveis e ecológicos. O site apresenta um catálogo completo de produtos veganos, reforçando a conscientização sobre o veganismo e permitindo que clientes explorem e adquiram facilmente alimentos livres de crueldade.

## Funcionalidades Principais

Além de exibir produtos veganos de alta qualidade, o site VegLotus conta com diversas funcionalidades para facilitar a vida do cliente. Entre as principais, destacam-se:

- **Catálogo de Produtos:** listagem de produtos veganos com imagens, descrições e informações nutricionais, permitindo a seleção de itens para compra.
- **Carrinho de Compras:** os clientes podem adicionar produtos ao carrinho, alterar quantidades ou remover itens antes de finalizar o pedido.
- **Checkout Seguro:** integração com meios de pagamento como MercadoPago e PIX para pagamentos online rápidos e confiáveis.
- **Cadastro e Login de Usuário:** sistema de autenticação que permite ao cliente criar conta, acessar seu perfil e acompanhar histórico de pedidos.
- **Perfil e Pedidos:** área de usuário onde é possível visualizar dados pessoais, editar informações e consultar o status de pedidos feitos.
- **Administração:** painel restrito para gerenciamento de produtos, pedidos e informações da loja (visível apenas para administradores logados).
- **Design Responsivo:** interface adaptável a dispositivos móveis e desktops, garantindo usabilidade consistente em qualquer tela.
- **Contato via WhatsApp:** acesso rápido ao suporte e atendimento através de chat no WhatsApp, facilitando dúvidas e pedidos personalizados.

## Tecnologias e Frameworks

O projeto VegLotus foi desenvolvido com tecnologia moderna, visando desempenho, manutenção e escalabilidade. Entre os principais frameworks e bibliotecas utilizados estão:

- **Next.js (React):** framework React com Server-Side Rendering (SSR) para otimizações de performance e SEO.
- **Nest.js:** framework Node.js para backend, implementando APIs RESTful (separado neste repositório).
- **PostgreSQL:** sistema de banco de dados relacional (backend) para armazenar dados de produtos, usuários e pedidos.
- **TypeScript:** superset do JavaScript para tipagem estática e maior segurança no desenvolvimento.
- **Tailwind CSS:** biblioteca utilitária de CSS para estilização rápida e responsiva da interface.
- **Framer Motion:** biblioteca de animações React usada para transições suaves e interações visuais.
- **React Icons:** pacotes de ícones (fontes SVG) para elementos visuais como botões de menu e carrinho.
- **Swiper:** componente React para criar galerias/carrosséis de produtos interativos.
- **MercadoPago SDK:** integração de pagamentos online, permitindo transações com PIX e cartões.
- **GitHub Actions:** pipeline de CI/CD para build automático e deploy contínuo (GitHub Pages) após cada atualização do código.

## Instalação e Execução Local

Para rodar o projeto localmente, siga os passos abaixo:

1. **Clone** este repositório:
   ```bash
   git clone https://github.com/AlanPerdomo/veglotus.git
   ```
2. **Acesse** o diretório do projeto:
   ```bash
   cd veglotus
   ```
3. **Instale** as dependências:
   ```bash
   npm install
   ```
4. **Execute** o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. **Abra** o navegador em [http://localhost:3000](http://localhost:3000) para visualizar o site.

> **Observação:** Caso seja necessário configurar variáveis de ambiente, crie um arquivo `.env.local` na raiz do projeto e defina as variáveis correspondentes.

## Estrutura do Projeto

- `.github/workflows/`: configurações de CI/CD com GitHub Actions
- `public/`: ativos estáticos como imagens e ícones
- `src/app/`: rotas do Next.js (App Router) por página
- `src/components/`: componentes React reutilizáveis
- `src/service/`: serviços para integração com o backend
- Arquivos de configuração: `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, entre outros

## Como Contribuir

Contribuições são bem-vindas! Abra uma Issue ou envie um Pull Request com melhorias ou correções. Use o padrão de formatação do projeto.

## Contato

- **Site oficial:** [www.veglotus.com.br](https://www.veglotus.com.br)
- **WhatsApp:** (21) 9 9080-8515

Agradecemos seu interesse no projeto VegLotus! 🌱
