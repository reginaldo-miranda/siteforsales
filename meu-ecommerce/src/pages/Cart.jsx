import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Carregar itens do carrinho do localStorage
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
    }
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item._id === id ? { ...item, quantidade: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Recalcular o total
    const newTotal = updatedCart.reduce(
      (sum, item) => sum + item.preco * item.quantidade, 
      0
    );
    setTotal(newTotal);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Recalcular o total
    const newTotal = updatedCart.reduce(
      (sum, item) => sum + item.preco * item.quantidade, 
      0
    );
    setTotal(newTotal);
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    localStorage.removeItem('cart');
  };

  const irParaCheckout = () => {
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <h2>Carrinho de Compras</h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio</p>
          <Link to="/produtos" className="continue-shopping-btn">
            Continuar Comprando
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-info">
                  <h3>{item.nome}</h3>
                  <p className="item-price">R$ {item.preco.toFixed(2)}</p>
                </div>
                
                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantidade - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span>{item.quantidade}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantidade + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  <p>R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                </div>
                
                <button 
                  onClick={() => removeItem(item._id)}
                  className="remove-btn"
                  title="Remover item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-total">
              <h3>Total</h3>
              <p>R$ {total.toFixed(2)}</p>
            </div>
            
            <div className="cart-actions">
              <button onClick={clearCart} className="clear-cart-btn">
                Limpar Carrinho
              </button>
              <button onClick={irParaCheckout} className="checkout-btn">
                Finalizar Compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
