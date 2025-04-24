import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';

const SaleItemsPage = () => {
  const { access } = useSelector((state) => state.auth);
  const { invoiceId } = useParams();
  const [saleItems, setSaleItems] = useState([]);

  useEffect(() => {
    axios.get(`/sale-items/?sale=${invoiceId}`, {
      headers: { Authorization: `Bearer ${access}` }
    }).then(res => setSaleItems(res.data));
  }, [access, invoiceId]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧾 Sale Item Details for Invoice #{invoiceId}</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Item Code</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Price</th>
          </tr>
        </thead>
        <tbody>
          {saleItems.map(si => (
            <tr key={si.id} className="text-center">
              <td className="border p-2">{si.item_code || '-'}</td>
              <td className="border p-2">{si.item_description || '-'}</td>
              <td className="border p-2">{si.quantity}</td>
              <td className="border p-2">₹{si.price}</td>
            </tr>
          ))}
          {saleItems.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">No sale item records found for this invoice.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SaleItemsPage;
