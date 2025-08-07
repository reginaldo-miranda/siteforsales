# Site para Vendas (E-commerce)

Um projeto completo de e-commerce com frontend em React e backend com Node.js, Express e MongoDB, pronto para ser hospedado na Vercel.

## Estrutura do Projeto

Este repositório contém duas partes principais:

1. **Frontend (meu-ecommerce)**: Aplicação React que fornece a interface do usuário para o e-commerce.
2. **Backend (api)**: API RESTful construída com Node.js, Express e MongoDB para gerenciar produtos e pedidos.

## Tecnologias Utilizadas

### Frontend
- React
- React Router
- Axios
- CSS puro para estilização

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Dotenv para variáveis de ambiente
- CORS para comunicação entre frontend e backend

## Como Iniciar

### Configuração do Backend

1. Entre na pasta da API:
   ```
   cd api
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o arquivo `.env` com suas credenciais do MongoDB:
   ```
   MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
   PORT=3000
   ```

4. Inicie o servidor:
   ```
   npm run dev
   ```

### Configuração do Frontend

1. Entre na pasta do frontend:
   ```
   cd meu-ecommerce
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o arquivo `.env` para apontar para a API:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

## Funcionalidades

- Listagem de produtos
- Visualização detalhada de produtos
- Carrinho de compras com persistência local
- Gerenciamento de estoque
- Interface responsiva

## Implantação na Vercel

### Backend

1. Faça login na Vercel e importe o projeto da API
2. Configure as variáveis de ambiente:
   - `MONGODB_URI`: URI de conexão com o MongoDB Atlas

### Frontend

1. Faça login na Vercel e importe o projeto do frontend
2. Configure as variáveis de ambiente:
   - `VITE_API_URL`: URL da sua API implantada na Vercel

## Licença

MIT

senha mongo acvZDitEaKW4AEyT