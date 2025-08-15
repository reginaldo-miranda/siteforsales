import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({
    totalPedidos: 0,
    totalClientes: 0,
    totalProdutos: 0,
    faturamentoMes: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Verificar se o usuário está logado
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      navigate('/login-admin');
      return;
    }
    
    setAdminUser(JSON.parse(userData));
    loadDashboardData();
  }, [navigate]);
  
  const loadDashboardData = async () => {
    try {
      // Carregar estatísticas do dashboard
      const [pedidosRes, clientesRes, produtosRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/pedidos`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/clientes`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/produtos`)
      ]);
      
      const pedidos = pedidosRes.data;
      const clientes = clientesRes.data;
      const produtos = produtosRes.data;
      
      // Calcular faturamento do mês atual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const faturamentoMes = pedidos
        .filter(pedido => {
          const pedidoDate = new Date(pedido.dataPedido);
          return pedidoDate.getMonth() === currentMonth && 
                 pedidoDate.getFullYear() === currentYear &&
                 pedido.status !== 'cancelado';
        })
        .reduce((total, pedido) => total + pedido.total, 0);
      
      setStats({
        totalPedidos: pedidos.length,
        totalClientes: clientes.length,
        totalProdutos: produtos.length,
        faturamentoMes
      });
      
      // Pegar os 5 pedidos mais recentes
      const recentOrders = pedidos
        .sort((a, b) => new Date(b.dataPedido) - new Date(a.dataPedido))
        .slice(0, 5);
      
      setRecentOrders(recentOrders);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
    
    setLoading(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/login-admin');
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Painel Administrativo</h1>
          <div className="user-info">
            <span>Bem-vindo, {adminUser?.nome}</span>
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalPedidos}</h3>
              <p>Total de Pedidos</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalClientes}</h3>
              <p>Total de Clientes</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🛍️</div>
            <div className="stat-info">
              <h3>{stats.totalProdutos}</h3>
              <p>Total de Produtos</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>R$ {stats.faturamentoMes.toFixed(2)}</h3>
              <p>Faturamento do Mês</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-sections">
          <div className="section">
            <h2>Ações Rápidas</h2>
            <div className="quick-actions">
              <Link to="/admin/produtos" className="action-card">
                <div className="action-icon">📝</div>
                <h3>Gerenciar Produtos</h3>
                <p>Adicionar, editar ou remover produtos</p>
              </Link>
              
              <Link to="/admin/pedidos" className="action-card">
                <div className="action-icon">📋</div>
                <h3>Gerenciar Pedidos</h3>
                <p>Visualizar e atualizar status dos pedidos</p>
              </Link>
              
              <Link to="/admin/clientes" className="action-card">
                <div className="action-icon">👤</div>
                <h3>Gerenciar Clientes</h3>
                <p>Visualizar e editar informações dos clientes</p>
              </Link>
              
              <Link to="/admin" className="action-card">
                <div className="action-icon">⚙️</div>
                <h3>Gerenciar Opções</h3>
                <p>Configurar tipos, grupos, marcas e categorias</p>
              </Link>
              
              {adminUser?.permissoes?.usuarios && (
                <Link to="/admin/usuarios" className="action-card">
                  <div className="action-icon">👥</div>
                  <h3>Gerenciar Usuários</h3>
                  <p>Adicionar e configurar usuários administrativos</p>
                </Link>
              )}
            </div>
          </div>
          
          <div className="section">
            <h2>Pedidos Recentes</h2>
            <div className="recent-orders">
              {recentOrders.length === 0 ? (
                <p>Nenhum pedido encontrado</p>
              ) : (
                recentOrders.map(pedido => (
                  <div key={pedido._id} className="order-item">
                    <div className="order-info">
                      <h4>Pedido #{pedido.numero}</h4>
                      <p>Cliente: {pedido.cliente.nome}</p>
                      <p>Data: {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="order-details">
                      <span className={`status ${pedido.status}`}>
                        {pedido.status}
                      </span>
                      <span className="total">
                        R$ {pedido.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;