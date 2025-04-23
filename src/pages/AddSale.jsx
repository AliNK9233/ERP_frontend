import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';

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

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = field === 'quantity' ? parseInt(value) : value;
    setRows(updated);
  };

  const addRow = () => setRows([...rows, { code: '', quantity: 1 }]);

  const getItem = (code) => items.find(i => i.code === code);

  useEffect(() => {
    let subtotal = 0;
    rows.forEach(({ code, quantity }) => {
      const item = getItem(code);
      if (item) subtotal += item.selling_price * quantity;
    });
    const tax = subtotal * (businessTax / 100);
    const total = subtotal + tax;
    setSummary({ subtotal, tax, total });
  }, [rows, businessTax]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const saleItems = rows.map(r => {
        const item = getItem(r.code);
        return { item: item.id, quantity: r.quantity, price: item.selling_price };
      });
      await axios.post('/sales/', {
        customer,
        total_amount: summary.total,
        payment_method: 'cash',
        payment_status: 'paid',
        items: saleItems
      }, {
        headers: { Authorization: `Bearer ${access}` }
      });
      alert('✅ Sale saved');
      setRows([{ code: '', quantity: 1 }]);
      setCustomer('');
    } catch {
      alert('❌ Sale failed');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧾 New Sale</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="p-2 border rounded">
          <option value="">Select Customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            <input type="text" placeholder="Item Code" value={row.code} onChange={(e) => handleRowChange(i, 'code', e.target.value)} className="border p-2" />
            <input type="number" placeholder="Qty" value={row.quantity} onChange={(e) => handleRowChange(i, 'quantity', e.target.value)} className="border p-2" />
            <span className="self-center">₹{getItem(row.code)?.selling_price || 0} x {row.quantity}</span>
            <span className="self-center font-bold">₹{((getItem(row.code)?.selling_price || 0) * row.quantity).toFixed(2)}</span>
          </div>
        ))}

        <button type="button" onClick={addRow} className="bg-blue-500 text-white px-4 py-2 rounded w-fit">+ Add Item</button>

        <div className="mt-4 border-t pt-4">
          <p>Subtotal: ₹{summary.subtotal.toFixed(2)}</p>
          <p>Tax ({businessTax}%): ₹{summary.tax.toFixed(2)}</p>
          <p className="text-xl font-bold">Total: ₹{summary.total.toFixed(2)}</p>
        </div>

        <div className="flex gap-6 mt-4">
          <label><input type="checkbox" checked={whatsapp} onChange={() => setWhatsapp(!whatsapp)} /> WhatsApp bill</label>
          <label><input type="checkbox" checked={emailBill} onChange={() => setEmailBill(!emailBill)} /> Email bill</label>
        </div>

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Save & Generate Invoice</button>
      </form>
    </div>
  );
};

export default AddSale;
