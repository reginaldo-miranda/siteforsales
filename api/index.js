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

// Definição do Schema de Produto
const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true },
  imagem: { type: String },
  estoque: { type: Number, default: 0 }
});

const Produto = mongoose.model('Produto', produtoSchema);

// Função para criar dados iniciais
async function criarDadosIniciais() {
  try {
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

// Rotas
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
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