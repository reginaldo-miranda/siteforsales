import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/produtos`)
      .then(res => {
        setProdutos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar produtos:', err);
        setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Carregando produtos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <h1>Bem-vindo à nossa loja!</h1>
      
      <div className="featured-products">
        <h2>Produtos em Destaque</h2>
        
        {produtos.length === 0 ? (
          <p>Nenhum produto disponível no momento.</p>
        ) : (
          <div className="products-grid">
            {produtos.map(produto => (
              <div key={produto._id} className="product-card">
                {produto.imagem && (
                  <img 
                    src={produto.imagem} 
                    alt={produto.nome} 
                    className="product-image" 
                  />
                )}
                <h3>{produto.nome}</h3>
                <p className="product-price">R$ {produto.preco.toFixed(2)}</p>
                <Link to={`/produtos/${produto._id}`} className="view-details-btn">
                  Ver detalhes
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
