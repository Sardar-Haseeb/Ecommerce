// src/pages/Checkout.jsx
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to access the passed state
import { CartContext } from '../context/CartContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming your Firebase configuration is in firebase.js
import './Checkout.css'; // Custom styling

const Checkout = () => {
    const { cartItems, clearCart } = useContext(CartContext); // Access the cart items and clearCart function from context
    const location = useLocation(); // Get the location object
    const totalPrice = location.state?.totalPrice || 0; // Retrieve totalPrice from state, default to 0 if not available

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission and save order
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create an order object
            const order = {
                fullName: formData.fullName,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                phone: formData.phone,
                items: cartItems,
                totalPrice: totalPrice, // Use the totalPrice from the cart
                date: new Date(),
            };

            // Save the order to Firestore
            const orderRef = collection(db, 'orders'); // Reference to 'orders' collection
            await addDoc(orderRef, order); // Add the order to Firestore

            alert('Order submitted successfully!');

            // Clear the cart after successful submission
            clearCart();

        } catch (error) {
            console.error('Error saving order: ', error);
            alert('There was an error submitting your order.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return <div>No items in the cart. Please add some items before checking out.</div>;
    }

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>

            {/* Display cart items */}
            <div className="checkout-items">
                {cartItems.map((item) => (
                    <div key={item.id} className="checkout-item">
                        <p><strong>{item.name}</strong> - ${item.price} x {item.quantity}</p>
                    </div>
                ))}
            </div>

            {/* Display total price */}
            <h3>Total Price: ${totalPrice.toFixed(2)}</h3> {/* Display total price here */}

            {/* Billing form */}
            <form className="billing-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="zip">ZIP Code</label>
                    <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Billing Info'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
