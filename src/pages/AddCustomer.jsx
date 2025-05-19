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
      alert('Error: Failed to add customer');
    }
  };

  return (
    <div className="add-customer-container">
      <h2 className="add-customer-title">Add Customer</h2>
      {success && <p className="add-customer-success">Customer added successfully!</p>}

      <form onSubmit={handleSubmit} className="add-customer-form">
        <div className="form-group">
          <label htmlFor="name">Name<span>*</span></label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gst_number">GST Number</label>
          <input
            id="gst_number"
            name="gst_number"
            value={form.gst_number}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Save Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;
