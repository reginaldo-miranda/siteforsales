import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FornecedorList = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/fornecedores`);
      setFornecedores(response.data);
    } catch (err) {
      setError('Erro ao carregar fornecedores');
      console.error('Erro ao carregar fornecedores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, razaoSocial) => {
    if (window.confirm(`Tem certeza que deseja desativar o fornecedor "${razaoSocial}"?`)) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/fornecedores/${id}`);
        alert('Fornecedor desativado com sucesso!');
        carregarFornecedores();
      } catch (err) {
        alert('Erro ao desativar fornecedor');
        console.error('Erro ao desativar fornecedor:', err);
      }
    }
  };

  const fornecedoresFiltrados = fornecedores.filter(fornecedor =>
    fornecedor.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cnpj.includes(searchTerm) ||
    fornecedor.atividade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Carregando fornecedores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="produtos-page">
        <div className="produtos-header">
          <h1>Fornecedores</h1>
          <p>Gerencie os fornecedores da sua empresa</p>
        </div>
        
        <div className="produtos-filters">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por razão social, código, CNPJ ou atividade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link to="/fornecedores/novo" className="btn-primary">
            <i className="fas fa-plus"></i> Novo Fornecedor
          </Link>
        </div>
        
        {fornecedoresFiltrados.length === 0 ? (
          <div className="no-products">
            <p>Nenhum fornecedor encontrado.</p>
            <Link to="/fornecedores/novo" className="btn-primary">
              Cadastrar Primeiro Fornecedor
            </Link>
          </div>
        ) : (
          <div className="fornecedores-grid">
            {fornecedoresFiltrados.map(fornecedor => (
              <div key={fornecedor._id} className="fornecedor-card">
                <div className="fornecedor-header">
                  <h3>{fornecedor.razaoSocial}</h3>
                  <span className="fornecedor-codigo">#{fornecedor.codigo}</span>
                </div>
                
                <div className="fornecedor-info">
                  <p><strong>CNPJ:</strong> {fornecedor.cnpj}</p>
                  <p><strong>Atividade:</strong> {fornecedor.atividade}</p>
                  <p><strong>Atendente:</strong> {fornecedor.atendente}</p>
                  <p><strong>Telefone:</strong> {fornecedor.telefone1}</p>
                  {fornecedor.telefone2 && (
                    <p><strong>Telefone 2:</strong> {fornecedor.telefone2}</p>
                  )}
                  <p><strong>Endereço:</strong> {fornecedor.rua}, {fornecedor.bairro}, {fornecedor.cidade}/{fornecedor.estado} - CEP: {fornecedor.cep}</p>
                  {fornecedor.inscricao && (
                    <p><strong>Inscrição:</strong> {fornecedor.inscricao}</p>
                  )}
                </div>
                
                <div className="fornecedor-status">
                  <span className={`status ${fornecedor.ativo ? 'ativo' : 'inativo'}`}>
                    {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                
                <div className="fornecedor-actions">
                  <Link 
                    to={`/fornecedores/editar/${fornecedor._id}`} 
                    className="btn-edit"
                    title="Editar fornecedor"
                  >
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button 
                    onClick={() => handleDelete(fornecedor._id, fornecedor.razaoSocial)}
                    className="btn-delete"
                    title="Desativar fornecedor"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FornecedorList;