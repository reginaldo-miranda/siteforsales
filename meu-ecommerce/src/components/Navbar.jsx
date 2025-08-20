import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Atualizar contagem de itens do carrinho quando o componente montar
    updateCartCount();

    // Adicionar event listener para atualizar quando o localStorage mudar
    window.addEventListener('storage', updateCartCount);
    
    // Adicionar event listener personalizado para atualizações do carrinho
    window.addEventListener('cartUpdated', updateCartCount);

    // Cleanup
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantidade, 0);
    setCartCount(count);
  };

  // Função utilitária para disparar evento de atualização do carrinho
  // Esta função pode ser chamada de outras partes da aplicação
  window.updateCartDisplay = () => {
    window.dispatchEvent(new Event('cartUpdated'));
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