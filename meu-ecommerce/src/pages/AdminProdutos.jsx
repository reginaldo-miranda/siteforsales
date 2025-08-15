import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminProdutos = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    nome: '',
    categoria: ''
  });

  useEffect(() => {
    // Verificar se o usuário está logado como admin
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      navigate('/login-admin');
      return;
    }
    
    carregarProdutos();
  }, [navigate]);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/produtos`);
      setProdutos(response.data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const excluirProduto = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/produtos/${id}`);
      carregarProdutos();
      alert('Produto excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      alert('Erro ao excluir produto.');
    }
  };

  const produtosFiltrados = produtos.filter(produto => {
    return produto.nome.toLowerCase().includes(filtros.nome.toLowerCase());
  });

  if (loading) return <div className="loading">Carregando produtos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-produtos">
      <div className="admin-header">
        <h1>Gerenciar Produtos</h1>
        <div className="admin-actions">
          <Link to="/admin/produto/novo" className="btn btn-primary">
            Adicionar Produto
          </Link>
          <Link to="/admin-dashboard" className="btn btn-secondary">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={filtros.nome}
          onChange={(e) => setFiltros({...filtros, nome: e.target.value})}
          className="filter-input"
        />
      </div>

      <div className="produtos-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map(produto => (
              <tr key={produto._id}>
                <td>{produto.nome}</td>
                <td>R$ {produto.preco.toFixed(2)}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.tipo?.nome || 'N/A'}
                </td>
                <td className="actions">
                  <Link 
                    to={`/produto/${produto._id}`} 
                    className="btn btn-info btn-sm"
                  >
                    Ver
                  </Link>
                  <Link 
                    to={`/admin/produto/editar/${produto._id}`} 
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => excluirProduto(produto._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {produtosFiltrados.length === 0 && (
          <p className="no-data">Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProdutos;