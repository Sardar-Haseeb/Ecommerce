import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState({ name: '', category: '', price: '' });
    const [newImage, setNewImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(true); // Open modal on edit click
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
            setIsModalOpen(false); // Close modal after update
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

    const containerStyle = {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
    };

    const headerStyle = {
        fontSize: '24px',
        textAlign: 'center',
        marginBottom: '20px',
    };

    const productGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
    };

    const productCardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    };

    const productNameStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        margin: '10px 0',
    };

    const productCategoryStyle = {
        margin: '5px 0',
    };

    const productPriceStyle = {
        margin: '5px 0',
        color: '#555',
    };

    const buttonStyle = {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        margin: '5px',
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc3545',
    };

    const modalStyle = {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: isModalOpen ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000',
    };

    const modalContentStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
    };

    const closeModalButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc3545',
    };

    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>Manage Products</h1>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div style={productGridStyle}>
                    {products.map((product) => (
                        <div key={product.id} style={productCardStyle}>
                            <h2 style={productNameStyle}>{product.name}</h2>
                            <p style={productCategoryStyle}>Category: {product.category}</p>
                            <p style={productPriceStyle}>Price: ${product.price}</p>
                            {product.imageUrl && (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    style={{ width: '100%', borderRadius: '4px' }}
                                />
                            )}
                            <button style={buttonStyle} onClick={() => handleEditClick(product)}>
                                Edit
                            </button>
                            <button
                                style={deleteButtonStyle}
                                onClick={() => handleDeleteProduct(product.id, product.imageUrl)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for editing product */}
            <div style={modalStyle}>
                <div style={modalContentStyle}>
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
                        <button type="submit" style={buttonStyle}>Save Changes</button>
                        <button 
                            type="button" 
                            onClick={() => { setEditingProduct(null); setIsModalOpen(false); }} 
                            style={closeModalButtonStyle}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageProducts;
