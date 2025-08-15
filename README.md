# Sistema de E-commerce Completo

Um sistema de e-commerce completo com painel administrativo, gerenciamento de produtos, clientes, pedidos e usuários administrativos.

## 🚀 Funcionalidades

### Frontend (React + Vite)
- **Interface do Cliente:**
  - Listagem de produtos com filtros
  - Detalhes do produto
  - Carrinho de compras
  - Checkout completo
  - Confirmação de pedido

- **Painel Administrativo:**
  - Dashboard com estatísticas
  - CRUD completo de produtos
  - CRUD completo de clientes
  - CRUD completo de pedidos
  - CRUD completo de usuários administrativos
  - Gerenciamento de opções (tipos, grupos, idades, etc.)
  - Geração de notas fiscais

### Backend (Node.js + Express + MongoDB)
- **API RESTful completa:**
  - Autenticação de usuários administrativos
  - Gerenciamento de produtos com categorias
  - Gerenciamento de clientes com endereços
  - Gerenciamento de pedidos com status
  - Gerenciamento de usuários com permissões
  - Sistema de opções dinâmicas

## 📋 CRUD Implementado

### 1. **Produtos** ✅
- **Create:** Adicionar novos produtos com categorias
- **Read:** Listar produtos com filtros e detalhes
- **Update:** Editar informações dos produtos
- **Delete:** Excluir produtos do sistema

**Endpoints:**
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Excluir produto

### 2. **Clientes** ✅
- **Create:** Cadastrar novos clientes
- **Read:** Listar clientes com filtros
- **Update:** Editar informações dos clientes
- **Delete:** Desativar clientes (soft delete)

**Endpoints:**
- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/:id` - Buscar cliente por ID
- `GET /api/clientes/buscar` - Buscar por CPF ou email
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Desativar cliente

### 3. **Pedidos** ✅
- **Create:** Criar novos pedidos
- **Read:** Listar pedidos com filtros
- **Update:** Atualizar status e informações
- **Delete:** Excluir pedidos

**Endpoints:**
- `GET /api/pedidos` - Listar pedidos
- `GET /api/pedidos/:id` - Buscar pedido por ID
- `POST /api/pedidos` - Criar pedido
- `PUT /api/pedidos/:id` - Atualizar pedido
- `PUT /api/pedidos/:id/status` - Atualizar status
- `DELETE /api/pedidos/:id` - Excluir pedido

### 4. **Usuários Administrativos** ✅
- **Create:** Criar novos usuários
- **Read:** Listar usuários com permissões
- **Update:** Editar usuários e permissões
- **Delete:** Desativar usuários (soft delete)

**Endpoints:**
- `GET /api/usuarios` - Listar usuários
- `GET /api/usuarios/:id` - Buscar usuário por ID
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Desativar usuário
- `POST /api/auth/login` - Login de usuário

### 5. **Opções Dinâmicas** ✅
- **Tipos, Grupos, Idades, Sexos, Modelos, Marcas**
- CRUD completo para cada categoria
- Sistema de ativação/desativação

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **CSS3** - Estilização

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **CORS** - Cross-origin resource sharing

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd siteforsales
```

### 2. Configure o Backend
```bash
cd api
npm install
```

Crie um arquivo `.env` na pasta `api`:
```env
MONGODB_URI=sua_url_do_mongodb
PORT=3000
```

### 3. Configure o Frontend
```bash
cd meu-ecommerce
npm install
```

Crie um arquivo `.env` na pasta `meu-ecommerce`:
```env
VITE_API_URL=http://localhost:3000
```

### 4. Execute o projeto

**Terminal 1 - Backend:**
```bash
cd api
npm start
```

**Terminal 2 - Frontend:**
```bash
cd meu-ecommerce
npm run dev
```

## 🔐 Acesso ao Sistema

### Usuário Administrativo Padrão
- **Email:** admin@admin.com
- **Senha:** admin123

### Funcionalidades do Admin
- Dashboard com estatísticas
- Gerenciamento completo de produtos
- Gerenciamento completo de clientes
- Gerenciamento completo de pedidos
- Gerenciamento de usuários (se tiver permissão)
- Geração de notas fiscais

## 📱 Interface Responsiva

O sistema é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🔧 Estrutura do Projeto

```
siteforsales/
├── api/                    # Backend
│   ├── index.js           # Servidor Express
│   ├── package.json       # Dependências do backend
│   └── .env              # Variáveis de ambiente
├── meu-ecommerce/         # Frontend
│   ├── src/
│   │   ├── pages/        # Componentes de página
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── App.jsx       # Componente principal
│   │   └── main.jsx      # Ponto de entrada
│   ├── package.json      # Dependências do frontend
│   └── .env             # Variáveis de ambiente
└── README.md            # Documentação
```

## 🚀 Deploy

### Backend (Vercel)
O backend está configurado para deploy na Vercel com o arquivo `vercel.json`.

### Frontend (Vercel/Netlify)
O frontend pode ser deployado em qualquer plataforma que suporte React.

## 📊 Funcionalidades Avançadas

- **Sistema de Permissões:** Controle granular de acesso
- **Filtros Dinâmicos:** Busca e filtros em tempo real
- **Validação de Dados:** Validação tanto no frontend quanto no backend
- **Tratamento de Erros:** Mensagens de erro amigáveis
- **Loading States:** Indicadores de carregamento
- **Responsividade:** Interface adaptável a diferentes dispositivos

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, entre em contato através dos issues do GitHub.