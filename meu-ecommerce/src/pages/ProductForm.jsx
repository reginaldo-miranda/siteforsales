import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [produto, setProduto] = useState({
    nome: '',
    descricao: '',
    preco: '',
    imagem: '',
    estoque: '',
    tipo: '',
    grupo: '',
    idade: '',
    sexo: '',
    modelo: '',
    marca: ''
  });
  
  const [opcoes, setOpcoes] = useState({
    tipos: [],
    grupos: [],
    idades: [],
    sexos: [],
    modelos: [],
    marcas: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    carregarOpcoes();
    if (isEdit) {
      carregarProduto();
    } else {
      setLoading(false);
    }
  }, [id]);

  const carregarOpcoes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/opcoes`);
      setOpcoes(response.data);
    } catch (err) {
      console.error('Erro ao carregar opções:', err);
      setError('Não foi possível carregar as opções.');
    }
  };

  const carregarProduto = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/produtos/${id}`);
      const produtoData = response.data;
      
      setProduto({
        nome: produtoData.nome || '',
        descricao: produtoData.descricao || '',
        preco: produtoData.preco || '',
        imagem: produtoData.imagem || '',
        estoque: produtoData.estoque || '',
        tipo: produtoData.tipo?._id || '',
        grupo: produtoData.grupo?._id || '',
        idade: produtoData.idade?._id || '',
        sexo: produtoData.sexo?._id || '',
        modelo: produtoData.modelo?._id || '',
        marca: produtoData.marca?._id || ''
      });
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar produto:', err);
      setError('Não foi possível carregar o produto.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const produtoData = {
        ...produto,
        preco: parseFloat(produto.preco),
        estoque: parseInt(produto.estoque),
        // Remover campos vazios
        tipo: produto.tipo || undefined,
        grupo: produto.grupo || undefined,
        idade: produto.idade || undefined,
        sexo: produto.sexo || undefined,
        modelo: produto.modelo || undefined,
        marca: produto.marca || undefined
      };
      
      if (isEdit) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/produtos/${id}`, produtoData);
        alert('Produto atualizado com sucesso!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/produtos`, produtoData);
        alert('Produto cadastrado com sucesso!');
      }
      
      navigate('/produtos');
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      alert('Erro ao salvar produto. Verifique os dados e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-form-container">
      <h1>{isEdit ? 'Editar Produto' : 'Cadastrar Produto'}</h1>
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome do Produto *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={produto.nome}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="preco">Preço *</label>
            <input
              type="number"
              id="preco"
              name="preco"
              value={produto.preco}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="descricao">Descrição *</label>
          <textarea
            id="descricao"
            name="descricao"
            value={produto.descricao}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="imagem">URL da Imagem</label>
            <input
              type="url"
              id="imagem"
              name="imagem"
              value={produto.imagem}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="estoque">Estoque *</label>
            <input
              type="number"
              id="estoque"
              name="estoque"
              value={produto.estoque}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>
        
        <h3>Opções do Produto</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              name="tipo"
              value={produto.tipo}
              onChange={handleChange}
            >
              <option value="">Selecione um tipo</option>
              {opcoes.tipos.map(tipo => (
                <option key={tipo._id} value={tipo._id}>{tipo.nome}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="grupo">Grupo</label>
            <select
              id="grupo"
              name="grupo"
              value={produto.grupo}
              onChange={handleChange}
            >
              <option value="">Selecione um grupo</option>
              {opcoes.grupos.map(grupo => (
                <option key={grupo._id} value={grupo._id}>{grupo.nome}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="idade">Idade</label>
            <select
              id="idade"
              name="idade"
              value={produto.idade}
              onChange={handleChange}
            >
              <option value="">Selecione uma idade</option>
              {opcoes.idades.map(idade => (
                <option key={idade._id} value={idade._id}>{idade.nome}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="sexo">Sexo</label>
            <select
              id="sexo"
              name="sexo"
              value={produto.sexo}
              onChange={handleChange}
            >
              <option value="">Selecione um sexo</option>
              {opcoes.sexos.map(sexo => (
                <option key={sexo._id} value={sexo._id}>{sexo.nome}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="modelo">Modelo</label>
            <select
              id="modelo"
              name="modelo"
              value={produto.modelo}
              onChange={handleChange}
            >
              <option value="">Selecione um modelo</option>
              {opcoes.modelos.map(modelo => (
                <option key={modelo._id} value={modelo._id}>{modelo.nome}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="marca">Marca</label>
            <select
              id="marca"
              name="marca"
              value={produto.marca}
              onChange={handleChange}
            >
              <option value="">Selecione uma marca</option>
              {opcoes.marcas.map(marca => (
                <option key={marca._id} value={marca._id}>{marca.nome}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/produtos')}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Cadastrar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;