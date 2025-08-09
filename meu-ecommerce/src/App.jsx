import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import ProductForm from './pages/ProductForm';
import Admin from './pages/Admin';
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
          <Route path="/produtos/novo" element={<ProductForm />} />
          <Route path="/produtos/editar/:id" element={<ProductForm />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/carrinho" element={<Cart />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
