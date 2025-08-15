import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const PedidoConfirmado = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pedido = location.state?.pedido;
  
  useEffect(() => {
    if (!pedido) {
      navigate('/');
    }
  }, [pedido, navigate]);
  
  if (!pedido) {
    return null;
  }
  
  return (
    <div className="pedido-confirmado-container">
      <div className="success-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <h1>Pedido Confirmado!</h1>
      <p className="success-message">
        Obrigado pela sua compra! Seu pedido foi recebido e está sendo processado.
      </p>
      
      <div className="pedido-info">
        <h2>Detalhes do Pedido</h2>
        
        <div className="info-row">
          <span className="label">Número do Pedido:</span>
          <span className="value">#{pedido.numero}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Data do Pedido:</span>
          <span className="value">{new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Total:</span>
          <span className="value total">R$ {pedido.total.toFixed(2)}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Status:</span>
          <span className="value status">{pedido.status}</span>
        </div>
      </div>
      
      <div className="pedido-itens">
        <h3>Itens do Pedido</h3>
        {pedido.itens.map((item, index) => (
          <div key={index} className="item-pedido">
            <div className="item-info">
              <h4>{item.produto.nome}</h4>
              <p>Quantidade: {item.quantidade}</p>
              <p>Preço unitário: R$ {item.precoUnitario.toFixed(2)}</p>
            </div>
            <div className="item-total">
              R$ {item.subtotal.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="endereco-entrega">
        <h3>Endereço de Entrega</h3>
        <p>
          {pedido.enderecoEntrega.logradouro}, {pedido.enderecoEntrega.numero}
          {pedido.enderecoEntrega.complemento && `, ${pedido.enderecoEntrega.complemento}`}
        </p>
        <p>{pedido.enderecoEntrega.bairro} - {pedido.enderecoEntrega.cidade}/{pedido.enderecoEntrega.estado}</p>
        <p>CEP: {pedido.enderecoEntrega.cep}</p>
      </div>
      
      <div className="forma-pagamento">
        <h3>Forma de Pagamento</h3>
        <p>
          {pedido.formaPagamento.tipo === 'pix' && 'PIX'}
          {pedido.formaPagamento.tipo === 'cartao_debito' && 'Cartão de Débito'}
          {pedido.formaPagamento.tipo === 'cartao_credito' && `Cartão de Crédito - ${pedido.formaPagamento.parcelas}x`}
          {pedido.formaPagamento.tipo === 'boleto' && 'Boleto Bancário'}
        </p>
      </div>
      
      <div className="next-steps">
        <h3>Próximos Passos</h3>
        <ul>
          <li>Você receberá um email de confirmação em breve</li>
          <li>Acompanhe o status do seu pedido através do WhatsApp</li>
          <li>A nota fiscal será enviada por email após o processamento</li>
          <li>O prazo de entrega será informado via email e WhatsApp</li>
        </ul>
      </div>
      
      <div className="actions">
        <Link to="/" className="btn-primary">
          Continuar Comprando
        </Link>
        <Link to="/produtos" className="btn-secondary">
          Ver Mais Produtos
        </Link>
      </div>
      
      <div className="contact-info">
        <p>Dúvidas? Entre em contato conosco:</p>
        <p>📧 contato@ecommerce.com</p>
        <p>📱 WhatsApp: (11) 99999-9999</p>
      </div>
    </div>
  );
};

export default PedidoConfirmado;