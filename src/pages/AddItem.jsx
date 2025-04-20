import { useState } from 'react';
import axios from '@/utils/axios';
import Header from '@/components/Header';

const AddItem = () => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    brand: '',
    category: '',
    expiry_date: '',
    quantity: '',
    purchase_price: '',
    selling_price: '',
    offer_price: '',
    offer_valid_until: '',
    batch_number: '',
    storage_location: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert empty strings to null (especially for optional fields)
    const cleanData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value === '' ? null : value,
      ])
    );
  
    try {
      await axios.post('/items/', cleanData);
      setMessage('✅ Item added successfully!');
      setFormData({ ...formData, code: '', description: '', quantity: '' });
    } catch (err) {
      console.error('❌ Error response:', err.response?.data);
      setMessage(
        '❌ Failed to add item: ' +
          JSON.stringify(err.response?.data || 'unknown error')
      );
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type={key.includes('date') ? 'date' : 'text'}
              name={key}
              placeholder={key.replaceAll('_', ' ').toUpperCase()}
              value={formData[key]}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          ))}
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              Add Item
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default AddItem;
