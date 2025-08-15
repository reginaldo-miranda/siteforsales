import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ClienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [cliente, setCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    enderecos: [{
      tipo: 'residencial',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      principal: true
    }]
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está logado como admin
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      navigate('/login-admin');
      return;
    }
    
    if (isEdit) {
      carregarCliente();
    } else {
      setLoading(false);
    }
  }, [id, navigate]);

  const carregarCliente = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clientes/${id}`);
      const clienteData = response.data;
      
      setCliente({
        nome: clienteData.nome || '',
        email: clienteData.email || '',
        telefone: clienteData.telefone || '',
        cpf: clienteData.cpf || '',
        enderecos: clienteData.enderecos && clienteData.enderecos.length > 0 ? [{
          tipo: clienteData.enderecos[0].tipo || 'residencial',
          cep: clienteData.enderecos[0].cep || '',
          logradouro: clienteData.enderecos[0].logradouro || '',
          numero: clienteData.enderecos[0].numero || '',
          complemento: clienteData.enderecos[0].complemento || '',
          bairro: clienteData.enderecos[0].bairro || '',
          cidade: clienteData.enderecos[0].cidade || '',
          estado: clienteData.enderecos[0].estado || '',
          principal: clienteData.enderecos[0].principal || true
        }] : [{
          tipo: 'residencial',
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          principal: true
        }]
      });
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar cliente:', err);
      setError('Não foi possível carregar o cliente.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('endereco.')) {
      const enderecoField = name.split('.')[1];
      setCliente(prev => ({
        ...prev,
        enderecos: [{
          ...prev.enderecos[0],
          [enderecoField]: value
        }]
      }));
    } else {
      setCliente(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (isEdit) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/clientes/${id}`, cliente);
        alert('Cliente atualizado com sucesso!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/clientes`, cliente);
        alert('Cliente cadastrado com sucesso!');
      }
      
      navigate('/admin/clientes');
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      alert('Erro ao salvar cliente. Verifique os dados e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cliente-form-container">
      <div className="admin-header">
        <h1>{isEdit ? 'Editar Cliente' : 'Cadastrar Cliente'}</h1>
        <div className="admin-actions">
          <Link to="/admin/clientes" className="btn btn-secondary">
            Voltar aos Clientes
          </Link>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="cliente-form">
        <div className="form-section">
          <h3>Dados Pessoais</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome Completo *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={cliente.nome}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={cliente.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={cliente.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={cliente.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Endereço</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="endereco.logradouro">Logradouro</label>
              <input
                type="text"
                id="endereco.logradouro"
                name="endereco.logradouro"
                value={cliente.enderecos[0].logradouro}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endereco.numero">Número</label>
              <input
                type="text"
                id="endereco.numero"
                name="endereco.numero"
                value={cliente.enderecos[0].numero}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endereco.complemento">Complemento</label>
              <input
                type="text"
                id="endereco.complemento"
                name="endereco.complemento"
                value={cliente.enderecos[0].complemento}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="endereco.bairro">Bairro</label>
              <input
                type="text"
                id="endereco.bairro"
                name="endereco.bairro"
                value={cliente.enderecos[0].bairro}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endereco.cidade">Cidade</label>
              <input
                type="text"
                id="endereco.cidade"
                name="endereco.cidade"
                value={cliente.enderecos[0].cidade}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="endereco.estado">Estado</label>
              <select
                id="endereco.estado"
                name="endereco.estado"
                value={cliente.enderecos[0].estado}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um estado</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="endereco.cep">CEP</label>
              <input
                type="text"
                id="endereco.cep"
                name="endereco.cep"
                value={cliente.enderecos[0].cep}
                onChange={handleChange}
                placeholder="00000-000"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/admin/clientes')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Cadastrar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;