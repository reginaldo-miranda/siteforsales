import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SideMenu.css';

const SideMenu = ({ isOpen, setIsOpen }) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const subMenuProdutos = [
    { nome: 'Listar Produtos', path: '/produtos' },
    { nome: 'Cadastrar Produto', path: '/produtos/novo' },
    { nome: 'Cadastro Auxiliar', path: '/admin' }
  ];

  const subMenuFornecedores = [
    { nome: 'Listar Fornecedores', path: '/fornecedores' },
    { nome: 'Cadastrar Fornecedor', path: '/fornecedores/novo' }
  ];

  return (
    <div className={`side-menu ${isOpen ? 'open' : ''}`}>
      <div className="menu-content" style={{display: isOpen ? 'block' : 'none'}}>
        <div className="menu-header">
          <h3>Menu</h3>
          <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
        </div>
        <ul className="menu-list">
          <li className="menu-item">
            <Link to="/" className="menu-link" onClick={() => setIsOpen(false)}>
              <span>Home</span>
            </Link>
          </li>
          <li className="menu-item">
            <div className="menu-item-with-submenu">
              <button 
                className="menu-link submenu-toggle" 
                onClick={() => toggleSubmenu('produtos')}
              >
                <span>Produtos</span>
                <i className={`fas fa-chevron-${expandedMenus.produtos ? 'up' : 'down'}`}></i>
              </button>
              <ul className={`submenu ${expandedMenus.produtos ? 'expanded' : ''}`}>
                 {subMenuProdutos.map((item, index) => (
                   <li key={index} className="submenu-item">
                     <Link to={item.path} className="submenu-link" onClick={() => setIsOpen(false)}>
                       {item.nome}
                     </Link>
                   </li>
                 ))}
               </ul>
            </div>
          </li>
          <li className="menu-item">
            <div className="menu-item-with-submenu">
              <button 
                className="menu-link submenu-toggle" 
                onClick={() => toggleSubmenu('fornecedores')}
              >
                <span>Fornecedores</span>
                <i className={`fas fa-chevron-${expandedMenus.fornecedores ? 'up' : 'down'}`}></i>
              </button>
              <ul className={`submenu ${expandedMenus.fornecedores ? 'expanded' : ''}`}>
                 {subMenuFornecedores.map((item, index) => (
                   <li key={index} className="submenu-item">
                     <Link to={item.path} className="submenu-link" onClick={() => setIsOpen(false)}>
                       {item.nome}
                     </Link>
                   </li>
                 ))}
               </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;