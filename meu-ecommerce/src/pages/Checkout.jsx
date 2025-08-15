import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1); // 1: Identificação, 2: Endereço, 3: Pagamento, 4: Confirmação
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Estados para identificação
  const [identificacao, setIdentificacao] = useState({ cpf: '', email: '' });
  const [cliente, setCliente] = useState(null);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  
  // Estados para cadastro de cliente
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  });
  
  // Estados para endereço e pagamento
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
  const [formaPagamento, setFormaPagamento] = useState({
    tipo: '',
    parcelas: 1
  });
  
  useEffect(() => {
    // Carregar itens do carrinho
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      
      const cartTotal = parsedCart.reduce(
        (sum, item) => sum + item.preco * item.quantidade, 
        0
      );
      setTotal(cartTotal);
    } else {
      navigate('/carrinho');
    }
  }, [navigate]);
  
  const buscarCliente = async () => {
    setLoading(true);
    try {
      const params = {};
      if (identificacao.cpf) params.cpf = identificacao.cpf;
      if (identificacao.email) params.email = identificacao.email;
      
      const response = await axios.get('http://localhost:3000/api/clientes/buscar', { params });
      setCliente(response.data);
      setEtapa(2);
    } catch (error) {
      if (error.response?.status === 404) {
        setMostrarCadastro(true);
        setDadosCliente(prev => ({
          ...prev,
          email: identificacao.email,
          cpf: identificacao.cpf
        }));
      } else {
        alert('Erro ao buscar cliente');
      }
    }
    setLoading(false);
  };
  
  const cadastrarCliente = async () => {
    setLoading(true);
    try {
      const clienteData = {
        ...dadosCliente,
        enderecos: [{
          ...dadosCliente.endereco,
          tipo: 'residencial',
          principal: true
        }]
      };
      
      const response = await axios.post('http://localhost:3000/api/clientes', clienteData);
      setCliente(response.data);
      setMostrarCadastro(false);
      setEtapa(2);
    } catch (error) {
      alert('Erro ao cadastrar cliente: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };
  
  const selecionarEndereco = (endereco) => {
    setEnderecoSelecionado(endereco);
    setEtapa(3);
  };
  
  const finalizarPedido = async () => {
    setLoading(true);
    try {
      const pedidoData = {
        cliente: cliente._id,
        itens: cartItems.map(item => ({
          produto: item._id,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
          subtotal: item.preco * item.quantidade
        })),
        enderecoEntrega: enderecoSelecionado,
        formaPagamento,
        subtotal: total,
        frete: 0,
        desconto: 0,
        total: total
      };
      
      const response = await axios.post('http://localhost:3000/api/pedidos', pedidoData);
      
      // Limpar carrinho
      localStorage.removeItem('cart');
      
      // Ir para página de sucesso
      navigate('/pedido-confirmado', { state: { pedido: response.data } });
    } catch (error) {
      alert('Erro ao finalizar pedido: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };
  
  const buscarCEP = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setDadosCliente(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            cep,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };
  
  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      
      {/* Indicador de etapas */}
      <div className="checkout-steps">
        <div className={`step ${etapa >= 1 ? 'active' : ''}`}>1. Identificação</div>
        <div className={`step ${etapa >= 2 ? 'active' : ''}`}>2. Endereço</div>
        <div className={`step ${etapa >= 3 ? 'active' : ''}`}>3. Pagamento</div>
        <div className={`step ${etapa >= 4 ? 'active' : ''}`}>4. Confirmação</div>
      </div>
      
      {/* Resumo do pedido */}
      <div className="order-summary">
        <h3>Resumo do Pedido</h3>
        <div className="order-items">
          {cartItems.map(item => (
            <div key={item._id} className="order-item">
              <span>{item.nome}</span>
              <span>{item.quantidade}x</span>
              <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="order-total">
          <strong>Total: R$ {total.toFixed(2)}</strong>
        </div>
      </div>
      
      {/* Etapa 1: Identificação */}
      {etapa === 1 && (
        <div className="checkout-step">
          <h3>Identificação</h3>
          <p>Informe seu CPF ou email para continuar:</p>
          
          <div className="form-group">
            <label>CPF:</label>
            <input
              type="text"
              value={identificacao.cpf}
              onChange={(e) => setIdentificacao(prev => ({ ...prev, cpf: e.target.value }))}
              placeholder="000.000.000-00"
            />
          </div>
          
          <div className="form-group">
            <label>ou Email:</label>
            <input
              type="email"
              value={identificacao.email}
              onChange={(e) => setIdentificacao(prev => ({ ...prev, email: e.target.value }))}
              placeholder="seu@email.com"
            />
          </div>
          
          <button 
            onClick={buscarCliente}
            disabled={loading || (!identificacao.cpf && !identificacao.email)}
            className="btn-primary"
          >
            {loading ? 'Buscando...' : 'Continuar'}
          </button>
          
          {/* Formulário de cadastro */}
          {mostrarCadastro && (
            <div className="cadastro-cliente">
              <h4>Cadastro de Cliente</h4>
              <p>Cliente não encontrado. Preencha os dados abaixo:</p>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    value={dadosCliente.nome}
                    onChange={(e) => setDadosCliente(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Telefone *</label>
                  <input
                    type="tel"
                    value={dadosCliente.telefone}
                    onChange={(e) => setDadosCliente(prev => ({ ...prev, telefone: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  value={dadosCliente.dataNascimento}
                  onChange={(e) => setDadosCliente(prev => ({ ...prev, dataNascimento: e.target.value }))}
                />
              </div>
              
              <h5>Endereço</h5>
              <div className="form-row">
                <div className="form-group">
                  <label>CEP *</label>
                  <input
                    type="text"
                    value={dadosCliente.endereco.cep}
                    onChange={(e) => {
                      const cep = e.target.value;
                      setDadosCliente(prev => ({ 
                        ...prev, 
                        endereco: { ...prev.endereco, cep } 
                      }));
                      if (cep.length === 8) {
                        buscarCEP(cep);
                      }
                    }}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Número *</label>
                  <input
                    type="text"
                    value={dadosCliente.endereco.numero}
                    onChange={(e) => setDadosCliente(prev => ({ 
                      ...prev, 
                      endereco: { ...prev.endereco, numero: e.target.value } 
                    }))}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Logradouro *</label>
                <input
                  type="text"
                  value={dadosCliente.endereco.logradouro}
                  onChange={(e) => setDadosCliente(prev => ({ 
                    ...prev, 
                    endereco: { ...prev.endereco, logradouro: e.target.value } 
                  }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Complemento</label>
                <input
                  type="text"
                  value={dadosCliente.endereco.complemento}
                  onChange={(e) => setDadosCliente(prev => ({ 
                    ...prev, 
                    endereco: { ...prev.endereco, complemento: e.target.value } 
                  }))}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Bairro *</label>
                  <input
                    type="text"
                    value={dadosCliente.endereco.bairro}
                    onChange={(e) => setDadosCliente(prev => ({ 
                      ...prev, 
                      endereco: { ...prev.endereco, bairro: e.target.value } 
                    }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Cidade *</label>
                  <input
                    type="text"
                    value={dadosCliente.endereco.cidade}
                    onChange={(e) => setDadosCliente(prev => ({ 
                      ...prev, 
                      endereco: { ...prev.endereco, cidade: e.target.value } 
                    }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Estado *</label>
                  <input
                    type="text"
                    value={dadosCliente.endereco.estado}
                    onChange={(e) => setDadosCliente(prev => ({ 
                      ...prev, 
                      endereco: { ...prev.endereco, estado: e.target.value } 
                    }))}
                    required
                  />
                </div>
              </div>
              
              <button 
                onClick={cadastrarCliente}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar e Continuar'}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Etapa 2: Endereço */}
      {etapa === 2 && cliente && (
        <div className="checkout-step">
          <h3>Endereço de Entrega</h3>
          <p>Olá, {cliente.nome}! Selecione o endereço de entrega:</p>
          
          <div className="enderecos-list">
            {cliente.enderecos.map((endereco, index) => (
              <div key={index} className="endereco-item">
                <div className="endereco-info">
                  <h4>{endereco.tipo} {endereco.principal && '(Principal)'}</h4>
                  <p>
                    {endereco.logradouro}, {endereco.numero}
                    {endereco.complemento && `, ${endereco.complemento}`}
                  </p>
                  <p>{endereco.bairro} - {endereco.cidade}/{endereco.estado}</p>
                  <p>CEP: {endereco.cep}</p>
                </div>
                <button 
                  onClick={() => selecionarEndereco(endereco)}
                  className="btn-primary"
                >
                  Entregar Aqui
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setEtapa(1)}
            className="btn-secondary"
          >
            Voltar
          </button>
        </div>
      )}
      
      {/* Etapa 3: Pagamento */}
      {etapa === 3 && (
        <div className="checkout-step">
          <h3>Forma de Pagamento</h3>
          
          <div className="endereco-confirmacao">
            <h4>Endereço de Entrega:</h4>
            <p>
              {enderecoSelecionado.logradouro}, {enderecoSelecionado.numero}
              {enderecoSelecionado.complemento && `, ${enderecoSelecionado.complemento}`}
            </p>
            <p>{enderecoSelecionado.bairro} - {enderecoSelecionado.cidade}/{enderecoSelecionado.estado}</p>
          </div>
          
          <div className="formas-pagamento">
            <div className="forma-pagamento">
              <label>
                <input
                  type="radio"
                  name="formaPagamento"
                  value="pix"
                  onChange={(e) => setFormaPagamento({ tipo: e.target.value, parcelas: 1 })}
                />
                PIX (5% de desconto)
              </label>
            </div>
            
            <div className="forma-pagamento">
              <label>
                <input
                  type="radio"
                  name="formaPagamento"
                  value="cartao_debito"
                  onChange={(e) => setFormaPagamento({ tipo: e.target.value, parcelas: 1 })}
                />
                Cartão de Débito
              </label>
            </div>
            
            <div className="forma-pagamento">
              <label>
                <input
                  type="radio"
                  name="formaPagamento"
                  value="cartao_credito"
                  onChange={(e) => setFormaPagamento({ tipo: e.target.value, parcelas: 1 })}
                />
                Cartão de Crédito
              </label>
              
              {formaPagamento.tipo === 'cartao_credito' && (
                <div className="parcelas">
                  <label>Parcelas:</label>
                  <select 
                    value={formaPagamento.parcelas}
                    onChange={(e) => setFormaPagamento(prev => ({ ...prev, parcelas: parseInt(e.target.value) }))}
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                      <option key={num} value={num}>
                        {num}x de R$ {(total / num).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="forma-pagamento">
              <label>
                <input
                  type="radio"
                  name="formaPagamento"
                  value="boleto"
                  onChange={(e) => setFormaPagamento({ tipo: e.target.value, parcelas: 1 })}
                />
                Boleto Bancário
              </label>
            </div>
          </div>
          
          <div className="checkout-actions">
            <button 
              onClick={() => setEtapa(2)}
              className="btn-secondary"
            >
              Voltar
            </button>
            
            <button 
              onClick={() => setEtapa(4)}
              disabled={!formaPagamento.tipo}
              className="btn-primary"
            >
              Revisar Pedido
            </button>
          </div>
        </div>
      )}
      
      {/* Etapa 4: Confirmação */}
      {etapa === 4 && (
        <div className="checkout-step">
          <h3>Confirmação do Pedido</h3>
          
          <div className="confirmacao-dados">
            <div className="secao">
              <h4>Cliente:</h4>
              <p>{cliente.nome}</p>
              <p>{cliente.email}</p>
            </div>
            
            <div className="secao">
              <h4>Endereço de Entrega:</h4>
              <p>
                {enderecoSelecionado.logradouro}, {enderecoSelecionado.numero}
                {enderecoSelecionado.complemento && `, ${enderecoSelecionado.complemento}`}
              </p>
              <p>{enderecoSelecionado.bairro} - {enderecoSelecionado.cidade}/{enderecoSelecionado.estado}</p>
              <p>CEP: {enderecoSelecionado.cep}</p>
            </div>
            
            <div className="secao">
              <h4>Forma de Pagamento:</h4>
              <p>
                {formaPagamento.tipo === 'pix' && 'PIX'}
                {formaPagamento.tipo === 'cartao_debito' && 'Cartão de Débito'}
                {formaPagamento.tipo === 'cartao_credito' && `Cartão de Crédito - ${formaPagamento.parcelas}x`}
                {formaPagamento.tipo === 'boleto' && 'Boleto Bancário'}
              </p>
            </div>
          </div>
          
          <div className="checkout-actions">
            <button 
              onClick={() => setEtapa(3)}
              className="btn-secondary"
            >
              Voltar
            </button>
            
            <button 
              onClick={finalizarPedido}
              disabled={loading}
              className="btn-primary btn-finalizar"
            >
              {loading ? 'Finalizando...' : 'Finalizar Pedido'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;