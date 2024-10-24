import React, { useEffect, useState, useContext } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Home = () => {
  const { addToCart } = useContext(CartContext);
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
      <main className="bg-gray-100 p-6">
        {/* Hero Section */}
        {/* Hero Section with Inline CSS */}
        <section
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '10rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
            Welcome to Our E-Commerce Store
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
            Shop the latest trends in fashion for men, women, and kids.
          </p>
          <button
            style={{
              backgroundColor: 'black',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'gray'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'black'}
          >
            Shop Now
          </button>
        </section>



        {/* Categories Section */}
        {/* Categories Section with Inline CSS */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginTop: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Men's Category */}
          <div
            style={{
              position: 'relative',
              backgroundImage: "url('https://media.istockphoto.com/id/687572186/photo/handsome-young-man-in-shopping.jpg?s=612x612&w=0&k=20&c=P5__LphyJf3BZd4ha1SKHgzv1UC_7foYccB9L6-29Qo=')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '20rem',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transform: 'scale(1)',
              transition: 'transform 0.3s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div style={{ textAlign: 'center', color: 'white', padding: '1rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>Men's</h2>
                <p style={{ marginBottom: '1rem' }}>Explore men's fashion</p>
                <Link
                  to="/mens"
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease-in-out',
                    cursor: 'pointer'
                  }}
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>

          {/* Women's Category */}
          <div
            style={{
              position: 'relative',
              backgroundImage: "url('https://media.istockphoto.com/id/683740686/photo/shopping-time-young-woman-in-shopping-looking-for-presents-consumerism-shopping-lifestyle.jpg?s=612x612&w=0&k=20&c=FHT4xUsPP8ZTbDScva0BJhLfDaa2oNjqF7JQ1Df7kZM=')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '20rem',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transform: 'scale(1)',
              transition: 'transform 0.3s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div style={{ textAlign: 'center', color: 'white', padding: '1rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>Women's</h2>
                <p style={{ marginBottom: '1rem' }}>Explore women's fashion</p>
                <Link
                  to="/womens"
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease-in-out',
                    cursor: 'pointer'
                  }}
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>

          {/* Kids' Category */}
          <div
            style={{
              position: 'relative',
              backgroundImage: "url('https://t3.ftcdn.net/jpg/02/11/82/88/360_F_211828832_OnMaambs24g0vZM8HLjqZ8tU5wH4y1oD.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '20rem',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transform: 'scale(1)',
              transition: 'transform 0.3s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div style={{ textAlign: 'center', color: 'white', padding: '1rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>Kids</h2>
                <p style={{ marginBottom: '1rem' }}>Explore kids' fashion</p>
                <Link
                  to="/kids"
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease-in-out',
                    cursor: 'pointer',

                  }}
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </section>




        {/* Products Section */}
        {/* Products Section */}
        <section className="products mt-12" style={{ padding: '2rem 0', backgroundColor: '#f9fafb' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ textAlign: 'center', color: '' }}>Men's Products</h2>
          <div
            // className="product-list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8" // Adjusted for 4 columns on large screens
            style={{
              maxWidth: '1200px', margin: '0 auto', display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}
          >
            {products.men.length > 0 ? (
              products.men.map(product => (
                <div
                  key={product.id}
                  className="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  style={{
                    border: '1px solid #e5e7eb', cursor: 'pointer', display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px'
                  }}
                >
                  <Link to={`/product/${product.id}`}>
                    <div
                      className="relative"
                      style={{
                        height: '12rem',
                        backgroundImage: `url(${product.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderBottom: '1px solid #e5e7eb',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        className="absolute inset-0 transition-opacity duration-300 bg-black bg-opacity-0 hover:bg-opacity-30"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        {/* <span className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300 text-sm font-medium">View Details</span> */}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2"
                        style={{
                          fontWeight: '600',
                          fontSize: '18px',
                          margin: '10px 0',
                          color: '#333'
                        }}>{product.name}</h3>
                      <p className="text-gray-500 text-sm mb-4"
                        style={{
                          color: '#666',
                          fontSize: '16px',
                          margin: '5px 0'
                        }}>${product.price}</p>
                    </div>
                  </Link>
                  <button
                    className="w-full px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300"
                    style={{
                      width: '100%',
                      paddingBottom: '10px',
                      paddingBottom: '10px',
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      backgroundColor: '#333',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      paddingy: '',
                      transition: 'background-color 0.3s'
                    }}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No men's products available.</p>
            )}
          </div>
        </section>

        {/* Repeat similarly for Women's and Kid's Products Section */}
        <section className="products mt-12" style={{ padding: '2rem 0', backgroundColor: '#f9fafb' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ textAlign: 'center', color: '#1f2937' }}>Women's Products</h2>
          <div
            // className="product-list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8"
            style={{
              maxWidth: '1200px', margin: '0 auto', display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}
          >
            {products.women.length > 0 ? (
              products.women.map(product => (
                <div
                  key={product.id}
                  className="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  style={{ border: '1px solid #e5e7eb', cursor: 'pointer' }}
                >
                  <Link to={`/product/${product.id}`}>
                    <div
                      className="relative"
                      style={{
                        height: '12rem',
                        backgroundImage: `url(${product.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderBottom: '1px solid #e5e7eb',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        className="absolute inset-0 transition-opacity duration-300 bg-black bg-opacity-0 hover:bg-opacity-30"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        {/* <span className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300 text-sm font-medium">View Details</span> */}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-500 text-sm mb-4">${product.price}</p>
                    </div>
                  </Link>
                  <button
                    className="w-full px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300"
                    style={{
                      borderTop: '1px solid #e5e7eb',
                      borderBottomLeftRadius: '0.5rem',
                      borderBottomRightRadius: '0.5rem'
                    }}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No women's products available.</p>
            )}
          </div>
        </section>

        <section className="products mt-12" style={{ padding: '2rem 0', backgroundColor: '#f9fafb' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ textAlign: 'center', color: '#1f2937' }}>Kid's Products</h2>
          <div
            className="product-list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8"
            style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'}}
          >
            {products.kid.length > 0 ? (
              products.kid.map(product => (
                <div
                  key={product.id}
                  className="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  style={{ border: '1px solid #e5e7eb', cursor: 'pointer' }}
                >
                  <Link to={`/product/${product.id}`}>
                    <div
                      className="relative"
                      style={{
                        height: '12rem',
                        backgroundImage: `url(${product.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderBottom: '1px solid #e5e7eb',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        className="absolute inset-0 transition-opacity duration-300 bg-black bg-opacity-0 hover:bg-opacity-30"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        {/* <span className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300 text-sm font-medium">View Details</span> */}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-500 text-sm mb-4">${product.price}</p>
                    </div>
                  </Link>
                  <button
                    className="w-full px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300"
                    style={{
                      borderTop: '1px solid #e5e7eb',
                      borderBottomLeftRadius: '0.5rem',
                      borderBottomRightRadius: '0.5rem'
                    }}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
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
