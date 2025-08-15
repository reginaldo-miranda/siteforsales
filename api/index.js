const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Conectado ao MongoDB');
    await criarDadosIniciais();
  })
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definição dos Schemas para opções dinâmicas
const tipoSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  ativo: { type: Boolean, default: true }
});

const grupoSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  ativo: { type: Boolean, default: true }
});

const idadeSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  ativo: { type: Boolean, default: true }
});

const sexoSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  ativo: { type: Boolean, default: true }
});

const modeloSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  ativo: { type: Boolean, default: true }
});

const marcaSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  ativo: { type: Boolean, default: true }
});

// Definição do Schema de Produto atualizado
const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true },
  imagem: { type: String },
  estoque: { type: Number, default: 0 },
  tipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Tipo' },
  grupo: { type: mongoose.Schema.Types.ObjectId, ref: 'Grupo' },
  idade: { type: mongoose.Schema.Types.ObjectId, ref: 'Idade' },
  sexo: { type: mongoose.Schema.Types.ObjectId, ref: 'Sexo' },
  modelo: { type: mongoose.Schema.Types.ObjectId, ref: 'Modelo' },
  marca: { type: mongoose.Schema.Types.ObjectId, ref: 'Marca' }
});

// Modelos
const Tipo = mongoose.model('Tipo', tipoSchema);
const Grupo = mongoose.model('Grupo', grupoSchema);
const Idade = mongoose.model('Idade', idadeSchema);
const Sexo = mongoose.model('Sexo', sexoSchema);
const Modelo = mongoose.model('Modelo', modeloSchema);
const Marca = mongoose.model('Marca', marcaSchema);
const Produto = mongoose.model('Produto', produtoSchema);

// Schema para Cliente
const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cpf: { type: String, required: true, unique: true },
  telefone: { type: String, required: true },
  dataNascimento: { type: Date },
  pontosFidelidade: { type: Number, default: 0 },
  enderecos: [{
    tipo: { type: String, enum: ['residencial', 'comercial', 'outro'], default: 'residencial' },
    cep: { type: String, required: true },
    logradouro: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: { type: String },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    principal: { type: Boolean, default: false }
  }],
  ativo: { type: Boolean, default: true },
  dataCadastro: { type: Date, default: Date.now }
});

// Schema para Usuário Administrativo
const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo: { type: String, enum: ['admin', 'vendedor', 'estoque'], required: true },
  permissoes: {
    produtos: { type: Boolean, default: false },
    clientes: { type: Boolean, default: false },
    pedidos: { type: Boolean, default: false },
    usuarios: { type: Boolean, default: false },
    relatorios: { type: Boolean, default: false }
  },
  ativo: { type: Boolean, default: true },
  dataCadastro: { type: Date, default: Date.now }
});

// Schema para Pedido
const pedidoSchema = new mongoose.Schema({
  numero: { type: String, unique: true, required: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  itens: [{
    produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
    quantidade: { type: Number, required: true },
    precoUnitario: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }],
  enderecoEntrega: {
    cep: { type: String, required: true },
    logradouro: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: { type: String },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true }
  },
  formaPagamento: {
    tipo: { type: String, enum: ['cartao_credito', 'cartao_debito', 'pix', 'boleto'], required: true },
    parcelas: { type: Number, default: 1 },
    valorParcela: { type: Number }
  },
  subtotal: { type: Number, required: true },
  frete: { type: Number, default: 0 },
  desconto: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pendente', 'confirmado', 'preparando', 'enviado', 'entregue', 'cancelado'], 
    default: 'pendente' 
  },
  notaFiscal: {
    numero: { type: String },
    chave: { type: String },
    xml: { type: String },
    pdf: { type: String },
    dataEmissao: { type: Date }
  },
  dataPedido: { type: Date, default: Date.now },
  dataAtualizacao: { type: Date, default: Date.now }
});

// Modelos adicionais
const Cliente = mongoose.model('Cliente', clienteSchema);
const Usuario = mongoose.model('Usuario', usuarioSchema);
const Pedido = mongoose.model('Pedido', pedidoSchema);

