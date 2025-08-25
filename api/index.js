const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
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
    
    // Remover índice antigo do campo 'numero' se existir
    try {
      await mongoose.connection.db.collection('pedidos').dropIndex('numero_1');
      console.log('Índice antigo "numero_1" removido com sucesso');
    } catch (error) {
      if (error.code === 27) {
        console.log('Índice "numero_1" não existe (já foi removido)');
      } else {
        console.log('Erro ao remover índice:', error.message);
      }
    }
    
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

// Schema de Fornecedor
const fornecedorSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  razaoSocial: { type: String, required: true },
  rua: { type: String, required: true },
  bairro: { type: String, required: true },
  cep: { type: String, required: true },
  cidade: { type: String, required: true },
  estado: { type: String, required: true },
  cnpj: { type: String, required: true, unique: true },
  inscricao: { type: String },
  telefone1: { type: String, required: true },
  telefone2: { type: String },
  atividade: { type: String, required: true },
  atendente: { type: String, required: true },
  ativo: { type: Boolean, default: true },
  dataCriacao: { type: Date, default: Date.now }
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
const Fornecedor = mongoose.model('Fornecedor', fornecedorSchema);
const Produto = mongoose.model('Produto', produtoSchema);

// Schema de Pedido
const pedidoSchema = new mongoose.Schema({
  numeroPedido: { type: String, required: true, unique: true },
  dadosCliente: {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone1: { type: String, required: true },
    telefone2: { type: String },
    cpfCnpj: { type: String, required: true },
    rgInscricao: { type: String, required: true },
    tipoDocumento: { type: String, required: true }
  },
  dadosEntrega: {
    cep: { type: String, required: true },
    endereco: { type: String, required: true },
    numeroEndereco: { type: String, required: true }, // Renomeado para evitar conflito
    complemento: { type: String },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    codigoIbge: { type: String }
  },
  itens: [{
    produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    quantidade: { type: Number, required: true }
  }],
  formaPagamento: { type: String, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'pendente' },
  dataCriacao: { type: Date, default: Date.now },
  whatsappEnviado: { type: Boolean, default: false }
});

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
    
    const count = await Produto.countDocuments();
    if (count === 0) {
      const produtosIniciais = [
        {
          nome: "Smartphone Samsung Galaxy",
          descricao: "Smartphone com tela de 6.1 polegadas, 128GB de armazenamento",
          preco: 899.99,
          imagem: "https://via.placeholder.com/300x300?text=Samsung+Galaxy",
          estoque: 15
        },
        {
          nome: "Notebook Dell Inspiron",
          descricao: "Notebook com processador Intel i5, 8GB RAM, 256GB SSD",
          preco: 2499.99,
          imagem: "https://via.placeholder.com/300x300?text=Dell+Inspiron",
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

// Rotas para Fornecedores
app.get('/api/fornecedores', async (req, res) => {
  try {
    const fornecedores = await Fornecedor.find({ ativo: true }).sort({ razaoSocial: 1 });
    res.json(fornecedores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/fornecedores', async (req, res) => {
  try {
    const fornecedor = new Fornecedor(req.body);
    const fornecedorSalvo = await fornecedor.save();
    res.status(201).json(fornecedorSalvo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/fornecedores/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findById(req.params.id);
    if (!fornecedor) return res.status(404).json({ message: 'Fornecedor não encontrado' });
    res.json(fornecedor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/fornecedores/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fornecedor) return res.status(404).json({ message: 'Fornecedor não encontrado' });
    res.json(fornecedor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/fornecedores/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true });
    if (!fornecedor) return res.status(404).json({ message: 'Fornecedor não encontrado' });
    res.json({ message: 'Fornecedor desativado com sucesso' });
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
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Função para gerar número do pedido
function gerarNumeroPedido() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PED${timestamp.slice(-6)}${random}`;
}

// Configurar transporter do Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para enviar email de confirmação
async function enviarEmailConfirmacao(pedido) {
  try {
    // Verificar se as credenciais de email estão configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️ Credenciais de email não configuradas. Simulando envio...');
      console.log('✅ Email de confirmação simulado com sucesso!');
      return true;
    }

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmação de Pedido</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .order-details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-weight: bold; font-size: 1.2em; color: #007bff; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pedido Confirmado!</h1>
            <p>Número do Pedido: <strong>${pedido.numeroPedido}</strong></p>
          </div>
          
          <div class="content">
            <h2>Olá, ${pedido.dadosCliente.nome}!</h2>
            <p>Seu pedido foi recebido e está sendo processado. Abaixo estão os detalhes:</p>
            
            <div class="order-details">
              <h3>📍 Dados de Entrega</h3>
              <p><strong>Endereço:</strong> ${pedido.dadosEntrega.endereco}, ${pedido.dadosEntrega.numeroEndereco}</p>
              <p><strong>Bairro:</strong> ${pedido.dadosEntrega.bairro}</p>
              <p><strong>Cidade:</strong> ${pedido.dadosEntrega.cidade} - ${pedido.dadosEntrega.estado}</p>
              <p><strong>CEP:</strong> ${pedido.dadosEntrega.cep}</p>
            </div>
            
            <div class="order-details">
              <h3>🛍️ Itens do Pedido</h3>
              ${pedido.itens.map(item => `
                <div class="item">
                  <strong>${item.nome}</strong><br>
                  Quantidade: ${item.quantidade} | Preço unitário: R$ ${item.preco.toFixed(2)}
                </div>
              `).join('')}
            </div>
            
            <div class="order-details">
              <p><strong>💳 Forma de Pagamento:</strong> ${pedido.formaPagamento}</p>
              <p class="total">💰 Total: R$ ${pedido.total.toFixed(2)}</p>
              <p><strong>📅 Data do Pedido:</strong> ${new Date(pedido.dataCriacao).toLocaleString('pt-BR')}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Obrigado por escolher nossa loja!</p>
            <p>Em caso de dúvidas, entre em contato conosco.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: pedido.dadosCliente.email,
      subject: `Confirmação de Pedido #${pedido.numeroPedido} - ${process.env.EMAIL_FROM_NAME}`,
      html: htmlTemplate
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmação enviado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email de confirmação:', error);
    return false;
  }
}

// Função para enviar notificação via WhatsApp
async function enviarNotificacaoWhatsApp(pedido) {
  try {
    const mensagem = `🛒 *Novo Pedido Recebido!*\n\n` +
      `📋 *Pedido:* ${pedido.numeroPedido}\n` +
      `👤 *Cliente:* ${pedido.dadosCliente.nome}\n` +
      `📱 *Telefone:* ${pedido.dadosCliente.telefone1}\n` +
      `📧 *Email:* ${pedido.dadosCliente.email}\n` +
      `💰 *Total:* R$ ${pedido.total.toFixed(2)}\n` +
      `🏠 *Endereço:* ${pedido.dadosEntrega.endereco}, ${pedido.dadosEntrega.numeroEndereco} - ${pedido.dadosEntrega.bairro}, ${pedido.dadosEntrega.cidade}/${pedido.dadosEntrega.estado}\n` +
      `💳 *Pagamento:* ${pedido.formaPagamento}\n\n` +
      `📦 *Itens do Pedido:*\n` +
      pedido.itens.map(item => 
        `• ${item.nome} - Qtd: ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}`
      ).join('\n');
    
    console.log('Mensagem WhatsApp preparada:', mensagem);
    
    // Verificar se as credenciais do Twilio estão configuradas
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
        process.env.TWILIO_ACCOUNT_SID !== 'your_twilio_account_sid_here') {
      
      // Integração real com Twilio WhatsApp
      const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
        to: process.env.TWILIO_WHATSAPP_TO || 'whatsapp:+5511999999999',
        body: mensagem
      });
      
      console.log('✅ Notificação WhatsApp enviada via Twilio!');
    } else {
      // Modo de desenvolvimento - apenas simular o envio
      console.log('⚠️ Credenciais do Twilio não configuradas. Simulando envio...');
      console.log('✅ Notificação WhatsApp simulada com sucesso!');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar notificação WhatsApp:', error);
    return false;
  }
}

// Endpoint para criar pedido
app.post('/api/pedidos', async (req, res) => {
  try {
    const { dadosCliente, dadosEntrega, itens, formaPagamento, total } = req.body;
    
    // Gerar número do pedido
    const numeroPedido = gerarNumeroPedido();
    
    // Criar o pedido
    const novoPedido = new Pedido({
      numeroPedido,
      dadosCliente,
      dadosEntrega,
      itens,
      formaPagamento,
      total
    });
    
    // Salvar o pedido
    const pedidoSalvo = await novoPedido.save();
    
    // Enviar email de confirmação para o cliente
    const emailEnviado = await enviarEmailConfirmacao(pedidoSalvo);
    
    // Enviar notificação via WhatsApp
    const whatsappEnviado = await enviarNotificacaoWhatsApp(pedidoSalvo);
    
    // Atualizar status do WhatsApp
    if (whatsappEnviado) {
      pedidoSalvo.whatsappEnviado = true;
      await pedidoSalvo.save();
    }
    
    res.status(201).json({
      success: true,
      pedido: pedidoSalvo,
      emailEnviado,
      whatsappEnviado
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar pedido',
      error: error.message 
    });
  }
});

// Endpoint para listar pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ dataCriacao: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint para buscar pedido por ID
app.get('/api/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});