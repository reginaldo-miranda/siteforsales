import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const NotaFiscal = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [notaFiscal, setNotaFiscal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gerando, setGerando] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está logado como admin
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      navigate('/login-admin');
      return;
    }
    
    carregarDados();
  }, [pedidoId, navigate]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [pedidoRes, notaRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/pedidos/${pedidoId}`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/nota-fiscal/${pedidoId}`).catch(() => null)
      ]);
      
      setPedido(pedidoRes.data);
      if (notaRes?.data) {
        setNotaFiscal(notaRes.data);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados do pedido');
    } finally {
      setLoading(false);
    }
  };

  const gerarNotaFiscal = async () => {
    try {
      setGerando(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/nota-fiscal`, {
        pedidoId: pedidoId
      });
      
      setNotaFiscal(response.data);
      alert('Nota fiscal gerada com sucesso!');
    } catch (err) {
      console.error('Erro ao gerar nota fiscal:', err);
      alert('Erro ao gerar nota fiscal.');
    } finally {
      setGerando(false);
    }
  };

  const imprimirNota = () => {
    window.print();
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!pedido) return <div className="error">Pedido não encontrado</div>;

  return (
    <div className="nota-fiscal-page">
      <div className="nota-fiscal-header no-print">
        <h1>Nota Fiscal - Pedido #{pedido.numero}</h1>
        <div className="actions">
          {!notaFiscal ? (
            <button 
              onClick={gerarNotaFiscal}
              disabled={gerando}
              className="btn btn-primary"
            >
              {gerando ? 'Gerando...' : 'Gerar Nota Fiscal'}
            </button>
          ) : (
            <button onClick={imprimirNota} className="btn btn-success">
              Imprimir Nota
            </button>
          )}
          <Link to="/admin/pedidos" className="btn btn-secondary">
            Voltar aos Pedidos
          </Link>
        </div>
      </div>

      {notaFiscal ? (
        <div className="nota-fiscal-content">
          <div className="nota-fiscal-header-print">
            <h2>NOTA FISCAL ELETRÔNICA</h2>
            <div className="empresa-info">
              <h3>Meu E-commerce LTDA</h3>
              <p>CNPJ: 12.345.678/0001-90</p>
              <p>Endereço: Rua das Empresas, 123 - Centro</p>
              <p>CEP: 12345-678 - São Paulo/SP</p>
              <p>Telefone: (11) 1234-5678</p>
            </div>
          </div>

          <div className="nota-fiscal-info">
            <div className="info-grid">
              <div className="info-item">
                <strong>Número da NF:</strong> {notaFiscal.numero}
              </div>
              <div className="info-item">
                <strong>Data de Emissão:</strong> {new Date(notaFiscal.dataEmissao).toLocaleDateString('pt-BR')}
              </div>
              <div className="info-item">
                <strong>Chave de Acesso:</strong> {notaFiscal.chaveAcesso}
              </div>
            </div>
          </div>

          <div className="cliente-info">
            <h4>DADOS DO DESTINATÁRIO</h4>
            <div className="cliente-grid">
              <div><strong>Nome:</strong> {pedido.cliente.nome}</div>
              <div><strong>CPF:</strong> {pedido.cliente.cpf}</div>
              <div><strong>Email:</strong> {pedido.cliente.email}</div>
              <div><strong>Telefone:</strong> {pedido.cliente.telefone}</div>
              <div className="endereco">
                <strong>Endereço:</strong> {pedido.enderecoEntrega.rua}, {pedido.enderecoEntrega.numero} - 
                {pedido.enderecoEntrega.bairro}, {pedido.enderecoEntrega.cidade}/{pedido.enderecoEntrega.estado} - 
                CEP: {pedido.enderecoEntrega.cep}
              </div>
            </div>
          </div>

          <div className="produtos-info">
            <h4>PRODUTOS/SERVIÇOS</h4>
            <table className="produtos-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Qtd</th>
                  <th>Valor Unit.</th>
                  <th>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {pedido.itens.map((item, index) => (
                  <tr key={index}>
                    <td>{item.produto._id.slice(-6)}</td>
                    <td>{item.produto.nome}</td>
                    <td>{item.quantidade}</td>
                    <td>R$ {item.preco.toFixed(2)}</td>
                    <td>R$ {(item.quantidade * item.preco).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="totais-info">
            <div className="totais-grid">
              <div className="total-item">
                <strong>Subtotal:</strong> R$ {pedido.subtotal.toFixed(2)}
              </div>
              <div className="total-item">
                <strong>Frete:</strong> R$ {pedido.frete.toFixed(2)}
              </div>
              <div className="total-item total-final">
                <strong>TOTAL GERAL:</strong> R$ {pedido.total.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="pagamento-info">
            <h4>FORMA DE PAGAMENTO</h4>
            <p>{pedido.formaPagamento.tipo} - {pedido.formaPagamento.detalhes}</p>
          </div>

          <div className="observacoes">
            <h4>OBSERVAÇÕES</h4>
            <p>Nota fiscal emitida nos termos da legislação vigente.</p>
            <p>Consulte a autenticidade desta NF-e no site da SEFAZ.</p>
          </div>
        </div>
      ) : (
        <div className="sem-nota">
          <h3>Nota fiscal não gerada</h3>
          <p>Clique em "Gerar Nota Fiscal" para criar a nota fiscal deste pedido.</p>
          
          <div className="pedido-resumo">
            <h4>Resumo do Pedido</h4>
            <p><strong>Cliente:</strong> {pedido.cliente.nome}</p>
            <p><strong>Data:</strong> {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</p>
            <p><strong>Total:</strong> R$ {pedido.total.toFixed(2)}</p>
            <p><strong>Status:</strong> {pedido.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotaFiscal;