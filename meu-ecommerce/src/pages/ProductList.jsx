import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [produtos, setProdutos] = useState([]);
  const [opcoes, setOpcoes] = useState({
    tipos: [],
    grupos: [],
    idades: [],
    sexos: [],
    modelos: [],
    marcas: []
  });
  const [filtros, setFiltros] = useState({
    tipo: '',
    grupo: '',
    idade: '',
    sexo: '',
    modelo: '',
    marca: ''
  });
  const [loading, setLoading] = useState(true);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  useEffect(() => {
<<<<<<< HEAD
    // Simular carregamento
    setTimeout(() => {
      setProdutos(produtosExemplo);
      setFilteredProdutos(produtosExemplo);
      setLoading(false);
    }, 1000);
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

      <div className="produtos-grid">
        {filteredProdutos.length === 0 ? (
          <div className="no-products">
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          filteredProdutos.map(produto => (
            <div key={produto._id} className="produto-card">
              <div className="produto-image">
                <img src={produto.imagem} alt={produto.nome} />
                {produto.estoque <= 5 && produto.estoque > 0 && (
                  <span className="low-stock-badge">Últimas unidades!</span>
                )}
                {produto.estoque === 0 && (
                  <span className="out-of-stock-badge">Esgotado</span>
                )}
              </div>
              
              <div className="produto-info">
                <h3 className="produto-nome">{produto.nome}</h3>
                <p className="produto-descricao">{produto.descricao}</p>
                <div className="produto-preco">
                  <span className="preco-atual">R$ {produto.preco.toFixed(2)}</span>
                </div>
                
                <div className="produto-estoque">
                  {produto.estoque > 0 ? (
                    <span className="in-stock">✓ Em estoque ({produto.estoque} unidades)</span>
                  ) : (
                    <span className="out-of-stock">✗ Fora de estoque</span>
                  )}
                </div>
                
                <div className="produto-actions">
                  <Link 
                    to={`/produtos/${produto._id}`} 
                    className="btn btn-secondary"
                  >
                    Ver Detalhes
                  </Link>
                  
                  {produto.estoque > 0 && (
                    <button 
                      onClick={() => addToCart(produto)}
                      className="btn btn-primary"
                    >
                      Adicionar ao Carrinho
                    </button>
                  )}
                </div>
=======
    carregarOpcoes();
    carregarProdutos();
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [filtros]);

  const carregarOpcoes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/opcoes`);
      setOpcoes(response.data);
    } catch (err) {
      console.error('Erro ao carregar opções:', err);
    }
  };

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/produtos?${params}`);
      setProdutos(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Não foi possível carregar os produtos. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      tipo: '',
      grupo: '',
      idade: '',
      sexo: '',
      modelo: '',
      marca: ''
    });
  };

  const excluirProduto = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/produtos/${id}`);
      carregarProdutos();
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      alert('Erro ao excluir produto.');
    }
  };

  if (loading) return <div className="loading">Carregando produtos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list-container">
      <h2>Lista de Produtos</h2>
      
      <div className="filters-container">
        <h3>Filtros</h3>
        <div className="filters-grid">
          <select name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
            <option value="">Todos os tipos</option>
            {opcoes.tipos.map(tipo => (
              <option key={tipo._id} value={tipo._id}>{tipo.nome}</option>
            ))}
          </select>
          
          <select name="grupo" value={filtros.grupo} onChange={handleFiltroChange}>
            <option value="">Todos os grupos</option>
            {opcoes.grupos.map(grupo => (
              <option key={grupo._id} value={grupo._id}>{grupo.nome}</option>
            ))}
          </select>
          
          <select name="idade" value={filtros.idade} onChange={handleFiltroChange}>
            <option value="">Todas as idades</option>
            {opcoes.idades.map(idade => (
              <option key={idade._id} value={idade._id}>{idade.nome}</option>
            ))}
          </select>
          
          <select name="sexo" value={filtros.sexo} onChange={handleFiltroChange}>
            <option value="">Todos os sexos</option>
            {opcoes.sexos.map(sexo => (
              <option key={sexo._id} value={sexo._id}>{sexo.nome}</option>
            ))}
          </select>
          
          <select name="modelo" value={filtros.modelo} onChange={handleFiltroChange}>
            <option value="">Todos os modelos</option>
            {opcoes.modelos.map(modelo => (
              <option key={modelo._id} value={modelo._id}>{modelo.nome}</option>
            ))}
          </select>
          
          <select name="marca" value={filtros.marca} onChange={handleFiltroChange}>
            <option value="">Todas as marcas</option>
            {opcoes.marcas.map(marca => (
              <option key={marca._id} value={marca._id}>{marca.nome}</option>
            ))}
          </select>
        </div>
        
        <button onClick={limparFiltros} className="clear-filters-btn">
          Limpar Filtros
        </button>
      </div>
      
      {produtos.length === 0 ? (
        <p>Nenhum produto encontrado com os filtros selecionados.</p>
      ) : (
        <div className="products-list">
          {produtos.map(produto => (
            <div key={produto._id} className="product-item">
              <div className="product-info">
                <h3>{produto.nome}</h3>
                <p className="product-price">R$ {produto.preco.toFixed(2)}</p>
                <div className="product-attributes">
                  {produto.tipo && <span className="attribute">Tipo: {produto.tipo.nome}</span>}
                  {produto.grupo && <span className="attribute">Grupo: {produto.grupo.nome}</span>}
                  {produto.marca && <span className="attribute">Marca: {produto.marca.nome}</span>}
                  {produto.modelo && <span className="attribute">Modelo: {produto.modelo.nome}</span>}
                </div>
                {produto.estoque > 0 ? (
                  <p className="in-stock">Em estoque: {produto.estoque} unidades</p>
                ) : (
                  <p className="out-of-stock">Fora de estoque</p>
                )}
              </div>
              <div className="product-actions">
                <Link to={`/produtos/${produto._id}`} className="view-details-btn">
                  Ver detalhes
                </Link>
                <Link to={`/produtos/editar/${produto._id}`} className="edit-btn">
                  Editar
                </Link>
                <button 
                  onClick={() => excluirProduto(produto._id)}
                  className="delete-btn"
                >
                  Excluir
                </button>
>>>>>>> 934f7639c186723e901e737a1968db5c4f1168f0
              </div>
            </div>
          ))
        )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
