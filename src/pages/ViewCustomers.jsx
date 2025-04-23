import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ViewCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👥 Customer List</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">GST No.</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.phone}</td>
              <td className="border p-2">{c.address}</td>
              <td className="border p-2">{c.gst_number || '-'}</td>
              <td className="border p-2">
  <button
    className="text-blue-600 underline"
    onClick={() => navigate(`/edit-customer/${c.id}`)}
  >
    Edit
  </button>
</td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No customers found.

              </td>
              
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCustomers;
