// src/pages/ProductDetail.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CartContext } from '../context/CartContext'; // Import CartContext

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext); // Use CartContext
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false); // State to track if product is added to cart

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = doc(db, 'products', id);
        const productSnapshot = await getDoc(productDoc);

        if (productSnapshot.exists()) {
          setProduct({ id: productSnapshot.id, ...productSnapshot.data() });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product); // Call addToCart from context
      setAddedToCart(true); // Set the state to true
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading product details...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.productDetailContainer}>
      <div style={styles.productDetailGrid}>
        <div style={styles.productImageContainer}>
          <img src={product.imageUrl} alt={product.name} style={styles.productImage} />
        </div>
        <div style={styles.productDetailsContainer}>
          <h1 style={styles.productName}>{product.name}</h1>
          <p style={styles.productPrice}>Price: ${product.price}</p>
          <p style={styles.productDescription}>{product.description}</p>

          <button
            style={styles.addToCartButton}
            onClick={handleAddToCart}
            disabled={addedToCart} // Disable button if product is added
          >
            {addedToCart ? 'Added to Cart' : 'Add to Cart'}
          </button>
          {addedToCart && <p style={styles.successMessage}>Product added to cart!</p>} {/* Success message */}
        </div>
      </div>
    </div>
  );
};

// Define inline styles
const styles = {
  productDetailContainer: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  productDetailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  productImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  productDetailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  productName: {
    fontSize: '24px',
    margin: '0 0 10px',
    color: '#333',
  },
  productPrice: {
    fontSize: '20px',
    margin: '0 0 15px',
    color: '#333',
  },
  productDescription: {
    fontSize: '16px',
    margin: '0 0 20px',
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#5cb85c',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.2s',
  },
  successMessage: {
    marginTop: '10px',
    color: '#5cb85c',
  },
  loading: {
    textAlign: 'center',
    fontSize: '20px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '20px',
  },
};

export default ProductDetail;
