import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';
import './Styles/ViewCustomers.css';

const ViewCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const { access } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('/customers/', {
          headers: { Authorization: `Bearer ${access}` },
        });
        setCustomers(res.data);
      } catch (err) {
        console.error('❌ Error fetching customers:', err);
      }
    };

    fetchCustomers();
  }, [access]);

  const handleDelete = async (id) => {
  const confirm = window.confirm("Are you sure you want to delete this customer?");
  if (!confirm) return;

  try {
    await axios.delete(`/customers/${id}/`, {
      headers: { Authorization: `Bearer ${access}` },
    });
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  } catch (err) {
    alert("❌ Failed to delete customer");
    console.error(err);
  }
};
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCustomer({ ...editingCustomer, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/customers/${editingCustomer.id}/`, editingCustomer, {
        headers: { Authorization: `Bearer ${access}` },
      });
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? editingCustomer : c))
      );
      setEditingCustomer(null);
    } catch (err) {
      alert('❌ Failed to update customer');
      console.error(err);
    }
  };

  return (
    <div className="view-customers-container">
      <h2 className="view-customers-title">👥 Customer List</h2>
      <div className="table-wrapper">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>GST No.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.address}</td>
                <td>{c.gst_number || '-'}</td>
                <td>
  <button className="edit-button" onClick={() => setEditingCustomer(c)}>Edit</button>
  <span style={{ margin: '0 8px' }}>|</span>
  <button className="delete-button" onClick={() => handleDelete(c.id)}>Delete</button>
</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="5" className="no-data">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingCustomer && (
        <div className="edit-customer-form">
          <h3>✏️ Edit Customer: {editingCustomer.name}</h3>
          <div className="edit-grid">
            <input
              name="name"
              placeholder="Name"
              value={editingCustomer.name}
              onChange={handleEditChange}
            />
            <input
              name="phone"
              placeholder="Phone"
              value={editingCustomer.phone}
              onChange={handleEditChange}
            />
            <textarea
              name="address"
              placeholder="Address"
              value={editingCustomer.address}
              onChange={handleEditChange}
            />
            <input
              name="gst_number"
              placeholder="GST Number"
              value={editingCustomer.gst_number || ''}
              onChange={handleEditChange}
            />
          </div>
          <div className="edit-actions">
            <button className="btn save" onClick={handleSave}>
              ✅ Save Changes
            </button>
            <button
              className="btn cancel"
              onClick={() => setEditingCustomer(null)}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCustomers;
