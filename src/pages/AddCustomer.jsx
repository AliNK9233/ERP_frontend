import { useState } from 'react';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';

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
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">➕ Add Customer</h2>
      {success && <p className="text-green-600 mb-4">✅ Customer added successfully!</p>}
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="p-2 border rounded" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="p-2 border rounded" />
        <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} className="p-2 border rounded" />
        <input name="gst_number" placeholder="GST Number" value={form.gst_number} onChange={handleChange} className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
};

export default AddCustomer;
