import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';
import './invoice.css'; // Adjust path as needed

const SaleItemsPage = () => {
  const { access } = useSelector((state) => state.auth);
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    axios.get(`/invoices/${invoiceId}/`, {
      headers: { Authorization: `Bearer ${access}` }
    }).then(res => setInvoice(res.data));
  }, [access, invoiceId]);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '', 'width=900,height=650');
    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <link rel="stylesheet" href="${window.location.origin}/styles/invoice.css">
        </head>
        <body>
          <div class="invoice-container">${printContents}</div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🧾 Invoice #{invoiceId}</h2>
        <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Print</button>
      </div>

      {invoice ? (
        <div ref={printRef} className="invoice-container bg-white shadow-md p-8">
          <div className="invoice-header flex justify-between items-start mb-6">
            <div>
              <h1 className="text-xl font-bold mb-1">INVOICE</h1>
              <p><strong>Invoice No:</strong> {invoice.invoice_number}</p>
              <p><strong>Date:</strong> {invoice.invoice_date}</p>
            </div>
            <img src={invoice.logo_url} alt="Business Logo" className="invoice-logo" />
           
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="invoice-section-title">From</h3>
              <p><strong>Business Name:</strong> Your Business Name</p>
              <p><strong>Address:</strong> 123 Main Street, City, State, ZIP</p>
              <p><strong>GSTIN:</strong> 22AAAAA0000A1Z5</p>
              <p><strong>Contact:</strong> +91-9876543210</p>
            </div>
            <div>
              <h3 className="invoice-section-title">Bill To</h3>
              <p><strong>Name:</strong> {invoice.customer_name}</p>
              <p><strong>Address:</strong> {invoice.customer_address}</p>
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Code</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.item_code || '-'}</td>
                  <td>{item.item_description || '-'}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                </tr>
              ))}
              {invoice.items.length === 0 && (
                <tr>
                  <td colSpan="6">No items found in this invoice.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="text-right mt-6">
            <p className="text-lg font-semibold">Grand Total: ₹{invoice.total_amount}</p>
          </div>

          <div className="invoice-footer mt-10 text-center text-sm text-gray-600">
            <p>Thank you for your business!</p>
            <p>This is a system-generated invoice.</p>
          </div>
        </div>
      ) : (
        <p>Loading invoice details...</p>
      )}
    </div>
  );
};

export default SaleItemsPage;
