import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore configuration
import Compressor from 'compressorjs';
import './AddProducts.css'; // Import CSS for styling

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
        <div className="add-products">
            <h1 className="add-products-title">Add Products</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="add-products-form">
                <div className="form-group">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Product Image:</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} required />
                </div>
                <button type="submit" disabled={isLoading} className="submit-button">
                    {isLoading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProducts;
