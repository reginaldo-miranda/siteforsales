# API do E-commerce

Esta é a API backend para o e-commerce, construída com Node.js, Express e MongoDB.

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure o arquivo `.env` com suas credenciais do MongoDB:
   ```
   MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
   PORT=3000
   ```

3. Inicie o servidor:
   ```
   npm run dev
   ```

## Endpoints

### Produtos

- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Obter detalhes de um produto
- `POST /api/produtos` - Criar um novo produto
- `PUT /api/produtos/:id` - Atualizar um produto
- `DELETE /api/produtos/:id` - Remover um produto

## Modelo de Produto

```json
{
  "nome": "Nome do Produto",
  "descricao": "Descrição detalhada do produto",
  "preco": 99.90,
  "imagem": "url_da_imagem.jpg",
  "estoque": 10
}
```

## Implantação na Vercel

Para implantar esta API na Vercel:

1. Crie um arquivo `vercel.json` na raiz do projeto com o seguinte conteúdo:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "index.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "/index.js" }
     ]
   }
   ```

2. Instale a CLI da Vercel e faça login:
   ```
   npm i -g vercel
   vercel login
   ```

3. Implante o projeto:
   ```
   vercel
   ```

4. Configure as variáveis de ambiente na Vercel através do dashboard ou usando o comando:
   ```
   vercel env add MONGODB_URI
   ```

   .env  
MONGODB_URI="mongodb+srv://reginaldo:novasenha@cluster0.5pluavy.mongodb.net/siteeco?retryWrites=true&w=majority&appName=Cluster0"