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
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});