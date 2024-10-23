// src/pages/Cart.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // Import the CartContext

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const styles = {
    cartPage: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f8f8f8',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
      textAlign: 'center',
      fontSize: '28px',
      color: '#333',
    },
    cartItems: {
      marginTop: '20px',
    },
    cartItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      marginBottom: '15px',
      backgroundColor: 'white',
      transition: 'box-shadow 0.2s',
    },
    itemDetails: {
      display: 'flex',
      alignItems: 'center',
    },
    itemImage: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      marginRight: '15px',
      borderRadius: '4px',
    },
    itemInfo: {
      flexGrow: 1,
    },
    quantityInput: {
      width: '60px',
      marginLeft: '10px',
      padding: '5px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    removeButton: {
      backgroundColor: '#d9534f',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    removeButtonHover: {
      backgroundColor: '#c9302c',
    },
    cartTotal: {
      marginTop: '20px',
      textAlign: 'center',
    },
    checkoutButton: {
      backgroundColor: '#5cb85c',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    emptyCart: {
      textAlign: 'center',
      fontSize: '20px',
      color: '#666',
      padding: '50px',
    },
  };

  if (cartItems.length === 0) {
    return <div style={styles.emptyCart}>Your cart is empty</div>;
  }

  return (
    <div style={styles.cartPage}>
      <h2 style={styles.header}>Your Cart</h2>
      <div style={styles.cartItems}>
        {cartItems.map((item) => (
          <div key={item.id} style={styles.cartItem}>
            <div style={styles.itemDetails}>
              <img src={item.imageUrl} alt={item.name} style={styles.itemImage} />
              <div style={styles.itemInfo}>
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>
                  Quantity:
                  <input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    min="1"
                    style={styles.quantityInput}
                  />
                </p>
              </div>
            </div>
            <button 
              style={styles.removeButton} 
              onClick={() => removeFromCart(item.id)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.removeButtonHover.backgroundColor} 
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.removeButton.backgroundColor}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div style={styles.cartTotal}>
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
        <Link to="/checkout" state={{ totalPrice }}>
          <button style={styles.checkoutButton}>Proceed to Checkout</button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
