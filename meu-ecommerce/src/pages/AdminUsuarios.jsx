import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    permissoes: {
      produtos: true,
      pedidos: true,
      clientes: true,
      usuarios: false
    }
  });

  useEffect(() => {
    // Verificar se o usuário está logado como admin
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      navigate('/login-admin');
      return;
    }
    
    const user = JSON.parse(userData);
    if (!user.permissoes?.usuarios) {
      alert('Você não tem permissão para acessar esta área.');
      navigate('/admin-dashboard');
      return;
    }
    
    carregarUsuarios();
  }, [navigate]);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`);
      setUsuarios(response.data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/usuarios/${editingUser._id}`, formData);
        alert('Usuário atualizado com sucesso!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios`, formData);
        alert('Usuário criado com sucesso!');
      }
      
      setShowForm(false);
      setEditingUser(null);
      setFormData({
        nome: '',
        email: '',
        senha: '',
        permissoes: {
          produtos: true,
          pedidos: true,
          clientes: true,
          usuarios: false
        }
      });
      carregarUsuarios();
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      alert('Erro ao salvar usuário.');
    }
  };

  const editarUsuario = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: '',
      permissoes: usuario.permissoes || {
        produtos: true,
        pedidos: true,
        clientes: true,
        usuarios: false
      }
    });
    setShowForm(true);
  };

  const excluirUsuario = async (id) => {
    if (!confirm('Tem certeza que deseja desativar este usuário?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`);
      carregarUsuarios();
      alert('Usuário desativado com sucesso!');
    } catch (err) {
      console.error('Erro ao desativar usuário:', err);
      alert('Erro ao desativar usuário.');
    }
  };

  const cancelarEdicao = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      permissoes: {
        produtos: true,
        pedidos: true,
        clientes: true,
        usuarios: false
      }
    });
  };

  if (loading) return <div className="loading">Carregando usuários...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-usuarios">
      <div className="admin-header">
        <h1>Gerenciar Usuários Administrativos</h1>
        <div className="admin-actions">
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Adicionar Usuário
          </button>
          <Link to="/admin-dashboard" className="btn btn-secondary">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-content">
            <h3>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome:</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Senha {editingUser && '(deixe em branco para manter a atual)'}:</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  required={!editingUser}
                />
              </div>
              
              <div className="form-group">
                <label>Permissões:</label>
                <div className="permissions">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.permissoes.produtos}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissoes: {...formData.permissoes, produtos: e.target.checked}
                      })}
                    />
                    Gerenciar Produtos
                  </label>
                  
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.permissoes.pedidos}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissoes: {...formData.permissoes, pedidos: e.target.checked}
                      })}
                    />
                    Gerenciar Pedidos
                  </label>
                  
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.permissoes.clientes}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissoes: {...formData.permissoes, clientes: e.target.checked}
                      })}
                    />
                    Gerenciar Clientes
                  </label>
                  
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.permissoes.usuarios}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissoes: {...formData.permissoes, usuarios: e.target.checked}
                      })}
                    />
                    Gerenciar Usuários
                  </label>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Atualizar' : 'Criar'}
                </button>
                <button type="button" onClick={cancelarEdicao} className="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="usuarios-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Permissões</th>
              <th>Data Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario._id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>
                  <div className="permissions-list">
                    {usuario.permissoes?.produtos && <span className="perm-badge">Produtos</span>}
                    {usuario.permissoes?.pedidos && <span className="perm-badge">Pedidos</span>}
                    {usuario.permissoes?.clientes && <span className="perm-badge">Clientes</span>}
                    {usuario.permissoes?.usuarios && <span className="perm-badge admin">Usuários</span>}
                  </div>
                </td>
                <td>{new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}</td>
                <td className="actions">
                  <button 
                    onClick={() => editarUsuario(usuario)}
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => excluirUsuario(usuario._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {usuarios.length === 0 && (
          <p className="no-data">Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsuarios;