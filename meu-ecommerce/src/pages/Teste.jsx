import React from 'react';
import { Link } from 'react-router-dom';

const Teste = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Página de Teste - Verificação de Botões</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Teste de Botões</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button className="btn btn-primary">Botão Primary</button>
          <button className="btn btn-secondary">Botão Secondary</button>
          <button className="btn btn-success">Botão Success</button>
          <button className="btn btn-danger">Botão Danger</button>
          <button className="btn btn-warning">Botão Warning</button>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/produtos" className="btn btn-primary">Link para Produtos</Link>
          <Link to="/admin/clientes" className="btn btn-secondary">Link para Clientes</Link>
          <Link to="/admin/pedidos" className="btn btn-success">Link para Pedidos</Link>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Teste de Header</h2>
        <div className="admin-header">
          <h1>Título do Header</h1>
          <div className="admin-actions">
            <Link to="/admin-dashboard" className="btn btn-primary">
              Adicionar Item
            </Link>
            <Link to="/admin-dashboard" className="btn btn-secondary">
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Teste de Tabela</h2>
        <div className="produtos-table">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Produto Teste</td>
                <td>R$ 99,99</td>
                <td className="actions">
                  <button className="btn btn-info btn-sm">Ver</button>
                  <button className="btn btn-warning btn-sm">Editar</button>
                  <button className="btn btn-danger btn-sm">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h2>Links de Navegação</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/admin-dashboard">Dashboard</Link>
          <Link to="/admin/produtos">Produtos</Link>
          <Link to="/admin/clientes">Clientes</Link>
          <Link to="/admin/pedidos">Pedidos</Link>
          <Link to="/admin/usuarios">Usuários</Link>
          <Link to="/admin">Opções</Link>
        </div>
      </div>
    </div>
  );
};

export default Teste;

