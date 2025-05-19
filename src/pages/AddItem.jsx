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
      alert("Error adding item: " + (error.response?.data?.detail || "Check inputs"));
    }
  };

  return (
    <div className="add-item-container">
      <h2 className="add-item-title">Add New Item</h2>
      {success && <p className="add-item-success">Item added successfully.</p>}

      <form onSubmit={handleSubmit} className="add-item-form">
        {[
          { name: 'code', type: 'text', label: 'Item Code' },
          { name: 'description', type: 'text', label: 'Description' },
          { name: 'brand', type: 'text', label: 'Brand' },
          { name: 'category', type: 'text', label: 'Category' },
          { name: 'expiry_date', type: 'date', label: 'Expiry Date' },
          { name: 'quantity', type: 'number', label: 'Quantity' },
          { name: 'purchase_price', type: 'number', label: 'Purchase Price' },
          { name: 'selling_price', type: 'number', label: 'Selling Price' },
          { name: 'offer_price', type: 'number', label: 'Offer Price' },
          { name: 'offer_valid_until', type: 'date', label: 'Offer Valid Until' },
          { name: 'batch_number', type: 'text', label: 'Batch Number' },
          { name: 'storage_location', type: 'text', label: 'Storage Location' },
        ].map(({ name, type, label }) => (
          <div className="form-group" key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required={['code', 'description', 'quantity', 'purchase_price', 'selling_price'].includes(name)}
            />
          </div>
        ))}
        <button type="submit" className="add-item-button">Save Item</button>
      </form>
    </div>
  );
};

export default AddItem;
