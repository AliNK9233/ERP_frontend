import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import './Styles/ViewItems.css';

const ViewItems = () => {
  const [editingItem, setEditingItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/items/');
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setLoading(false);
    }
  };

  const handleEdit = (item) => setEditingItem(item);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`/items/${id}/`);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      alert('Delete failed!');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="view-items-container">
      <h2 className="view-items-title">📦 Stock Items</h2>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items available.</p>
      ) : (
        <div className="table-wrapper">
          <table className="items-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Brand</th>
                <th>Qty</th>
                <th>Sell ₹</th>
                <th>Offer ₹</th>
                <th>Expiry</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.description}</td>
                  <td>{item.brand}</td>
                  <td>{item.quantity}</td>
                  <td>{item.selling_price}</td>
                  <td>{item.offer_price || '-'}</td>
                  <td>{item.expiry_date || '-'}</td>
                  <td>{item.storage_location || '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(item)} className="btn edit">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="btn delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingItem && (
            <div className="edit-form">
              <h3>✏️ Edit Item: {editingItem.code}</h3>
              <div className="edit-grid">
                {[
                  'description',
                  'brand',
                  'category',
                  'quantity',
                  'purchase_price',
                  'selling_price',
                  'offer_price',
                  'expiry_date',
                  'storage_location',
                ].map((field) => (
                  <input
                    key={field}
                    type={field.includes('price') || field === 'quantity' ? 'number' : field.includes('date') ? 'date' : 'text'}
                    placeholder={field.replace(/_/g, ' ')}
                    value={editingItem[field] || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, [field]: e.target.value })}
                  />
                ))}
              </div>
              <div className="edit-actions">
                <button
                  className="btn save"
                  onClick={async () => {
                    try {
                      await axios.put(`/items/${editingItem.id}/`, editingItem);
                      setItems((prev) =>
                        prev.map((i) => (i.id === editingItem.id ? editingItem : i))
                      );
                      setEditingItem(null);
                    } catch (err) {
                      alert('Update failed');
                      console.error(err);
                    }
                  }}
                >
                  ✅ Save Changes
                </button>
                <button className="btn cancel" onClick={() => setEditingItem(null)}>
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewItems;
