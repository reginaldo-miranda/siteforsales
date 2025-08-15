import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminClientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    nome: '',
    email: ''
  });

  useEffect(() => {
    // Verificar se o usuário está logado como admin
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      navigate('/login-admin');
      return;
    }
    
    carregarClientes();
  }, [navigate]);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clientes`);
      setClientes(response.data);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const excluirCliente = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/clientes/${id}`);
      carregarClientes();
      alert('Cliente excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      alert('Erro ao excluir cliente.');
    }
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const matchNome = !filtros.nome || 
      cliente.nome.toLowerCase().includes(filtros.nome.toLowerCase());
    const matchEmail = !filtros.email || 
      cliente.email.toLowerCase().includes(filtros.email.toLowerCase());
    return matchNome && matchEmail;
  });

  if (loading) return <div className="loading">Carregando clientes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-clientes">
      <div className="admin-header">
        <h1>Gerenciar Clientes</h1>
        <div className="admin-actions">
          <Link to="/admin/cliente/novo" className="btn btn-primary">
            Adicionar Cliente
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
        
        <input
          type="text"
          placeholder="Buscar por email..."
          value={filtros.email}
          onChange={(e) => setFiltros({...filtros, email: e.target.value})}
          className="filter-input"
        />
      </div>

      <div className="clientes-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>CPF</th>
              <th>Data Cadastro</th>
              <th>Total Pedidos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map(cliente => (
              <tr key={cliente._id}>
                <td>{cliente.nome}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefone || 'N/A'}</td>
                <td>{cliente.cpf || 'N/A'}</td>
                <td>{new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</td>
                <td>{cliente.totalPedidos || 0}</td>
                <td className="actions">
                  <Link 
                    to={`/admin/cliente/editar/${cliente._id}`} 
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => excluirCliente(cliente._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {clientesFiltrados.length === 0 && (
          <p className="no-data">Nenhum cliente encontrado.</p>
        )}
      </div>

      <div className="estatisticas">
        <h3>Estatísticas</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <h4>{clientes.length}</h4>
            <p>Total de Clientes</p>
          </div>
          <div className="stat-item">
            <h4>{clientes.filter(c => c.dataCadastro && new Date(c.dataCadastro).getMonth() === new Date().getMonth()).length}</h4>
            <p>Novos este Mês</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClientes;