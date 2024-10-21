// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Mens from "./pages/Mens";
import Womens from "./pages/Womens";
import Kids from "./pages/Kids";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminPanal from "./pages/AdminPanal";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail"; // Import the ProductDetail component
import { CartProvider } from "./context/CartContext"; // Import the CartProvider
import Checkout from "./pages/Checkout";

const App = () => {
  return (
    <CartProvider> {/* Wrap the application with CartProvider */}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/mens" element={<Mens />} />
          <Route path="/womens" element={<Womens />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/cart" element={<Cart />} /> {/* Cart route */}
          <Route path="/checkout" element={<Checkout />} /> {/* Cart route */}
          <Route path="/adminpanal" element={<AdminPanal />} />
          <Route path="/product/:id" element={<ProductDetail />} /> {/* Product Detail route */}
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
};

export default App;
