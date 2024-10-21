import { Link } from "react-router-dom";
import { ShoppingCartOutlined } from '@ant-design/icons'; // Import Ant Design icon
import { useContext } from 'react'; // Import useContext to use CartContext
import { CartContext } from '../context/CartContext'; // Import CartContext
import '../style/style.css';

const Header = () => {
  const { cartCount } = useContext(CartContext); // Get cartCount from CartContext

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        E-Commerce
      </Link>
      <nav className="header-nav">
        <Link to="/" className="header-nav-item">Home</Link>
        <Link to="/shop" className="header-nav-item">Shop</Link>
        <Link to="/womens" className="header-nav-item">Women's</Link>
        <Link to="/mens" className="header-nav-item">Men's</Link>
        <Link to="/kids" className="header-nav-item">Kids</Link>
        
        <Link to="/cart" className="header-cart">
          <ShoppingCartOutlined className="header-cart-icon" />
          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </Link>
      </nav>

      {/* Uncomment for Login Button if needed */}
      {/* <Link to="/login" className="header-login-button">Login</Link> */}
    </header>
  );
};

export default Header;
