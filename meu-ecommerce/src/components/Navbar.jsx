import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Atualizar contagem de itens do carrinho quando o componente montar
    updateCartCount();

    // Adicionar event listener para atualizar quando o localStorage mudar
    window.addEventListener('storage', updateCartCount);

    // Cleanup
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantidade, 0);
    setCartCount(count);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Meu E-commerce
        </Link>

        <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/produtos" className="nav-link" onClick={() => setIsMenuOpen(false)}>Produtos</Link>
          </li>
        </ul>

        <div className="navbar-right">
          <Link to="/carrinho" className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          
          <div className="hamburger" onClick={toggleMenu}>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;