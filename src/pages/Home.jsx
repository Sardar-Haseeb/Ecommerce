// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './Home.css'; // Import CSS file

const Home = () => {
  const [products, setProducts] = useState({ men: [], women: [], kid: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Categorize products based on their category field
        const categorizedProducts = {
          men: productsList.filter(product => product.category === 'Men'),
          women: productsList.filter(product => product.category === 'Women'),
          kid: productsList.filter(product => product.category === 'Kid'),
        };

        setProducts(categorizedProducts);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <main className="home">
        {/* Hero Section */}
        <section className="hero">
          <h1>Welcome to Our E-Commerce Store</h1>
          <p>Shop the latest trends in fashion for men, women, and kids.</p>
          <button className="shop-now-btn">Shop Now</button>
        </section>

        {/* Categories Section */}
        <section className="categories">
          <div className="category men">
            <h2>Men's</h2>
            <p>Explore men's fashion</p>
            <a href="/mens" className="shop-link">Shop Now</a>
          </div>
          <div className="category women">
            <h2>Women's</h2>
            <p>Explore women's fashion</p>
            <a href="/womens" className="shop-link">Shop Now</a>
          </div>
          <div className="category kid">
            <h2>Kids</h2>
            <p>Explore kids' fashion</p>
            <a href="/kids" className="shop-link">Shop Now</a>
          </div>
        </section>

        {/* Products Section */}
        <section className="products">
          <h2>Men's Products</h2>
          <div className="product-list">
            {products.men.length > 0 ? (
              products.men.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.imageUrl} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              ))
            ) : (
              <p>No men's products available.</p>
            )}
          </div>

          <h2>Women's Products</h2>
          <div className="product-list">
            {products.women.length > 0 ? (
              products.women.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.imageUrl} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              ))
            ) : (
              <p>No women's products available.</p>
            )}
          </div>

          <h2>Kids' Products</h2>
          <div className="product-list">
            {products.kid.length > 0 ? (
              products.kid.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.imageUrl} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              ))
            ) : (
              <p>No kids' products available.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
