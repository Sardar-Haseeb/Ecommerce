import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import './ManageProducts.css'; // Import the CSS file

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState({ name: '', category: '', price: '' });
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productsList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(productsList);
            } catch (err) {
                setError('Failed to fetch products.');
                console.error('Error fetching products: ', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setUpdatedProduct({ name: product.name, category: product.category, price: product.price });
        setNewImage(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setNewImage(file);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const productRef = doc(db, 'products', editingProduct.id);

        try {
            let imageUrl = editingProduct.imageUrl;

            if (newImage) {
                if (imageUrl) {
                    const oldImageRef = ref(storage, imageUrl);
                    await deleteObject(oldImageRef);
                }

                const newImageRef = ref(storage, `product-images/${newImage.name}`);
                const snapshot = await uploadBytes(newImageRef, newImage);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            await updateDoc(productRef, {
                name: updatedProduct.name,
                category: updatedProduct.category,
                price: parseFloat(updatedProduct.price),
                imageUrl: imageUrl,
            });

            const updatedProducts = products.map((product) =>
                product.id === editingProduct.id
                    ? { ...product, ...updatedProduct, imageUrl }
                    : product
            );
            setProducts(updatedProducts);
            setEditingProduct(null);
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Failed to update the product.');
        }
    };

    const handleDeleteProduct = async (productId, imageUrl) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'products', productId));

            if (imageUrl) {
                const imageRef = ref(storage, imageUrl);
                await deleteObject(imageRef);
            }

            setProducts(products.filter((product) => product.id !== productId));
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Failed to delete the product.');
        }
    };

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container">
            <h1 className="header">Manage Products</h1>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-category">Category: {product.category}</p>
                            <p className="product-price">Price: ${product.price}</p>
                            {product.imageUrl && (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="product-image"
                                />
                            )}
                            <button className="button" onClick={() => handleEditClick(product)}>
                                Edit
                            </button>
                            <button
                                className="button delete-button"
                                onClick={() => handleDeleteProduct(product.id, product.imageUrl)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {editingProduct && (
                <div className="edit-form">
                    <h2>Edit Product</h2>
                    <form onSubmit={handleUpdateProduct}>
                        <div>
                            <label>Product Name:</label>
                            <input
                                type="text"
                                value={updatedProduct.name}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Category:</label>
                            <input
                                type="text"
                                value={updatedProduct.category}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, category: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Price:</label>
                            <input
                                type="number"
                                value={updatedProduct.price}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Replace Image:</label>
                            <input type="file" onChange={handleImageUpload} accept="image/*" />
                        </div>
                        <button type="submit" className="button">Save Changes</button>
                        <button type="button" onClick={() => setEditingProduct(null)} className="button" style={{ marginLeft: '10px' }}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
