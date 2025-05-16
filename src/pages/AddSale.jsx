import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Styles/AddSale.css';

const AddSale = () => {
  const { access, user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [rows, setRows] = useState([{ code: '', quantity: 1 }]);
  const [customer, setCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [businessTax, setBusinessTax] = useState(0);
  const [whatsapp, setWhatsapp] = useState(false);
  const [emailBill, setEmailBill] = useState(false);
  const [summary, setSummary] = useState({ subtotal: 0, tax: 0, total: 0 });

  useEffect(() => {
    axios.get('/items/', { headers: { Authorization: `Bearer ${access}` } })
      .then(res => setItems(res.data));

    axios.get('/customers/', { headers: { Authorization: `Bearer ${access}` } })
      .then(res => setCustomers(res.data));

    if (user?.business?.tax_rate) {
      setBusinessTax(parseFloat(user.business.tax_rate));
    }
  }, [access, user]);

  const getItemByCode = (code) => items.find(i => i.code === code);

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    if (field === 'quantity') {
      const qty = parseInt(value);
      updated[index][field] = qty >= 0 ? qty : 0;
    } else {
      updated[index][field] = value;
    }
    setRows(updated);
  };

  const addRow = () => setRows([...rows, { code: '', quantity: 1 }]);

  const deleteRow = (index) => {
    if (rows.length === 1) return;
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  useEffect(() => {
    let subtotal = 0;
    rows.forEach(({ code, quantity }) => {
      const item = getItemByCode(code);
      if (item) subtotal += item.selling_price * quantity;
    });
    const tax = subtotal * (businessTax / 100);
    const total = subtotal + tax;
    setSummary({ subtotal, tax, total });
  }, [rows, businessTax]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer) {
      toast.error('Please select a customer');
      return;
    }

    const invalidRow = rows.some(r => !r.code || r.quantity <= 0 || !getItemByCode(r.code));
    if (invalidRow) {
      toast.error('Please fill all item rows correctly');
      return;
    }

    try {
      const saleItems = rows.map(r => {
        const item = getItemByCode(r.code);
        return { item: item.id, quantity: r.quantity, price: item.selling_price };
      });

      await axios.post('/sales/', {
        customer: parseInt(customer),
        total_amount: summary.total,
        payment_method: 'cash',
        payment_status: 'paid',
        items: saleItems
      }, {
        headers: { Authorization: `Bearer ${access}` }
      });

      toast.success('✅ Sale saved successfully');
      setRows([{ code: '', quantity: 1 }]);
      setCustomer('');
    } catch {
      toast.error('❌ Sale failed');
    }
  };

  return (
    <div className="add-sale-container">
      <ToastContainer />
      <h2 className="add-sale-title">🧾 New Sale</h2>
      <form onSubmit={handleSubmit} className="add-sale-form">
        <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
          <option value="">Select Customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {rows.map((row, i) => {
          const item = getItemByCode(row.code);
          return (
            <div key={i} className="sale-row">
              <input
                type="text"
                placeholder="Item Code"
                value={row.code}
                onChange={(e) => handleRowChange(i, 'code', e.target.value)}
              />
              <input
                type="number"
                placeholder="Qty"
                value={row.quantity}
                min="0"
                onChange={(e) => handleRowChange(i, 'quantity', e.target.value)}
              />
              <span>₹{item?.selling_price || 0} x {row.quantity}</span>
              <span className="font-bold">₹{((item?.selling_price || 0) * row.quantity).toFixed(2)}</span>
              {rows.length > 1 && (
                <button type="button" onClick={() => deleteRow(i)} className="delete-row-btn">🗑️</button>
              )}
            </div>
          );
        })}

        <button type="button" onClick={addRow} className="add-row-btn">+ Add Item</button>

        <div className="sale-summary">
          <p>Subtotal: ₹{summary.subtotal.toFixed(2)}</p>
          <p>Tax ({businessTax}%): ₹{summary.tax.toFixed(2)}</p>
          <p className="text-xl font-bold">Total: ₹{summary.total.toFixed(2)}</p>
        </div>

        <div className="sale-options">
          <label><input type="checkbox" checked={whatsapp} onChange={() => setWhatsapp(!whatsapp)} /> WhatsApp bill</label>
          <label><input type="checkbox" checked={emailBill} onChange={() => setEmailBill(!emailBill)} /> Email bill</label>
        </div>

        <button type="submit" className="submit-btn">Save & Generate Invoice</button>
      </form>
    </div>
  );
};

export default AddSale;
