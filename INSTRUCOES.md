# 📋 Instruções de Uso do Sistema

## 🚀 Como Acessar o Sistema

### 1. **Acessar o Frontend**
- Abra o navegador e acesse: `http://localhost:5173`
- Para acessar o painel administrativo, clique em "Login Admin" ou acesse: `http://localhost:5173/login-admin`

### 2. **Credenciais de Acesso**
- **Email:** admin@ecommerce.com
- **Senha:** admin123

## 📊 Funcionalidades Disponíveis

### **Dashboard Administrativo**
- Visão geral com estatísticas
- Acesso rápido a todas as funcionalidades
- Pedidos recentes

### **Gerenciar Produtos** ✅
- **Visualizar:** Lista todos os produtos com filtros
- **Adicionar:** Botão "Adicionar Produto" → Formulário completo
- **Editar:** Botão "Editar" em cada produto
- **Excluir:** Botão "Excluir" com confirmação

### **Gerenciar Clientes** ✅
- **Visualizar:** Lista todos os clientes com filtros
- **Adicionar:** Botão "Adicionar Cliente" → Formulário completo
- **Editar:** Botão "Editar" em cada cliente
- **Excluir:** Botão "Excluir" (desativa o cliente)

### **Gerenciar Pedidos** ✅
- **Visualizar:** Lista todos os pedidos com filtros
- **Adicionar:** Botão "Novo Pedido" → Formulário completo
- **Editar:** Botão "Editar" em cada pedido
- **Atualizar Status:** Dropdown para mudar status
- **Excluir:** Botão "Excluir" com confirmação

### **Gerenciar Usuários** ✅
- **Visualizar:** Lista todos os usuários administrativos
- **Adicionar:** Botão "Adicionar Usuário" → Formulário com permissões
- **Editar:** Botão "Editar" em cada usuário
- **Excluir:** Botão "Excluir" (desativa o usuário)

### **Gerenciar Opções** ✅
- **Tipos:** Categorias de produtos
- **Grupos:** Subcategorias
- **Idades:** Faixas etárias
- **Sexos:** Gêneros
- **Modelos:** Modelos de produtos
- **Marcas:** Marcas de produtos

## 🔧 Como Usar

### **1. Cadastrar um Produto**
1. Acesse "Gerenciar Produtos"
2. Clique em "Adicionar Produto"
3. Preencha todos os campos obrigatórios
4. Selecione as categorias (tipo, grupo, etc.)
5. Clique em "Cadastrar"

### **2. Cadastrar um Cliente**
1. Acesse "Gerenciar Clientes"
2. Clique em "Adicionar Cliente"
3. Preencha dados pessoais
4. Preencha endereço
5. Clique em "Cadastrar"

### **3. Criar um Pedido**
1. Acesse "Gerenciar Pedidos"
2. Clique em "Novo Pedido"
3. Selecione o cliente
4. Adicione produtos e quantidades
5. Preencha endereço de entrega
6. Configure forma de pagamento
7. Clique em "Criar Pedido"

### **4. Configurar Opções**
1. Acesse "Gerenciar Opções"
2. Selecione a categoria (tipos, grupos, etc.)
3. Digite o nome da nova opção
4. Clique em "Adicionar"

## 🎯 Navegação

### **Botões de Navegação**
- **"Voltar ao Dashboard"** - Retorna ao painel principal
- **"Voltar aos Produtos"** - Retorna à lista de produtos
- **"Voltar aos Clientes"** - Retorna à lista de clientes
- **"Voltar aos Pedidos"** - Retorna à lista de pedidos

### **Ações Rápidas**
- **Dashboard** - Acesso rápido a todas as funcionalidades
- **Filtros** - Busca e filtros em tempo real
- **Botões de Ação** - Editar, Excluir, Visualizar

## 📱 Interface Responsiva

O sistema funciona perfeitamente em:
- **Desktop** - Interface completa
- **Tablet** - Layout adaptado
- **Mobile** - Interface otimizada

## ⚠️ Dicas Importantes

1. **Sempre use os botões de navegação** para voltar às listas
2. **Confirme antes de excluir** - Ações de exclusão pedem confirmação
3. **Preencha todos os campos obrigatórios** - Marcados com *
4. **Use os filtros** para encontrar itens rapidamente
5. **Verifique as permissões** - Algumas funcionalidades dependem do tipo de usuário

## 🔍 Solução de Problemas

### **Não consegue fazer login?**
- Verifique se o backend está rodando na porta 3000
- Use as credenciais: admin@ecommerce.com / admin123

### **Formulários não salvam?**
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme se o backend está conectado ao MongoDB

### **Página não carrega?**
- Verifique se o frontend está rodando na porta 5173
- Recarregue a página (F5)

## 📞 Suporte

Se encontrar problemas:
1. Verifique se ambos os servidores estão rodando
2. Confirme as credenciais de acesso
3. Verifique a conexão com o banco de dados
4. Consulte o console do navegador para erros

