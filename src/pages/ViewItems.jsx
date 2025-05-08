import { useEffect, useRef, useState } from 'react';
import axios from '@/utils/axios';
import Header from '@/components/Header';

const InvoicePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const printRef = useRef();

  const fetchItems = async () => {
    try {
      const res = await axios.get('/items/');
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setLoading(false);
    }
  };

  const getTotal = () => {
    return items.reduce((acc, item) => acc + (item.selling_price * item.quantity), 0);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-4 bg-white min-h-screen">
      <Header />

      {/* Print Button */}
      <div className="max-w-4xl mx-auto my-4 text-right">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* Printable Invoice Section */}
      <div
        ref={printRef}
        className="max-w-4xl mx-auto shadow-lg border p-6 bg-gray-50 rounded-lg print:p-0 print:shadow-none"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">🧾 Invoice</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Invoice No:</strong> {invoiceNumber}</p>
              <p><strong>Date:</strong> {invoiceDate}</p>
            </div>
            <div>
              <p><strong>Business Name:</strong> ABC Traders</p>
              <p><strong>Address:</strong> 123 Market Street, City</p>
              <p><strong>GSTIN:</strong> 22ABCDE1234F1Z5</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">🧍 Customer Details</h3>
          <p><strong>Name:</strong> {customerName}</p>
          <p><strong>Address:</strong> {customerAddress}</p>
        </div>

        {loading ? (
          <p>Loading items...</p>
        ) : (
          <>
            <table className="min-w-full text-sm border mb-6">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">#</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Rate ₹</th>
                  <th className="border p-2">Amount ₹</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="text-center">
                    <td className="border p-1">{index + 1}</td>
                    <td className="border p-1">{item.description}</td>
                    <td className="border p-1">{item.quantity}</td>
                    <td className="border p-1">{item.selling_price}</td>
                    <td className="border p-1">{(item.quantity * item.selling_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right font-bold text-lg">
              Total: ₹ {getTotal().toFixed(2)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoicePage;
