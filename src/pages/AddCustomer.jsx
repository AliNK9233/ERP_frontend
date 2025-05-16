import { useState } from 'react';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';
import './Styles/AddCustomer.css';

const AddCustomer = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    gst_number: '',
  });

  const { access } = useSelector((state) => state.auth);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/customers/', form, {
        headers: { Authorization: `Bearer ${access}` },
      });
      setSuccess(true);
      setForm({ name: '', phone: '', address: '', gst_number: '' });
    } catch (err) {
      alert('❌ Failed to add customer');
    }
  };

  return (
    <div className="add-customer-container">
      <h2 className="add-customer-title">➕ Add Customer</h2>
      {success && <p className="add-customer-success">✅ Customer added successfully!</p>}
      <form onSubmit={handleSubmit} className="add-customer-form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <input
          name="gst_number"
          placeholder="GST Number"
          value={form.gst_number}
          onChange={handleChange}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddCustomer;
