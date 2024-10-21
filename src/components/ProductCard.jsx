// src/components/ProductCard.jsx
import React from 'react';
import './ProductCard.css';


const ProductCard = ({ product, onAddToCart, onCardClick }) => {
  return (
    <div className="product-card" onClick={() => onCardClick(product.id)}>
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price}</p>
      <button className="add-to-cart-btn" onClick={(e) => {
        e.stopPropagation(); // Prevent card click when adding to cart
        onAddToCart(product);
      }}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
