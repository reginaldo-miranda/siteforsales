import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [error, setError] = useState(null);

  useEffect(() => {
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
                <Link to={`/produto/${produto._id}`} className="view-details-btn">
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
