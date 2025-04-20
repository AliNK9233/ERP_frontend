import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import Header from '@/components/Header';

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

  const handleEdit = (item) => {
    setEditingItem(item);
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`/items/${id}/`);
      setItems(items.filter(item => item.id !== id)); // Refresh list
    } catch (err) {
      alert('Delete failed!');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <Header />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">📦 Stock Items</h2>
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No items available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="border p-2">Code</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Brand</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Sell ₹</th>
                  <th className="border p-2">Offer ₹</th>
                  <th className="border p-2">Expiry</th>
                  <th className="border p-2">Location</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="text-sm text-center">
                    <td className="border p-1">{item.code}</td>
                    <td className="border p-1">{item.description}</td>
                    <td className="border p-1">{item.brand}</td>
                    <td className="border p-1">{item.quantity}</td>
                    <td className="border p-1">{item.selling_price}</td>
                    <td className="border p-1">{item.offer_price || '-'}</td>
                    <td className="border p-1">{item.expiry_date || '-'}</td>
                    <td className="border p-1">{item.storage_location || '-'}</td>
                    <td className="border p-1">
  <button
    onClick={() => handleEdit(item)}
    className="bg-blue-500 text-white px-2 py-1 text-xs rounded mr-2"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(item.id)}
    className="bg-red-500 text-white px-2 py-1 text-xs rounded"
  >
    Delete
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {editingItem && (
  <div className="mt-4 border-t pt-4 bg-gray-50 p-4 rounded-md">
    <h3 className="font-semibold mb-4">✏️ Edit Item: {editingItem.code}</h3>

    <div className="grid grid-cols-2 gap-4">
      <input
        className="border p-2"
        placeholder="Description"
        value={editingItem.description}
        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
      />
      <input
        className="border p-2"
        placeholder="Brand"
        value={editingItem.brand}
        onChange={(e) => setEditingItem({ ...editingItem, brand: e.target.value })}
      />
      <input
        className="border p-2"
        placeholder="Category"
        value={editingItem.category}
        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
      />
      <input
        className="border p-2"
        placeholder="Quantity"
        type="number"
        value={editingItem.quantity}
        onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
      />
      <input
        className="border p-2"
        placeholder="Purchase Price"
        type="number"
        value={editingItem.purchase_price}
        onChange={(e) => setEditingItem({ ...editingItem, purchase_price: e.target.value })}
      />
      <input
        className="border p-2"
        placeholder="Selling Price"
        type="number"
        value={editingItem.selling_price}
        onChange={(e) => setEditingItem({ ...editingItem, selling_price: e.target.value })}
      />
      <input
        className="border p-2"
        placeholder="Offer Price"
        type="number"
        value={editingItem.offer_price || ''}
        onChange={(e) => setEditingItem({ ...editingItem, offer_price: e.target.value })}
      />
      <input
        className="border p-2"
        placeholder="Expiry Date"
        type="date"
        value={editingItem.expiry_date || ''}
        onChange={(e) => setEditingItem({ ...editingItem, expiry_date: e.target.value })}
      />
      <input
        className="border p-2"
        placeholder="Storage Location"
        value={editingItem.storage_location || ''}
        onChange={(e) => setEditingItem({ ...editingItem, storage_location: e.target.value })}
      />
    </div>

    <div className="mt-4 flex gap-3">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
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
      <button
        className="px-4 py-2 bg-gray-300 rounded"
        onClick={() => setEditingItem(null)}
      >
        ❌ Cancel
      </button>
    </div>
  </div>
)}


          </div>
        )}
      </div>
    </div>
  );
};

export default ViewItems;
