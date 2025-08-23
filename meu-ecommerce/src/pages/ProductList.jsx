import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Produtos de exemplo (simulando dados da API)
const produtosExemplo = [
    {
      _id: '1',
      nome: 'Smartphone Samsung Galaxy S23',
      preco: 2499.99,
      categoria: 'smartphones',
      estoque: 15,
      imagem: 'https://via.placeholder.com/300x300?text=Galaxy+S23',
      descricao: 'Smartphone premium com câmera de alta qualidade'
    },
    {
      _id: '2',
      nome: 'Notebook Dell Inspiron 15',
      preco: 3299.99,
      categoria: 'notebooks',
      estoque: 8,
      imagem: 'https://via.placeholder.com/300x300?text=Dell+Inspiron',
      descricao: 'Notebook para trabalho e estudos'
    },
    {
      _id: '3',
      nome: 'Fone Bluetooth JBL',
      preco: 299.99,
      categoria: 'audio',
      estoque: 25,
      imagem: 'https://via.placeholder.com/300x300?text=Fone+JBL',
      descricao: 'Fone sem fio com qualidade de som superior'
    },
    {
      _id: '4',
      nome: 'Smart TV 55" LG',
      preco: 2199.99,
      categoria: 'tv',
      estoque: 5,
      imagem: 'https://via.placeholder.com/300x300?text=Smart+TV',
      descricao: 'Smart TV 4K com sistema webOS'
    },
    {
      _id: '5',
      nome: 'Mouse Gamer Logitech',
      preco: 199.99,
      categoria: 'perifericos',
      estoque: 30,
      imagem: 'https://via.placeholder.com/300x300?text=Mouse+Gamer',
      descricao: 'Mouse gamer com RGB e alta precisão'
    },
    {
      _id: '6',
      nome: 'Teclado Mecânico RGB',
      preco: 399.99,
      categoria: 'perifericos',
      estoque: 12,
      imagem: 'https://via.placeholder.com/300x300?text=Teclado+RGB',
      descricao: 'Teclado mecânico com iluminação RGB'
    }
  ];

const categorias = [
  { value: 'all', label: 'Todas as Categorias' },
  { value: 'smartphones', label: 'Smartphones' },
  { value: 'notebooks', label: 'Notebooks' },
  { value: 'audio', label: 'Áudio' },
  { value: 'tv', label: 'TVs' },
  { value: 'perifericos', label: 'Periféricos' }
];

const ProductList = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/produtos`);
        const data = await response.json();
        setProdutos(data);
        setFilteredProdutos(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Fallback para dados de exemplo
        setProdutos(produtosExemplo);
        setFilteredProdutos(produtosExemplo);
      } finally {
        setLoading(false);
      }
    };
    
    carregarProdutos();
  }, []);

  useEffect(() => {
    let filtered = produtos;

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(produto => produto.categoria === selectedCategory);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(produto => 
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProdutos(filtered);
  }, [produtos, selectedCategory, searchTerm]);

  const addToCart = (produto) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === produto._id);
    
    if (existingItem) {
      existingItem.quantidade += 1;
    } else {
      cart.push({
        id: produto._id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: 1,
        imagem: produto.imagem
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Disparar evento para atualizar contador do carrinho
    window.dispatchEvent(new Event('storage'));
    
    alert('Produto adicionado ao carrinho!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="produtos-page">
      <div className="produtos-header">
        <h1>Nossos Produtos</h1>
        <p>Encontre os melhores produtos com os melhores preços</p>
      </div>

      <div className="produtos-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filter">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categorias.map(categoria => (
              <option key={categoria.value} value={categoria.value}>
                {categoria.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="produtos-list">
        {filteredProdutos.length === 0 ? (
          <div className="no-products">
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          filteredProdutos.map(produto => (
            <div key={produto._id} className="produto-row">
              <div className="produto-image-small">
                <img src={produto.imagem} alt="" />
              </div>
              
              <div className="produto-nome-col">
                <h3>{produto.nome}</h3>
              </div>
              
              <div className="produto-preco-col">
                <span className="preco">R$ {produto.preco.toFixed(2)}</span>
              </div>
              
              <div className="produto-quantidade-col">
                <span className="quantidade">{produto.estoque} unidades</span>
              </div>
              
              <div className="produto-actions-col">
                <Link 
                  to={`/produtos/editar/${produto._id}`} 
                  className="btn btn-edit"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
