import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData);
      
      // Salvar dados do usuário no localStorage
      localStorage.setItem('adminUser', JSON.stringify(response.data));
      
      // Redirecionar para o painel administrativo
      navigate('/admin-dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao fazer login');
    }
    
    setLoading(false);
  };
  
  return (
    <div className="login-admin-container">
      <div className="login-form-container">
        <div className="login-header">
          <h2>Acesso Administrativo</h2>
          <p>Faça login para acessar o painel administrativo</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@ecommerce.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              placeholder="Sua senha"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="login-info">
          <h4>Credenciais Padrão:</h4>
          <p><strong>Email:</strong> admin@ecommerce.com</p>
          <p><strong>Senha:</strong> admin123</p>
        </div>
        
        <div className="back-to-store">
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Voltar à Loja
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;