// Função para criar dados iniciais das opções
async function criarOpcoes() {
  try {
    // Criar tipos se não existirem
    const tiposCount = await Tipo.countDocuments();
    if (tiposCount === 0) {
      await Tipo.insertMany([
        { nome: 'Eletrônicos' },
        { nome: 'Roupas' },
        { nome: 'Calçados' },
        { nome: 'Acessórios' },
        { nome: 'Casa e Jardim' }
      ]);
    }

    // Criar grupos se não existirem
    const gruposCount = await Grupo.countDocuments();
    if (gruposCount === 0) {
      await Grupo.insertMany([
        { nome: 'Smartphones' },
        { nome: 'Notebooks' },
        { nome: 'Camisetas' },
        { nome: 'Tênis' },
        { nome: 'Relógios' }
      ]);
    }

    // Criar idades se não existirem
    const idadesCount = await Idade.countDocuments();
    if (idadesCount === 0) {
      await Idade.insertMany([
        { nome: 'Infantil' },
        { nome: 'Juvenil' },
        { nome: 'Adulto' },
        { nome: 'Idoso' }
      ]);
    }

    // Criar sexos se não existirem
    const sexosCount = await Sexo.countDocuments();
    if (sexosCount === 0) {
      await Sexo.insertMany([
        { nome: 'Masculino' },
        { nome: 'Feminino' },
        { nome: 'Unissex' }
      ]);
    }

    // Criar modelos se não existirem
    const modelosCount = await Modelo.countDocuments();
    if (modelosCount === 0) {
      await Modelo.insertMany([
        { nome: 'Galaxy S23' },
        { nome: 'Inspiron 15' },
        { nome: 'Air Max' },
        { nome: 'Classic' },
        { nome: 'Sport' }
      ]);
    }

    // Criar marcas se não existirem
    const marcasCount = await Marca.countDocuments();
    if (marcasCount === 0) {
      await Marca.insertMany([
        { nome: 'Samsung' },
        { nome: 'Dell' },
        { nome: 'Nike' },
        { nome: 'Adidas' },
        { nome: 'Apple' }
      ]);
    }
  } catch (error) {
    console.error('Erro ao criar opções iniciais:', error);
  }
}

// Função para criar dados iniciais
async function criarDadosIniciais() {
  try {
    await criarOpcoes();
    
    // Criar usuário administrador padrão
    const adminCount = await Usuario.countDocuments({ tipo: 'admin' });
    if (adminCount === 0) {
      const adminUser = new Usuario({
        nome: 'Administrador',
        email: 'admin@ecommerce.com',
        senha: 'admin123',
        tipo: 'admin',
        permissoes: {
          produtos: true,
          clientes: true,
          pedidos: true,
          usuarios: true,
          relatorios: true
        }
      });
      await adminUser.save();
      console.log('Usuário administrador criado: admin@ecommerce.com / admin123');
    }
    
    const count = await Produto.countDocuments();
    if (count === 0) {
      const produtosIniciais = [
        {
          nome: "Smartphone Samsung Galaxy",
          descricao: "Smartphone com tela de 6.1 polegadas, 128GB de armazenamento",
          preco: 899.99,
          imagem: "https://br.freepik.com/fotos-vetores-gratis/smartphone",
          estoque: 15
        },
        {
          nome: "Notebook Dell Inspiron",
          descricao: "Notebook com processador Intel i5, 8GB RAM, 256GB SSD",
          preco: 2499.99,
          imagem: "https://www.dell.com/pt-br/shop/notebooks-dell/notebook-inspiron-15/spd/inspiron-15-3520-laptop",
          estoque: 8
        },
        {
          nome: "Fone de Ouvido Bluetooth",
          descricao: "Fone de ouvido sem fio com cancelamento de ruído",
          preco: 199.99,
          imagem: "https://via.placeholder.com/300x300?text=Fone+Bluetooth",
          estoque: 25
        },
        {
          nome: "Smart TV 55 polegadas",
          descricao: "Smart TV 4K com sistema Android TV integrado",
          preco: 1899.99,
          imagem: "https://via.placeholder.com/300x300?text=Smart+TV",
          estoque: 5
        },
        {
          nome: "Mouse Gamer RGB",
          descricao: "Mouse gamer com iluminação RGB e 7 botões programáveis",
          preco: 89.99,
          imagem: "https://via.placeholder.com/300x300?text=Mouse+Gamer",
          estoque: 30
        }
      ];

      await Produto.insertMany(produtosIniciais);
      console.log('Dados iniciais criados com sucesso!');
    } else {
      console.log('Dados já existem no banco.');
    }
  } catch (error) {
    console.error('Erro ao criar dados iniciais:', error);
  }
}

// Rotas para Tipos
app.get('/api/tipos', async (req, res) => {
  try {
    const tipos = await Tipo.find({ ativo: true });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/tipos', async (req, res) => {
  try {
    const novoTipo = new Tipo(req.body);
    const tipoSalvo = await novoTipo.save();
    res.status(201).json(tipoSalvo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/tipos/:id', async (req, res) => {
  try {
    const tipo = await Tipo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tipo) return res.status(404).json({ message: 'Tipo não encontrado' });
    res.json(tipo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/tipos/:id', async (req, res) => {
  try {
    const tipo = await Tipo.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true });
    if (!tipo) return res.status(404).json({ message: 'Tipo não encontrado' });
    res.json({ message: 'Tipo desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rotas para Grupos
app.get('/api/grupos', async (req, res) => {
  try {
    const grupos = await Grupo.find({ ativo: true });
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/grupos', async (req, res) => {
  try {
    const novoGrupo = new Grupo(req.body);
    const grupoSalvo = await novoGrupo.save();
    res.status(201).json(grupoSalvo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/grupos/:id', async (req, res) => {
  try {
    const grupo = await Grupo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!grupo) return res.status(404).json({ message: 'Grupo não encontrado' });
    res.json(grupo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/grupos/:id', async (req, res) => {
  try {
    const grupo = await Grupo.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true });
    if (!grupo) return res.status(404).json({ message: 'Grupo não encontrado' });
    res.json({ message: 'Grupo desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rotas para Idades
app.get('/api/idades', async (req, res) => {
  try {
    const idades = await Idade.find({ ativo: true });
    res.json(idades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/idades', async (req, res) => {
  try {
    const novaIdade = new Idade(req.body);
    const idadeSalva = await novaIdade.save();
    res.status(201).json(idadeSalva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/idades/:id', async (req, res) => {
  try {
    const idade = await Idade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!idade) return res.status(404).json({ message: 'Idade não encontrada' });
    res.json(idade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/idades/:id', async (req, res) => {
  try {
    const idade = await Idade.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true });
    if (!idade) return res.status(404).json({ message: 'Idade não encontrada' });
    res.json({ message: 'Idade desativada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rotas para Sexos
app.get('/api/sexos', async (req, res) => {
  try {
    const sexos = await Sexo.find({ ativo: true });
    res.json(sexos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/sexos', async (req, res) => {
  try {
    const novoSexo = new Sexo(req.body);
    const sexoSalvo = await novoSexo.save();
    res.status(201).json(sexoSalvo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/sexos/:id', async (req, res) => {
  try {
    const sexo = await Sexo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sexo) return res.status(404).json({ message: 'Sexo não encontrado' });
    res.json(sexo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/sexos/:id', async (req, res) => {
  try {
    const sexo = await Sexo.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true });
    if (!sexo) return res.status(404).json({ message: 'Sexo não encontrado' });
    res.json({ message: 'Sexo desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rotas para Modelos
app.get('/api/modelos', async (req, res) => {
  try {
    const modelos = await Modelo.find({ ativo: true });
    res.json(modelos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/modelos', async (req, res) => {
  try {
    const novoModelo = new Modelo(req.body);
    const modeloSalvo = await novoModelo.save();
    res.status(201).json(modeloSalvo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/modelos/:id', async (req, res) => {
  try {
    const modelo = await Modelo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!modelo) return res.status(404).json({ message: 'Modelo não encontrado' });
    res.json(modelo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/modelos/:id', async (req, res) => {
  try {
    const modelo = await Modelo.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true });
    if (!modelo) return res.status(404).json({ message: 'Modelo não encontrado' });
    res.json({ message: 'Modelo desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rotas para Marcas
app.get('/api/marcas', async (req, res) => {
  try {
    const marcas = await Marca.find({ ativo: true });
    res.json(marcas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/marcas', async (req, res) => {
  try {
    const novaMarca = new Marca(req.body);
    const marcaSalva = await novaMarca.save();
    res.status(201).json(marcaSalva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/marcas/:id', async (req, res) => {
  try {
    const marca = await Marca.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!marca) return res.status(404).json({ message: 'Marca não encontrada' });
    res.json(marca);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/marcas/:id', async (req, res) => {
  try {
    const marca = await Marca.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true });
    if (!marca) return res.status(404).json({ message: 'Marca não encontrada' });
    res.json({ message: 'Marca desativada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rotas para Produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const { tipo, grupo, idade, sexo, modelo, marca } = req.query;
    const filtros = {};
    
    if (tipo) filtros.tipo = tipo;
    if (grupo) filtros.grupo = grupo;
    if (idade) filtros.idade = idade;
    if (sexo) filtros.sexo = sexo;
    if (modelo) filtros.modelo = modelo;
    if (marca) filtros.marca = marca;
    
    const produtos = await Produto.find(filtros)
      .populate('tipo')
      .populate('grupo')
      .populate('idade')
      .populate('sexo')
      .populate('modelo')
      .populate('marca');
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para buscar todas as opções de uma vez
app.get('/api/opcoes', async (req, res) => {
  try {
    const [tipos, grupos, idades, sexos, modelos, marcas] = await Promise.all([
      Tipo.find({ ativo: true }),
      Grupo.find({ ativo: true }),
      Idade.find({ ativo: true }),
      Sexo.find({ ativo: true }),
      Modelo.find({ ativo: true }),
      Marca.find({ ativo: true })
    ]);
    
    res.json({
      tipos,
      grupos,
      idades,
      sexos,
      modelos,
      marcas
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id)
      .populate('tipo')
      .populate('grupo')
      .populate('idade')
      .populate('sexo')
      .populate('modelo')
      .populate('marca');
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(produto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/produtos', async (req, res) => {
  try {
    const novoProduto = new Produto(req.body);
    const produtoSalvo = await novoProduto.save();
    res.status(201).json(produtoSalvo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(produto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/produtos/:id', async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ROTAS DE AUTENTICAÇÃO =====

// Login de usuário administrativo
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email, ativo: true });
    
    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    res.json({
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      permissoes: usuario.permissoes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ROTAS DE CLIENTES =====

// Buscar cliente por CPF ou email
app.get('/api/clientes/buscar', async (req, res) => {
  try {
    const { cpf, email } = req.query;
    let cliente;
    
    if (cpf) {
      cliente = await Cliente.findOne({ cpf, ativo: true });
    } else if (email) {
      cliente = await Cliente.findOne({ email, ativo: true });
    }
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar novo cliente
app.post('/api/clientes', async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar todos os clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find({ ativo: true });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar cliente por ID
app.get('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar cliente
app.put('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Excluir cliente (desativar)
app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true });
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
    res.json({ message: 'Cliente desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ROTAS DE PEDIDOS =====

// Criar novo pedido
app.post('/api/pedidos', async (req, res) => {
  try {
    // Gerar número do pedido
    const ultimoPedido = await Pedido.findOne().sort({ dataPedido: -1 });
    const numeroSequencial = ultimoPedido ? parseInt(ultimoPedido.numero) + 1 : 1;
    const numeroPedido = numeroSequencial.toString().padStart(6, '0');
    
    const pedidoData = {
      ...req.body,
      numero: numeroPedido
    };
    
    const pedido = new Pedido(pedidoData);
    await pedido.save();
    
    // Popular os dados do cliente e produtos
    await pedido.populate('cliente');
    await pedido.populate('itens.produto');
    
    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const { status, cliente } = req.query;
    let filtro = {};
    
    if (status) filtro.status = status;
    if (cliente) filtro.cliente = cliente;
    
    const pedidos = await Pedido.find(filtro)
      .populate('cliente')
      .populate('itens.produto')
      .sort({ dataPedido: -1 });
    
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar pedido por ID
app.get('/api/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente')
      .populate('itens.produto');
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar status do pedido
app.put('/api/pedidos/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { status, dataAtualizacao: new Date() },
      { new: true }
    ).populate('cliente').populate('itens.produto');
    
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar pedido completo
app.put('/api/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { ...req.body, dataAtualizacao: new Date() },
      { new: true }
    ).populate('cliente').populate('itens.produto');
    
    if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Excluir pedido
app.delete('/api/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });
    res.json({ message: 'Pedido excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ROTAS DE USUÁRIOS ADMINISTRATIVOS =====

// Listar usuários (apenas para admins)
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find({ ativo: true }).select('-senha');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar usuário por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-senha');
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar novo usuário (apenas para admins)
app.post('/api/usuarios', async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    
    // Retornar sem a senha
    const { senha, ...usuarioSemSenha } = usuario.toObject();
    res.status(201).json(usuarioSemSenha);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar usuário
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-senha');
    
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Desativar usuário
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true });
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json({ message: 'Usuário desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});