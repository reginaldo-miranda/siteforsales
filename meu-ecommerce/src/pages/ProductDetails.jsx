import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/produtos/${id}`)
      .then(res => {
        setProduto(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar produto:", err);
        setError("Não foi possível carregar os detalhes do produto. Tente novamente mais tarde.");
        setLoading(false);
      });
  }, [id]);

  const handleQuantidadeChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantidade(value);
    }
  };

  const adicionarAoCarrinho = () => {
    if (!produto) return;

    // Buscar o carrinho atual do localStorage
    const carrinhoAtual = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Verificar se o produto já está no carrinho
    const itemExistente = carrinhoAtual.find(item => item._id === produto._id);
    
    let novoCarrinho;
    
    if (itemExistente) {
      // Atualizar a quantidade se o produto já estiver no carrinho
      novoCarrinho = carrinhoAtual.map(item => 
        item._id === produto._id 
          ? { ...item, quantidade: item.quantidade + quantidade } 
          : item
      );
    } else {
      // Adicionar novo item ao carrinho
      novoCarrinho = [
        ...carrinhoAtual, 
        { 
          _id: produto._id, 
          nome: produto.nome, 
          preco: produto.preco, 
          quantidade: quantidade 
        }
      ];
    }
    
    // Salvar o carrinho atualizado no localStorage
    localStorage.setItem('cart', JSON.stringify(novoCarrinho));
    
    // Redirecionar para a página do carrinho ou mostrar mensagem de sucesso
    alert('Produto adicionado ao carrinho!');
  };

  if (loading) return <div className="loading">Carregando detalhes do produto...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!produto) return <div className="error">Produto não encontrado</div>;

  return (
    <div className="product-details-container">
      <div className="product-details">
        <div className="product-image-container">
          {produto.imagem ? (
            <img 
              src={produto.imagem} 
              alt={produto.nome} 
              className="product-image" 
            />
          ) : (
            <div className="no-image">Imagem não disponível</div>
          )}
        </div>
        
        <div className="product-info">
          <h2>{produto.nome}</h2>
          <p className="product-price">R$ {produto.preco.toFixed(2)}</p>
          
          <div className="product-description">
            <h3>Descrição</h3>
            <p>{produto.descricao}</p>
          </div>
          
          <div className="product-stock">
            {produto.estoque > 0 ? (
              <p className="in-stock">Em estoque: {produto.estoque} unidades</p>
            ) : (
              <p className="out-of-stock">Fora de estoque</p>
            )}
          </div>
          
          {produto.estoque > 0 && (
            <div className="add-to-cart">
              <div className="quantity-selector">
                <label htmlFor="quantidade">Quantidade:</label>
                <input 
                  type="number" 
                  id="quantidade" 
                  min="1" 
                  max={produto.estoque} 
                  value={quantidade} 
                  onChange={handleQuantidadeChange} 
                />
              </div>
              
              <button 
                onClick={adicionarAoCarrinho} 
                className="add-to-cart-btn"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          )}
          
          <div className="navigation-links">
            <Link to="/produtos" className="back-to-products">
              ← Voltar para Produtos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
