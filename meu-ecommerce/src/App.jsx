import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import ProductForm from './pages/ProductForm';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import './App.css';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="app">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <SideMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<ProductList />} />
          <Route path="/produtos/:id" element={<ProductDetails />} />
          <Route path="/produtos/novo" element={<ProductForm />} />
          <Route path="/produtos/editar/:id" element={<ProductForm />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
