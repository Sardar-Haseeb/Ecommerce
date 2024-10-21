// src/components/AddCategory.jsx
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AddCategory.css'; // Import the CSS file

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch categories from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
            const categoryList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategories(categoryList);
        });

        // Clean up the subscription
        return () => unsubscribe();
    }, []);

    // Handle category submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName) {
            setError('Category name is required.');
            return;
        }

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError('You must be logged in to add categories.');
            return;
        }

        setIsLoading(true);

        try {
            if (editingCategoryId) {
                // Update existing category
                await updateDoc(doc(db, 'categories', editingCategoryId), {
                    name: categoryName,
                });
                alert('Category updated successfully!');
            } else {
                // Save new category
                await addDoc(collection(db, 'categories'), {
                    name: categoryName,
                    createdAt: new Date(),
                    createdBy: user.uid,
                });
                alert('Category added successfully!');
            }

            // Reset form
            setCategoryName('');
            setEditingCategoryId(null);
            setError('');
        } catch (error) {
            console.error('Error adding/updating category: ', error);
            setError('Error adding/updating category: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle edit category
    const handleEdit = (category) => {
        setCategoryName(category.name);
        setEditingCategoryId(category.id);
    };

    // Handle delete category
    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteDoc(doc(db, 'categories', categoryId));
                alert('Category deleted successfully!');
            } catch (error) {
                console.error('Error deleting category: ', error);
                setError('Error deleting category: ' + error.message);
            }
        }
    };

    return (
        <div className="container">
            <h1 className="title">Add Category</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="form">
                <div className="input-container">
                    <label className="label">Category Name:</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        className="input"
                    />
                </div>
                <button type="submit" disabled={isLoading} className="button">
                    {isLoading ? 'Saving...' : (editingCategoryId ? 'Update Category' : 'Add Category')}
                </button>
            </form>

            <h2 className="subtitle">Categories</h2>
            <ul className="category-list">
                {categories.map((category) => (
                    <li key={category.id} className="category-item">
                        {category.name}
                        <div>
                            <button onClick={() => handleEdit(category)} className="edit-button">Edit</button>
                            <button onClick={() => handleDelete(category.id)} className="delete-button">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddCategory;
