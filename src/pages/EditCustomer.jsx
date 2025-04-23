import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditCustomer = () => {
  const { id } = useParams();
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    gst_number: ''
  });

  useEffect(() => {
    axios.get(`/customers/${id}/`, {
      headers: { Authorization: `Bearer ${access}` }
    }).then(res => setForm(res.data))
      .catch(err => alert('❌ Failed to fetch customer'));
  }, [id, access]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`/customers/${id}/`, form, {
        headers: { Authorization: `Bearer ${access}` }
      });
      alert('✅ Customer updated!');
      navigate('/customers');
    } catch (err) {
      alert('❌ Update failed');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Customer</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="p-2 border rounded" />
        <textarea name="address" value={form.address} onChange={handleChange} placeholder="Address" className="p-2 border rounded" />
        <input name="gst_number" value={form.gst_number || ''} onChange={handleChange} placeholder="GST No" className="p-2 border rounded" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default EditCustomer;
