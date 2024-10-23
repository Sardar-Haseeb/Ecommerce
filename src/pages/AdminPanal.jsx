// src/pages/AdminPanal.jsx
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import AddProducts from '../components/AddProducts';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import ManageOrders from '../components/ManageOrders';
import ManageProducts from '../components/ManageProducts';
import AddCategory from '../components/AddCategory';

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
        <div style={styles.adminPanel}>
            <h1 style={styles.adminTitle}>Admin Panel</h1>
            {user ? (
                <div style={styles.adminContent}>
                    <nav style={styles.adminNav}>
                        <button style={styles.navButton} onClick={() => handleTabChange('addProducts')}>
                            Add Products
                        </button>
                        <button style={styles.navButton} onClick={() => handleTabChange('manageProducts')}>
                            Manage Products
                        </button>
                        <button style={styles.navButton} onClick={() => handleTabChange('addCategory')}>
                            Add Category
                        </button>
                        <button style={styles.navButton} onClick={() => handleTabChange('manageOrders')}>
                            Manage Orders
                        </button>
                    </nav>

                    <button style={styles.signOutButton} onClick={handleSignOut}>
                        Sign Out
                    </button>

                    {selectedTab === 'addProducts' && <AddProducts />}
                    {selectedTab === 'manageProducts' && <ManageProducts />}
                    {selectedTab === 'addCategory' && <AddCategory />}
                    {selectedTab === 'manageOrders' && <ManageOrders />}
                </div>
            ) : (
                <div style={styles.signInSection}>
                    <h2 style={styles.signInTitle}>Please Sign In</h2>
                    <SignIn />
                    <button style={styles.signupButton} onClick={handleShowSignUp}>
                        Don't have an account? Sign Up
                    </button>
                    {showSignUp && <SignUp />}
                </div>
            )}
        </div>
    );
};

// Define inline styles
const styles = {
    adminPanel: {
        padding: '20px',
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    adminTitle: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    adminContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    adminNav: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '20px',
    },
    navButton: {
        padding: '12px 20px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        flex: 1,
        margin: '0 5px',
    },
    navButtonHover: {
        backgroundColor: '#0056b3',
    },
    signOutButton: {
        padding: '10px 15px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#d9534f',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '10px',
    },
    signInSection: {
        textAlign: 'center',
    },
    signInTitle: {
        marginBottom: '10px',
        color: '#333',
    },
    signupButton: {
        padding: '10px 15px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: 'black',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default AdminPanal;
