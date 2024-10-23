// src/components/SignIn.jsx
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Sign In</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={styles.input}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Sign In</button>
            </form>
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
        maxWidth: '400px',
        margin: '50px auto',
    },
    title: {
        marginBottom: '20px',
        color: '#333',
        fontSize: '24px',
        textAlign: 'center',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    input: {
        padding: '12px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    button: {
        padding: '12px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.2s',
    },
};

// Add hover effect using pseudo-element
const buttonStyle = {
    ...styles.button,
    '&:hover': {
        backgroundColor: '#0056b3',
        transform: 'scale(1.05)',
    },
};

export default SignIn;
