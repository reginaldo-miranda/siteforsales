import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const FornecedorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [fornecedor, setFornecedor] = useState({
    codigo: '',
    razaoSocial: '',
    rua: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: '',
    cnpj: '',
    inscricao: '',
    telefone1: '',
    telefone2: '',
    atividade: '',
    atendente: '',
    ativo: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (isEdit) {
      carregarFornecedor();
    }
  }, [id]);

  const carregarFornecedor = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/fornecedores/${id}`);
      setFornecedor(response.data);
    } catch (err) {
      setError('Erro ao carregar fornecedor');
      console.error('Erro ao carregar fornecedor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFornecedor(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEdit) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/fornecedores/${id}`, fornecedor);
        setMessage('Fornecedor atualizado com sucesso!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/fornecedores`, fornecedor);
        setMessage('Fornecedor cadastrado com sucesso!');
      }
      setMessageType('success');
      
      // Limpar formulário se for novo cadastro
      if (!isEdit) {
        setFornecedor({
          codigo: '',
          razaoSocial: '',
          rua: '',
          bairro: '',
          cep: '',
          cidade: '',
          estado: '',
          cnpj: '',
          inscricao: '',
          telefone1: '',
          telefone2: '',
          atividade: '',
          atendente: '',
          ativo: true
        });
      }
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/fornecedores');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar fornecedor');
      console.error('Erro ao salvar fornecedor:', err);
      setMessage('Erro ao salvar fornecedor. Tente novamente.');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/fornecedores');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="fornecedor-form-page">
        <div className="fornecedor-form-header">
          <div className="header-content">
            <div className="header-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="header-text">
              <h1>{isEdit ? 'Editar Fornecedor' : 'Cadastrar Novo Fornecedor'}</h1>
              <p>{isEdit ? 'Atualize as informações do fornecedor selecionado' : 'Preencha os dados para cadastrar um novo fornecedor'}</p>
            </div>
          </div>
        </div>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="fornecedor-form-container">
        
        <form onSubmit={handleSubmit} className="fornecedor-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="codigo">Código *</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={fornecedor.codigo}
                onChange={handleChange}
                required
                placeholder="Digite o código do fornecedor"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="razaoSocial">Razão Social *</label>
              <input
                type="text"
                id="razaoSocial"
                name="razaoSocial"
                value={fornecedor.razaoSocial}
                onChange={handleChange}
                required
                placeholder="Digite a razão social"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cnpj">CNPJ *</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={fornecedor.cnpj}
                onChange={handleChange}
                required
                placeholder="Digite o CNPJ"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="inscricao">Inscrição Estadual</label>
              <input
                type="text"
                id="inscricao"
                name="inscricao"
                value={fornecedor.inscricao}
                onChange={handleChange}
                placeholder="Digite a inscrição estadual"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rua">Rua *</label>
              <input
                type="text"
                id="rua"
                name="rua"
                value={fornecedor.rua}
                onChange={handleChange}
                required
                placeholder="Digite a rua"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bairro">Bairro *</label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                value={fornecedor.bairro}
                onChange={handleChange}
                required
                placeholder="Digite o bairro"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cep">CEP *</label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={fornecedor.cep}
                onChange={handleChange}
                required
                placeholder="00000-000"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cidade">Cidade *</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={fornecedor.cidade}
                onChange={handleChange}
                required
                placeholder="Digite a cidade"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="estado">Estado *</label>
              <select
                id="estado"
                name="estado"
                value={fornecedor.estado}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o estado</option>
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
              <label htmlFor="telefone1">Telefone 1 *</label>
              <input
                type="tel"
                id="telefone1"
                name="telefone1"
                value={fornecedor.telefone1}
                onChange={handleChange}
                required
                placeholder="Digite o telefone principal"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telefone2">Telefone 2</label>
              <input
                type="tel"
                id="telefone2"
                name="telefone2"
                value={fornecedor.telefone2}
                onChange={handleChange}
                placeholder="Digite o telefone secundário"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="atividade">Atividade *</label>
              <input
                type="text"
                id="atividade"
                name="atividade"
                value={fornecedor.atividade}
                onChange={handleChange}
                required
                placeholder="Digite a atividade principal"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="atendente">Atendente *</label>
              <input
                type="text"
                id="atendente"
                name="atendente"
                value={fornecedor.atendente}
                onChange={handleChange}
                required
                placeholder="Digite o nome do atendente"
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="ativo"
                  checked={fornecedor.ativo}
                  onChange={handleChange}
                />
                <span>Fornecedor Ativo</span>
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Cadastrar')}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default FornecedorForm;