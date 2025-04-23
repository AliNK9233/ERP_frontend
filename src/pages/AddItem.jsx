import { useState } from 'react';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';

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
      alert("❌ Error adding item: " + error.response?.data?.detail || "Check inputs");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">➕ Add Item</h2>
      {success && <p className="text-green-600 mb-4">✅ Item added successfully!</p>}
      <form onSubmit={handleSubmit} className="grid gap-3">
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
            className="border p-2 rounded"
            required={['code', 'description', 'quantity', 'purchase_price', 'selling_price'].includes(name)}
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Item</button>
      </form>
    </div>
  );
};

export default AddItem;
