import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<ProductList />} />
          <Route path="/produtos/:id" element={<ProductDetails />} />
          <Route path="/carrinho" element={<Cart />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
