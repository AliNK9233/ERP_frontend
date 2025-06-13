import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AddItem from '@/pages/AddItem';
import ViewItems from '@/pages/ViewItems';
import AddCustomer from '@/pages/AddCustomer';
import ViewCustomers from '@/pages/ViewCustomers';
import EditCustomer from '@/pages/EditCustomer';
import AddSale from '@/pages/AddSale';
import ViewSales from '@/pages/ViewSales';
import SaleItemsPage from '@/pages/SaleItemsPage';

import ProtectedRoute from '@/routes/ProtectedRoute';
import { fetchUser } from '@/features/auth/authSlice';
import MainLayout from '@/layouts/MainLayout';

const App = () => {
  const dispatch = useDispatch();
  const { access, user, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (access && !user) {
      dispatch(fetchUser());
    }
  }, [access, user, dispatch]);

  if (access && !initialized) {
  return <div className="p-4 text-center">🔄 Restoring session...</div>;
}

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with Header */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/items" element={<ViewItems />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/customers" element={<ViewCustomers />} />
          <Route path="/edit-customer/:id" element={<EditCustomer />} />
          <Route path="/add-sale" element={<AddSale />} />
          <Route path="/sales" element={<ViewSales />} />
          <Route path="/sale-items/:invoiceId" element={<SaleItemsPage />} />
        </Route>

        {/* Fallback */}
        <Route
  path="/login"
  element={access && user ? <Navigate to="/add-sale" /> : <Login />}
/>
        <Route
          path="*"
          element={access ? <Navigate to="/add-sale" /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
