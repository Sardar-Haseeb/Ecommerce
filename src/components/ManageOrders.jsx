import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import based on your project structure
import './ManageOrders.css'; // Add custom styling if needed

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('orderId');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      } catch (err) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const orderDoc = doc(db, 'orders', orderId);
        await deleteDoc(orderDoc);
        setOrders(orders.filter(order => order.id !== orderId));
      } catch (err) {
        setError('Failed to delete order');
        console.error(err);
      }
    }
  };

  const filteredOrders = orders.filter(order => (
    order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;
    switch (sortCriteria) {
      case 'orderId':
        comparison = a.id.localeCompare(b.id);
        break;
      case 'fullName':
        comparison = a.fullName.localeCompare(b.fullName);
        break;
      case 'totalPrice':
        comparison = a.totalPrice - b.totalPrice;
        break;
      default:
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="manage-orders">
      <h2>Manage Orders</h2>
      <input
        type="text"
        placeholder="Search by ID, Name, or Email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="sorting-controls">
        <label>
          Sort by:
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="sort-select"
          >
            <option value="orderId">Order ID</option>
            <option value="fullName">Full Name</option>
            <option value="totalPrice">Total Price</option>
          </select>
        </label>
        <button onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')} className="sort-button">
          {sortDirection === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
        </button>
      </div>
      {sortedOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone  Number</th>

              <th>Address</th>
              <th>Items</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.fullName}</td>
                <td>{order.email}</td>
                <td>{order.phone}</td>

                <td>{order.address}</td>
                <td>
                  {order.items.map(item => (
                    <div key={item.id}>
                      {item.name} (x{item.quantity})
                    </div>
                  ))}
                </td>
                <td>${order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</td>
                <td>
                  <button onClick={() => handleDelete(order.id)} className="delete-button">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageOrders;
