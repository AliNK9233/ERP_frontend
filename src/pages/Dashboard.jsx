import React, { useEffect, useState } from 'react';
import './Styles/Dashboard.css';
import axios from '@/utils/axios';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [salesData, setSalesData] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchLowStock();
  }, [year]);

  const fetchSales = async () => {
    try {
      const res = await axios.get(`/dashboard/monthly-sales/?year=${year}`);
      setSalesData(res.data.monthly_sales);
    } catch (err) {
      console.error('Sales fetch error:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/dashboard/customer-count/');
      setCustomerCount(res.data.total_customers);
    } catch (err) {
      console.error('Customer fetch error:', err);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await axios.get('/dashboard/low-stock/');
      setLowStock(res.data);
    } catch (err) {
      console.error('Low stock fetch error:', err);
    }
  };

  return (
  <div className="dashboard-container">
    <h1 className="dashboard-title">📊 Business Dashboard</h1>

    {/* Year Selector + Count Card */}
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <label>Select Year:</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {[2023, 2024, 2025].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="dashboard-card">
        <p>Total Customers</p>
        <p className="text-2xl font-bold">{customerCount}</p>
      </div>
    </div>

    {/* Sales Chart */}
    <div className="dashboard-chart">
      <h2>📈 Monthly Sales</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Low Stock Table */}
    <div className="dashboard-chart">
      <h2>⚠️ Low Stock Items</h2>
      {lowStock.length ? (
        <table className="low-stock-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((item, idx) => (
              <tr key={idx}>
                <td>{item.code}</td>
                <td>{item.description}</td>
                <td className="low-qty">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No low stock items ✅</p>
      )}
    </div>
  </div>
);

};

export default Dashboard;
