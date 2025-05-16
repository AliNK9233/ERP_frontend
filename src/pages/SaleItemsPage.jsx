import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';
import './Styles/SaleItemsPage.css'; // Ensure this path is correct

const SaleItemsPage = () => {
  const { access } = useSelector((state) => state.auth);
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    axios.get(`/invoices/${invoiceId}/`, {
      headers: { Authorization: `Bearer ${access}` }
    }).then(res => setInvoice(res.data));
  }, [access, invoiceId]);

  if (!invoice) {
    return <div className="loading">Loading invoice details...</div>;
  }

  return (
    <div className="invoice-wrapper">
      <div className="invoice-container">
        <div className="invoice-header">
          <div>
            <p><strong>Invoice No:</strong> {invoice.invoice_number}</p>
            <p><strong>Date:</strong> {invoice.invoice_date}</p>
          </div>
          {invoice.logo_url && (
            <img src={invoice.logo_url} alt="Business Logo" className="invoice-logo" />
          )}
        </div>

        <div className="invoice-details">
          <div>
            <h3>From</h3>
            <p><strong>Business Name:</strong> Your Business Name</p>
            <p><strong>Address:</strong> 123 Main Street, City, State, ZIP</p>
            <p><strong>GSTIN:</strong> 22AAAAA0000A1Z5</p>
            <p><strong>Contact:</strong> +91-9876543210</p>
          </div>
          <div>
            <h3>Bill To</h3>
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
            {invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.item_code || '-'}</td>
                  <td>{item.item_description || '-'}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-items">No items found in this invoice.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="invoice-total">
          <p><strong>Grand Total:</strong> ₹{invoice.total_amount}</p>
        </div>

        <div className="invoice-footer">
          <p>Thank you for your business!</p>
          <p>This is a system-generated invoice.</p>
        </div>
      </div>
    </div>
  );
};

export default SaleItemsPage;
