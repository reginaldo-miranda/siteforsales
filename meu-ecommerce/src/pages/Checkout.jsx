import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Estados para dados do cliente
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    email: '',
    telefone1: '',
    telefone2: '',
    cpfCnpj: '',
    rgInscricao: '',
    tipoDocumento: 'cpf' // 'cpf' ou 'cnpj'
  });
  
  // Estados para dados de entrega
  const [dadosEntrega, setDadosEntrega] = useState({
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    codigoIbge: ''
  });
  
  // Estado para forma de pagamento
  const [formaPagamento, setFormaPagamento] = useState('');
  
  // Estados para dados do cartão
  const [dadosCartao, setDadosCartao] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: ''
  });

  useEffect(() => {
    // Carregar itens do carrinho
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      
      // Calcular o total
      const cartTotal = parsedCart.reduce(
        (sum, item) => sum + item.preco * item.quantidade, 
        0
      );
      setTotal(cartTotal);
    } else {
      // Se não há itens no carrinho, redirecionar
      navigate('/carrinho');
    }
  }, [navigate]);

  const handleClienteChange = (e) => {
    setDadosCliente({
      ...dadosCliente,
      [e.target.name]: e.target.value
    });
  };

  const handleEntregaChange = (e) => {
    let value = e.target.value;
    
    // Formatação automática do CEP
    if (e.target.name === 'cep') {
      value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (value.length <= 8) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona hífen
      }
    }
    
    setDadosEntrega({
      ...dadosEntrega,
      [e.target.name]: value
    });
  };

  const handleCartaoChange = (e) => {
    setDadosCartao({
      ...dadosCartao,
      [e.target.name]: e.target.value
    });
  };



  const buscarCEP = async () => {
    const cepLimpo = dadosEntrega.cep.replace(/\D/g, '');
    
    if (cepLimpo.length === 8) {
      setLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setDadosEntrega({
            ...dadosEntrega,
            cep: cepLimpo,
            endereco: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
            codigoIbge: data.ibge || ''
          });
        } else {
          alert('CEP não encontrado. Verifique o número digitado.');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Verifique sua conexão com a internet.');
      } finally {
        setLoading(false);
      }
    }
  };

  const validarFormulario = () => {
    // Validar dados do cliente
    if (!dadosCliente.nome || !dadosCliente.email || !dadosCliente.telefone1 || !dadosCliente.cpfCnpj || !dadosCliente.rgInscricao) {
      alert('Por favor, preencha todos os dados pessoais obrigatórios.');
      return false;
    }
    
    // Validar dados de entrega
    if (!dadosEntrega.cep || !dadosEntrega.endereco || !dadosEntrega.numero || 
        !dadosEntrega.bairro || !dadosEntrega.cidade || !dadosEntrega.estado) {
      alert('Por favor, preencha todos os dados de entrega.');
      return false;
    }
    
    // Validar forma de pagamento
    if (!formaPagamento) {
      alert('Por favor, selecione uma forma de pagamento.');
      return false;
    }
    
    // Validar dados do cartão se necessário
    if ((formaPagamento === 'credito' || formaPagamento === 'debito') && 
        (!dadosCartao.numero || !dadosCartao.nome || !dadosCartao.validade || !dadosCartao.cvv)) {
      alert('Por favor, preencha todos os dados do cartão.');
      return false;
    }
    
    return true;
  };

  const finalizarPedido = async () => {
    if (!validarFormulario()) return;
    
    setLoading(true);
    
    try {
      // Simular processamento do pedido
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Limpar carrinho
      localStorage.removeItem('cart');
      
      // Atualizar contador do carrinho
      if (window.updateCartDisplay) {
        window.updateCartDisplay();
      }
      
      alert('Pedido realizado com sucesso! Você receberá um email de confirmação.');
      navigate('/');
    } catch {
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Carrinho Vazio</h2>
        <p>Adicione produtos ao carrinho antes de finalizar a compra.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      
      {/* Resumo do Pedido */}
      <div className="order-summary">
        <h3>Resumo do Pedido</h3>
        <div className="order-items">
          {cartItems.map(item => (
            <div key={item._id} className="order-item">
              <span>{item.nome}</span>
              <span>Qtd: {item.quantidade}</span>
              <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="order-total">
          <strong>Total: R$ {total.toFixed(2)}</strong>
        </div>
      </div>

      {/* Dados do Cliente */}
      <div className="checkout-section">
        <h3>Dados Pessoais</h3>
        <div className="form-grid">
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            value={dadosCliente.nome}
            onChange={handleClienteChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={dadosCliente.email}
            onChange={handleClienteChange}
            required
          />
          <input
            type="tel"
            name="telefone1"
            placeholder="Telefone principal"
            value={dadosCliente.telefone1}
            onChange={handleClienteChange}
            required
          />
          <input
            type="tel"
            name="telefone2"
            placeholder="Telefone secundário (opcional)"
            value={dadosCliente.telefone2}
            onChange={handleClienteChange}
          />
          <div className="document-type-group">
            <select
              name="tipoDocumento"
              value={dadosCliente.tipoDocumento}
              onChange={handleClienteChange}
              required
            >
              <option value="cpf">CPF</option>
              <option value="cnpj">CNPJ</option>
            </select>
            <input
              type="text"
              name="cpfCnpj"
              placeholder={dadosCliente.tipoDocumento === 'cpf' ? 'CPF' : 'CNPJ'}
              value={dadosCliente.cpfCnpj}
              onChange={handleClienteChange}
              required
            />
          </div>
          <input
            type="text"
            name="rgInscricao"
            placeholder={dadosCliente.tipoDocumento === 'cpf' ? 'RG' : 'Inscrição Estadual'}
            value={dadosCliente.rgInscricao}
            onChange={handleClienteChange}
            required
          />
        </div>
      </div>

      {/* Dados de Entrega */}
      <div className="checkout-section">
        <h3>Endereço de Entrega</h3>
        <div className="form-grid">
          <div className="cep-group">
            <input
              type="text"
              name="cep"
              placeholder="CEP (ex: 12345-678)"
              value={dadosEntrega.cep}
              onChange={handleEntregaChange}
              onBlur={buscarCEP}
              maxLength="9"
              required
            />
            {loading && <span className="cep-loading">Buscando...</span>}
          </div>
          <input
            type="text"
            name="endereco"
            placeholder="Endereço"
            value={dadosEntrega.endereco}
            onChange={handleEntregaChange}
            required
          />
          <input
            type="text"
            name="numero"
            placeholder="Número"
            value={dadosEntrega.numero}
            onChange={handleEntregaChange}
            required
          />
          <input
            type="text"
            name="complemento"
            placeholder="Complemento (opcional)"
            value={dadosEntrega.complemento}
            onChange={handleEntregaChange}
          />
          <input
            type="text"
            name="bairro"
            placeholder="Bairro"
            value={dadosEntrega.bairro}
            onChange={handleEntregaChange}
            required
          />
          <input
            type="text"
            name="cidade"
            placeholder="Cidade"
            value={dadosEntrega.cidade}
            onChange={handleEntregaChange}
            required
          />
          <input
            type="text"
            name="estado"
            placeholder="Estado"
            value={dadosEntrega.estado}
            onChange={handleEntregaChange}
            required
          />
          <input
            type="text"
            name="codigoIbge"
            placeholder="Código IBGE"
            value={dadosEntrega.codigoIbge}
            onChange={handleEntregaChange}
          />
        </div>
      </div>

      {/* Forma de Pagamento */}
      <div className="checkout-section">
        <h3>Forma de Pagamento</h3>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="pagamento"
              value="credito"
              checked={formaPagamento === 'credito'}
              onChange={(e) => setFormaPagamento(e.target.value)}
            />
            Cartão de Crédito
          </label>
          <label>
            <input
              type="radio"
              name="pagamento"
              value="debito"
              checked={formaPagamento === 'debito'}
              onChange={(e) => setFormaPagamento(e.target.value)}
            />
            Cartão de Débito
          </label>
          <label>
            <input
              type="radio"
              name="pagamento"
              value="pix"
              checked={formaPagamento === 'pix'}
              onChange={(e) => setFormaPagamento(e.target.value)}
            />
            PIX
          </label>
          <label>
            <input
              type="radio"
              name="pagamento"
              value="boleto"
              checked={formaPagamento === 'boleto'}
              onChange={(e) => setFormaPagamento(e.target.value)}
            />
            Boleto Bancário
          </label>
        </div>

        {/* Dados do Cartão */}
        {(formaPagamento === 'credito' || formaPagamento === 'debito') && (
          <div className="card-details">
            <h4>Dados do Cartão</h4>
            <div className="form-grid">
              <input
                 type="text"
                 name="numero"
                placeholder="Número do Cartão"
                value={dadosCartao.numero}
                onChange={handleCartaoChange}
                maxLength="19"
                required
              />
              <input
                type="text"
                name="nome"
                placeholder="Nome no Cartão"
                value={dadosCartao.nome}
                onChange={handleCartaoChange}
                required
              />
              <input
                type="text"
                name="validade"
                placeholder="MM/AA"
                value={dadosCartao.validade}
                onChange={handleCartaoChange}
                maxLength="5"
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={dadosCartao.cvv}
                onChange={handleCartaoChange}
                maxLength="4"
                required
              />
            </div>
          </div>
        )}

      </div>

      {/* Botões de Ação */}
      <div className="checkout-actions">
        <button 
          onClick={() => navigate('/carrinho')} 
          className="btn-secondary"
        >
          Voltar ao Carrinho
        </button>
        <button 
          onClick={finalizarPedido} 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Finalizar Pedido'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;