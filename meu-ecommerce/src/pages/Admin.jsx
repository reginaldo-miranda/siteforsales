import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [opcoes, setOpcoes] = useState({
    tipos: [],
    grupos: [],
    idades: [],
    sexos: [],
    modelos: [],
    marcas: []
  });
  const [novaOpcao, setNovaOpcao] = useState({ nome: '', categoria: 'tipos' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categorias = [
    { key: 'tipos', label: 'Tipos', endpoint: 'tipos' },
    { key: 'grupos', label: 'Grupos', endpoint: 'grupos' },
    { key: 'idades', label: 'Idades', endpoint: 'idades' },
    { key: 'sexos', label: 'Sexos', endpoint: 'sexos' },
    { key: 'modelos', label: 'Modelos', endpoint: 'modelos' },
    { key: 'marcas', label: 'Marcas', endpoint: 'marcas' }
  ];

  useEffect(() => {
    carregarOpcoes();
  }, []);

  const carregarOpcoes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/opcoes`);
      setOpcoes(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar opções:', err);
      setError('Não foi possível carregar as opções.');
      setLoading(false);
    }
  };

  const adicionarOpcao = async (e) => {
    e.preventDefault();
    if (!novaOpcao.nome.trim()) return;

    try {
      const categoria = categorias.find(cat => cat.key === novaOpcao.categoria);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/${categoria.endpoint}`, {
        nome: novaOpcao.nome
      });
      
      setNovaOpcao({ nome: '', categoria: 'tipos' });
      carregarOpcoes();
    } catch (err) {
      console.error('Erro ao adicionar opção:', err);
      alert('Erro ao adicionar opção. Verifique se o nome já não existe.');
    }
  };

  const removerOpcao = async (id, categoria) => {
    if (!confirm('Tem certeza que deseja remover esta opção?')) return;

    try {
      const categoriaInfo = categorias.find(cat => cat.key === categoria);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/${categoriaInfo.endpoint}/${id}`);
      carregarOpcoes();
    } catch (err) {
      console.error('Erro ao remover opção:', err);
      alert('Erro ao remover opção.');
    }
  };

  if (loading) return <div className="loading">Carregando opções...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-container">
      <h1>Administração de Opções</h1>
      
      <div className="admin-form">
        <h2>Adicionar Nova Opção</h2>
        <form onSubmit={adicionarOpcao}>
          <div className="form-group">
            <label htmlFor="categoria">Categoria:</label>
            <select 
              id="categoria"
              value={novaOpcao.categoria}
              onChange={(e) => setNovaOpcao({...novaOpcao, categoria: e.target.value})}
            >
              {categorias.map(cat => (
                <option key={cat.key} value={cat.key}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input 
              type="text"
              id="nome"
              value={novaOpcao.nome}
              onChange={(e) => setNovaOpcao({...novaOpcao, nome: e.target.value})}
              placeholder="Digite o nome da opção"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary">Adicionar</button>
        </form>
      </div>

      <div className="admin-lists">
        {categorias.map(categoria => (
          <div key={categoria.key} className="opcao-categoria">
            <h3>{categoria.label}</h3>
            <div className="opcoes-list">
              {opcoes[categoria.key]?.map(opcao => (
                <div key={opcao._id} className="opcao-item">
                  <span>{opcao.nome}</span>
                  <button 
                    onClick={() => removerOpcao(opcao._id, categoria.key)}
                    className="btn-danger"
                  >
                    Remover
                  </button>
                </div>
              ))}
              {opcoes[categoria.key]?.length === 0 && (
                <p className="no-options">Nenhuma opção cadastrada</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;