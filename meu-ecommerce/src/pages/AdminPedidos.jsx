import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminPedidos = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    status: '',
    cliente: ''
  });

  useEffect(() => {
    // Verificar se o usuário está logado como admin
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      navigate('/login-admin');
      return;
    }
    
    carregarPedidos();
  }, [navigate]);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pedidos`);
      setPedidos(response.data);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (pedidoId, novoStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/pedidos/${pedidoId}/status`, {
        status: novoStatus
      });
      carregarPedidos();
      alert('Status atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status.');
    }
  };

  const excluirPedido = async (pedidoId) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/pedidos/${pedidoId}`);
      carregarPedidos();
      alert('Pedido excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir pedido:', err);
      alert('Erro ao excluir pedido.');
    }
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchStatus = !filtros.status || pedido.status === filtros.status;
    const matchCliente = !filtros.cliente || 
      pedido.cliente.nome.toLowerCase().includes(filtros.cliente.toLowerCase());
    return matchStatus && matchCliente;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return '#ffc107';
      case 'confirmado': return '#17a2b8';
      case 'enviado': return '#007bff';
      case 'entregue': return '#28a745';
      case 'cancelado': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) return <div className="loading">Carregando pedidos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-pedidos">
      <div className="admin-header">
        <h1>Gerenciar Pedidos</h1>
        <div className="admin-actions">
          <Link to="/admin/pedido/novo" className="btn btn-primary">
            Novo Pedido
          </Link>
          <Link to="/admin-dashboard" className="btn btn-secondary">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>

      <div className="filters">
        <select
          value={filtros.status}
          onChange={(e) => setFiltros({...filtros, status: e.target.value})}
          className="filter-select"
        >
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
          <option value="enviado">Enviado</option>
          <option value="entregue">Entregue</option>
          <option value="cancelado">Cancelado</option>
        </select>
        
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={filtros.cliente}
          onChange={(e) => setFiltros({...filtros, cliente: e.target.value})}
          className="filter-input"
        />
      </div>

      <div className="pedidos-table">
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Total</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map(pedido => (
              <tr key={pedido._id}>
                <td>#{pedido.numero}</td>
                <td>{pedido.cliente.nome}</td>
                <td>{new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</td>
                <td>R$ {pedido.total.toFixed(2)}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(pedido.status) }}
                  >
                    {pedido.status}
                  </span>
                </td>
                <td className="actions">
                  <select
                    value={pedido.status}
                    onChange={(e) => atualizarStatus(pedido._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  
                  <Link 
                    to={`/admin/pedido/editar/${pedido._id}`}
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </Link>
                  
                  <Link 
                    to={`/admin/nota-fiscal/${pedido._id}`}
                    className="btn btn-info btn-sm"
                  >
                    Nota Fiscal
                  </Link>
                  
                  <button 
                    onClick={() => excluirPedido(pedido._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {pedidosFiltrados.length === 0 && (
          <p className="no-data">Nenhum pedido encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPedidos;