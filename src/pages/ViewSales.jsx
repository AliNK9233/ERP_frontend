import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const ViewSales = () => {
  const { access } = useSelector((state) => state.auth);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ customer: '', month: '', year: '' });
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchSales();
    axios.get('/customers/', {
      headers: { Authorization: `Bearer ${access}` }
    }).then(res => setCustomers(res.data));
  }, [access]);

  const fetchSales = () => {
    axios.get('/sales/', {
      headers: { Authorization: `Bearer ${access}` }
    }).then(res => {
      setSales(res.data);
      setFilteredSales(res.data);
    });
  };

  useEffect(() => {
    let results = [...sales];

    if (filters.customer) {
      results = results.filter(s => s.customer === parseInt(filters.customer));
    }

    if (filters.month || filters.year) {
      results = results.filter(sale => {
        const date = new Date(sale.date);
        const saleMonth = date.getMonth() + 1;
        const saleYear = date.getFullYear();
        return (
          (!filters.month || parseInt(filters.month) === saleMonth) &&
          (!filters.year || parseInt(filters.year) === saleYear)
        );
      });
    }

    setFilteredSales(results);
    setTotalAmount(results.reduce((acc, curr) => acc + parseFloat(curr.total_amount), 0));
  }, [filters, sales]);

  const downloadPDF = async (saleId, invoiceNumber) => {
    try {
      const res = await axios.get(`/invoice/${saleId}/pdf/`, {
        headers: { Authorization: `Bearer ${access}` },
        responseType: 'blob' // Required to handle PDF binary
      });
  
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('❌ Failed to download PDF');
      console.error(err);
    }
  };

  const exportToExcel = () => {
    const data = filteredSales.map(s => ({
      'Invoice #': s.invoice_number,
      'Customer': s.customer_name || 'N/A',
      'Total Amount': s.total_amount,
      'Date': s.date ? new Date(s.date).toLocaleString() : 'N/A',
      'Paid': s.is_paid ? 'Yes' : 'No'
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');
    XLSX.writeFile(workbook, 'SalesReport.xlsx');
  };

  const cancelSale = async (id) => {
    const reason = prompt("Enter cancel reason:");
    if (!reason) return;
    try {
      await axios.put(`/sales/${id}/`, { is_cancelled: true, cancel_reason: reason }, {
        headers: { Authorization: `Bearer ${access}` }
      });
      fetchSales();
      alert('Sale cancelled and stock rolled back ✅');
    } catch (err) {
      alert('❌ Cancel failed');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📄 Sales List</h2>

      <div className="flex gap-4 mb-4">
        <select
          value={filters.customer}
          onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Customers</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Months</option>
          {[...Array(12).keys()].map(m => (
            <option key={m + 1} value={m + 1}>{new Date(0, m).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>

        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Years</option>
          {[2023, 2024, 2025].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded">
          📁 Export to Excel
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Invoice #</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Paid</th>
            <th className="p-2 border">Invoice</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map(sale => (
            <tr key={sale.id} className="text-center">
              <Link to={`/sale-items/${sale.id}`} className="text-blue-600 underline">
  {sale.invoice_number}
</Link>

              <td className="border p-2">{sale.customer_name || 'N/A'}</td>
              <td className="border p-2">₹{sale.total_amount}</td>
              <td className="border p-2">{sale.date ? new Date(sale.date).toLocaleString() : 'N/A'}</td>
              <td className="border p-2">{sale.is_paid ? '✅' : '❌'}</td>
              <td className="border p-2">
              <td className="border p-2">
                <button
                  onClick={() => downloadPDF(sale.id, sale.invoice_number)}
                  className="text-blue-600 underline"
                >
                  Download PDF
                </button>
              </td>
              </td>
              <td className="border p-2">
                {!sale.is_cancelled ? (
                  <button
                    onClick={() => cancelSale(sale.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="text-gray-500">Cancelled</span>
                )}
              </td>
            </tr>
          ))}
          {filteredSales.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center p-4">No sales found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="text-right font-bold text-lg mt-4">
        Total for filtered sales: ₹{totalAmount.toFixed(2)}
      </div>
    </div>
  );
};

export default ViewSales;
