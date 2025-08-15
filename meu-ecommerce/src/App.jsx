import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import ProductForm from './pages/ProductForm';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PedidoConfirmado from './pages/PedidoConfirmado';
import LoginAdmin from './pages/LoginAdmin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProdutos from './pages/AdminProdutos';
import AdminPedidos from './pages/AdminPedidos';
import AdminClientes from './pages/AdminClientes';
import AdminUsuarios from './pages/AdminUsuarios';
import NotaFiscal from './pages/NotaFiscal';
import ClienteForm from './pages/ClienteForm';
import PedidoForm from './pages/PedidoForm';
import Teste from './pages/Teste';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/home" element={<Home />} />
        <Route path="/produtos" element={<ProductList />} />
        <Route path="/produto/:id" element={<ProductDetails />} />
        <Route path="/admin/produto/novo" element={<ProductForm />} />
        <Route path="/admin/produto/editar/:id" element={<ProductForm />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/produtos" element={<AdminProdutos />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        <Route path="/admin/clientes" element={<AdminClientes />} />
        <Route path="/admin/cliente/novo" element={<ClienteForm />} />
        <Route path="/admin/cliente/editar/:id" element={<ClienteForm />} />
        <Route path="/admin/pedido/novo" element={<PedidoForm />} />
        <Route path="/admin/pedido/editar/:id" element={<PedidoForm />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/admin/nota-fiscal/:pedidoId" element={<NotaFiscal />} />
        <Route path="/teste" element={<Teste />} />
      </Routes>
    </div>
  );
}

export default App;
