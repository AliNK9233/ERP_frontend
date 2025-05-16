import { useState } from 'react';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';
import './Styles/AddItem.css';

const AddItem = () => {
  const [form, setForm] = useState({
    code: '',
    description: '',
    brand: '',
    category: '',
    expiry_date: '',
    quantity: 0,
    purchase_price: '',
    selling_price: '',
    offer_price: '',
    offer_valid_until: '',
    batch_number: '',
    storage_location: '',
  });

  const [success, setSuccess] = useState(false);
  const { access } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/items/', form, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      setSuccess(true);
      setForm({ ...form, code: '', description: '', quantity: 0 });
    } catch (error) {
      alert("❌ Error adding item: " + (error.response?.data?.detail || "Check inputs"));
    }
  };

  return (
    <div className="add-item-container">
      <h2 className="add-item-title">➕ Add Item</h2>
      {success && <p className="add-item-success">✅ Item added successfully!</p>}
      <form onSubmit={handleSubmit} className="add-item-form">
        {[
          { name: 'code', type: 'text' },
          { name: 'description', type: 'text' },
          { name: 'brand', type: 'text' },
          { name: 'category', type: 'text' },
          { name: 'expiry_date', type: 'date' },
          { name: 'quantity', type: 'number' },
          { name: 'purchase_price', type: 'number' },
          { name: 'selling_price', type: 'number' },
          { name: 'offer_price', type: 'number' },
          { name: 'offer_valid_until', type: 'date' },
          { name: 'batch_number', type: 'text' },
          { name: 'storage_location', type: 'text' },
        ].map(({ name, type }) => (
          <input
            key={name}
            type={type}
            name={name}
            placeholder={name.replace(/_/g, ' ').toUpperCase()}
            value={form[name]}
            onChange={handleChange}
            className="add-item-input"
            required={['code', 'description', 'quantity', 'purchase_price', 'selling_price'].includes(name)}
          />
        ))}
        <button type="submit" className="add-item-button">Save Item</button>
      </form>
    </div>
  );
};

export default AddItem;
