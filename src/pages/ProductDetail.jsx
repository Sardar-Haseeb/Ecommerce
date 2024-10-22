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
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-grid">
        <div className="product-image-container">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        </div>
        <div className="product-details-container">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-price">Price: ${product.price}</p>
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={addedToCart} // Disable button if product is added
          >
            {addedToCart ? 'Added to Cart' : 'Add to Cart'}
          </button>
          {addedToCart && <p className="success-message">Product added to cart!</p>} {/* Success message */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
