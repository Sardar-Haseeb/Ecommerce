// src/components/AddProducts.jsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore configuration
import Compressor from 'compressorjs';

const AddProducts = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'categories'));
                const categoryList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCategories(categoryList);
            } catch (error) {
                console.error('Error fetching categories: ', error);
            }
        };

        fetchCategories();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            new Compressor(file, {
                quality: 0.6,
                maxWidth: 800,
                maxHeight: 800,
                success: (compressedResult) => {
                    const sizeInKB = compressedResult.size / 1024;
                    if (sizeInKB > 50) {
                        setError('Image size exceeds 50KB after compression.');
                    } else {
                        setImage(compressedResult);
                        setError('');
                    }
                },
                error: (err) => {
                    setError('Error compressing the image.');
                },
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !category || !price || !description || !image) {
            setError('All fields are required.');
            return;
        }

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            setError('You must be logged in to add products.');
            return;
        }

        setIsLoading(true);

        try {
            const storage = getStorage();
            const storageRef = ref(storage, `products/${image.name}`);
            await uploadBytes(storageRef, image);

            const imageUrl = await getDownloadURL(storageRef);

            await addDoc(collection(db, 'products'), {
                name,
                category,
                price: parseFloat(price),
                description,
                imageUrl,
                createdAt: new Date(),
                createdBy: user.uid,
            });

            // Reset form
            setName('');
            setCategory('');
            setPrice('');
            setDescription('');
            setImage(null);
            setError('');
            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product: ', error);
            setError('Error adding product: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Add Products</h1>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Product Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        style={styles.input}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={styles.textarea}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Product Image:</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} required style={styles.input} />
                </div>
                <button type="submit" disabled={isLoading} style={styles.button}>
                    {isLoading ? 'Adding Product...' : 'Add Product'}
                </button>
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
        maxWidth: '600px',
        margin: '50px auto',
    },
    title: {
        marginBottom: '20px',
        color: '#333',
        fontSize: '28px',
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
    formGroup: {
        marginBottom: '15px',
        width: '100%',
    },
    label: {
        marginBottom: '5px',
        fontSize: '16px',
        color: '#555',
    },
    input: {
        padding: '10px',
        margin: '5px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.3s',
        width: '100%',
    },
    textarea: {
        padding: '10px',
        margin: '5px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.3s',
        width: '100%',
        resize: 'vertical',
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

export default AddProducts;
