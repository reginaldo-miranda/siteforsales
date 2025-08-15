import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PedidoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  
  const [formData, setFormData] = useState({
    cliente: '',
    itens: [{ produto: '', quantidade: 1, precoUnitario: 0, subtotal: 0 }],
    enderecoEntrega: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    formaPagamento: {
      tipo: 'pix',
      parcelas: 1,
      valorParcela: 0
    },
    subtotal: 0,
    frete: 0,
    desconto: 0,
    total: 0,
    status: 'pendente'
  });

  useEffect(() => {
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      navigate('/login-admin');
      return;
    }
    
    carregarDados();
  }, [navigate, id]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar clientes e produtos
      const [clientesRes, produtosRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/clientes`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/produtos`)
      ]);
      
      setClientes(clientesRes.data);
      setProdutos(produtosRes.data);
      
      // Se for edição, carregar o pedido
      if (id) {
        const pedidoRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/pedidos/${id}`);
        setFormData(pedidoRes.data);
      }
      
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/pedidos/${id}`, formData);
        alert('Pedido atualizado com sucesso!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/pedidos`, formData);
        alert('Pedido criado com sucesso!');
      }
      
      navigate('/admin/pedidos');
    } catch (err) {
      console.error('Erro ao salvar pedido:', err);
      alert('Erro ao salvar pedido.');
    } finally {
      setSaving(false);
    }
  };

  const adicionarItem = () => {
    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, { produto: '', quantidade: 1, precoUnitario: 0, subtotal: 0 }]
    }));
  };

  const removerItem = (index) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index)
    }));
  };

  const atualizarItem = (index, campo, valor) => {
    setFormData(prev => {
      const novosItens = [...prev.itens];
      novosItens[index] = { ...novosItens[index], [campo]: valor };
      
      // Calcular subtotal do item
      if (campo === 'produto') {
        const produto = produtos.find(p => p._id === valor);
        if (produto) {
          novosItens[index].precoUnitario = produto.preco;
          novosItens[index].subtotal = produto.preco * novosItens[index].quantidade;
        }
      } else if (campo === 'quantidade') {
        novosItens[index].subtotal = novosItens[index].precoUnitario * valor;
      }
      
      // Calcular totais
      const subtotal = novosItens.reduce((sum, item) => sum + item.subtotal, 0);
      const total = subtotal + prev.frete - prev.desconto;
      
      return {
        ...prev,
        itens: novosItens,
        subtotal,
        total
      };
    });
  };

  const atualizarEndereco = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      enderecoEntrega: { ...prev.enderecoEntrega, [campo]: valor }
    }));
  };

  const atualizarPagamento = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      formaPagamento: { ...prev.formaPagamento, [campo]: valor }
    }));
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="pedido-form">
      <div className="admin-header">
        <h1>{id ? 'Editar Pedido' : 'Novo Pedido'}</h1>
        <div className="admin-actions">
          <Link to="/admin/pedidos" className="btn btn-secondary">
            Voltar aos Pedidos
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        {/* Cliente */}
        <div className="form-section">
          <h3>Cliente</h3>
          <div className="form-group">
            <label>Cliente:</label>
            <select
              value={formData.cliente}
              onChange={(e) => setFormData({...formData, cliente: e.target.value})}
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente._id} value={cliente._id}>
                  {cliente.nome} - {cliente.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="form-section">
          <h3>Itens do Pedido</h3>
          {formData.itens.map((item, index) => (
            <div key={index} className="item-row">
              <div className="form-group">
                <label>Produto:</label>
                <select
                  value={item.produto}
                  onChange={(e) => atualizarItem(index, 'produto', e.target.value)}
                  required
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map(produto => (
                    <option key={produto._id} value={produto._id}>
                      {produto.nome} - R$ {produto.preco.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Quantidade:</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantidade}
                  onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Preço Unitário:</label>
                <input
                  type="number"
                  step="0.01"
                  value={item.precoUnitario}
                  readOnly
                />
              </div>
              
              <div className="form-group">
                <label>Subtotal:</label>
                <input
                  type="number"
                  step="0.01"
                  value={item.subtotal}
                  readOnly
                />
              </div>
              
              {formData.itens.length > 1 && (
                <button
                  type="button"
                  onClick={() => removerItem(index)}
                  className="btn btn-danger btn-sm"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={adicionarItem}
            className="btn btn-secondary"
          >
            Adicionar Item
          </button>
        </div>

        {/* Endereço de Entrega */}
        <div className="form-section">
          <h3>Endereço de Entrega</h3>
          <div className="form-row">
            <div className="form-group">
              <label>CEP:</label>
              <input
                type="text"
                value={formData.enderecoEntrega.cep}
                onChange={(e) => atualizarEndereco('cep', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Logradouro:</label>
              <input
                type="text"
                value={formData.enderecoEntrega.logradouro}
                onChange={(e) => atualizarEndereco('logradouro', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Número:</label>
              <input
                type="text"
                value={formData.enderecoEntrega.numero}
                onChange={(e) => atualizarEndereco('numero', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Complemento:</label>
              <input
                type="text"
                value={formData.enderecoEntrega.complemento}
                onChange={(e) => atualizarEndereco('complemento', e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Bairro:</label>
              <input
                type="text"
                value={formData.enderecoEntrega.bairro}
                onChange={(e) => atualizarEndereco('bairro', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Cidade:</label>
              <input
                type="text"
                value={formData.enderecoEntrega.cidade}
                onChange={(e) => atualizarEndereco('cidade', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Estado:</label>
              <input
                type="text"
                value={formData.enderecoEntrega.estado}
                onChange={(e) => atualizarEndereco('estado', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Forma de Pagamento */}
        <div className="form-section">
          <h3>Forma de Pagamento</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo:</label>
              <select
                value={formData.formaPagamento.tipo}
                onChange={(e) => atualizarPagamento('tipo', e.target.value)}
                required
              >
                <option value="pix">PIX</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Parcelas:</label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.formaPagamento.parcelas}
                onChange={(e) => atualizarPagamento('parcelas', parseInt(e.target.value))}
                required
              />
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="form-section">
          <h3>Valores</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Subtotal:</label>
              <input
                type="number"
                step="0.01"
                value={formData.subtotal}
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label>Frete:</label>
              <input
                type="number"
                step="0.01"
                value={formData.frete}
                onChange={(e) => {
                  const frete = parseFloat(e.target.value) || 0;
                  setFormData(prev => ({
                    ...prev,
                    frete,
                    total: prev.subtotal + frete - prev.desconto
                  }));
                }}
              />
            </div>
            
            <div className="form-group">
              <label>Desconto:</label>
              <input
                type="number"
                step="0.01"
                value={formData.desconto}
                onChange={(e) => {
                  const desconto = parseFloat(e.target.value) || 0;
                  setFormData(prev => ({
                    ...prev,
                    desconto,
                    total: prev.subtotal + prev.frete - desconto
                  }));
                }}
              />
            </div>
            
            <div className="form-group">
              <label>Total:</label>
              <input
                type="number"
                step="0.01"
                value={formData.total}
                readOnly
                className="total-input"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="form-section">
          <h3>Status</h3>
          <div className="form-group">
            <label>Status:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              required
            >
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="preparando">Preparando</option>
              <option value="enviado">Enviado</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : (id ? 'Atualizar Pedido' : 'Criar Pedido')}
          </button>
          <Link to="/admin/pedidos" className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PedidoForm;

