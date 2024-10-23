// src/pages/Shop.jsx
import React, { useContext, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <div style={{
        fontSize: '18px',
        color: '#333',
        textAlign: 'center',
        padding: '20px',
        marginTop: '50px'
      }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        fontSize: '18px',
        color: 'red',
        textAlign: 'center',
        padding: '20px',
        marginTop: '50px'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f8f8f8',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#333'
      }}>
        Shop
      </h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {products.map(product => (
          <div 
            key={product.id} 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onClick={() => handleCardClick(product.id)}
          >
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }} 
            />
            <div style={{ padding: '15px' }}>
              <h3 style={{
                fontWeight: '600',
                fontSize: '18px',
                margin: '10px 0',
                color: '#333'
              }}>
                {product.name}
              </h3>
              <p style={{
                color: '#666',
                fontSize: '16px',
                margin: '5px 0'
              }}>
                ${product.price}
              </p>
              <button 
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  addToCart(product);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
