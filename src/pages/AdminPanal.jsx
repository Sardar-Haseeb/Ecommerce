// src/pages/AdminPanal.jsx
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import AddProducts from '../components/AddProducts';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import ManageOrders from '../components/ManageOrders';
import ManageProducts from '../components/ManageProducts';
import AddCategory from '../components/AddCategory';
import './AdminPanal.css'; // Import the CSS file

const AdminPanal = () => {
    const [user, setUser] = useState(null);
    const [showSignUp, setShowSignUp] = useState(false);
    const [selectedTab, setSelectedTab] = useState('addProducts');

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [auth]);

    const handleShowSignUp = () => {
        setShowSignUp(true);
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert('You have been signed out.');
        } catch (error) {
            console.error('Error signing out: ', error);
            alert('Error signing out: ' + error.message);
        }
    };

    return (
        <div className="admin-panel">
            <h1 className="admin-title">Admin Panel</h1>
            {user ? (
                <div className="admin-content">
                    <nav className="admin-nav">
                        <button className="nav-button" onClick={() => handleTabChange('addProducts')}>
                            Add Products
                        </button>
                        <button className="nav-button" onClick={() => handleTabChange('manageProducts')}>
                            Manage Products
                        </button>
                        <button className="nav-button" onClick={() => handleTabChange('addCategory')}>
                            Add Category
                        </button>
                        <button className="nav-button" onClick={() => handleTabChange('manageOrders')}>
                            Manage Orders
                        </button>
                    </nav>

                    <button className="sign-out-button" onClick={handleSignOut}>
                        Sign Out
                    </button>

                    {selectedTab === 'addProducts' && <AddProducts />}
                    {selectedTab === 'manageProducts' && <ManageProducts />}
                    {selectedTab === 'addCategory' && <AddCategory />}
                    {selectedTab === 'manageOrders' && <ManageOrders />}
                </div>
            ) : (
                <div className="sign-in-section">
                    <h2 className="sign-in-title">Please Sign In</h2>
                    <SignIn />
                    <button className="signup-button" onClick={handleShowSignUp}>
                        Don't have an account? Sign Up
                    </button>
                    {showSignUp && <SignUp />}
                </div>
            )}
        </div>
    );
};

export default AdminPanal;
