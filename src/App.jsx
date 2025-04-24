import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AddItem from '@/pages/AddItem';
import ViewItems from '@/pages/ViewItems';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUser } from '@/features/auth/authSlice';
import AddCustomer from '@/pages/AddCustomer';
import ViewCustomers from '@/pages/ViewCustomers';
import EditCustomer from '@/pages/EditCustomer';
import AddSale from '@/pages/AddSale';
import ViewSales from '@/pages/ViewSales';
import SaleItemsPage from '@/pages/SaleItemsPage';


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

  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />

  <Route path="/add-item" element={
    <ProtectedRoute>
      <AddItem />
    </ProtectedRoute>
  } />

  <Route path="/items" element={
    <ProtectedRoute>
      <ViewItems />
    </ProtectedRoute>
  } />

  <Route path="/add-customer" element={
    <ProtectedRoute>
      <AddCustomer />
    </ProtectedRoute>
  } />

  <Route path="/customers" element={
    <ProtectedRoute>
      <ViewCustomers />
    </ProtectedRoute>
  } />

<Route
  path="/edit-customer/:id"
  element={
    <ProtectedRoute>
      <EditCustomer />
    </ProtectedRoute>
  }
/>
<Route
  path="/add-sale"
  element={
    <ProtectedRoute>
      <AddSale />
    </ProtectedRoute>
  }
/>
<Route
  path="/sales" 
  element={
    <ProtectedRoute>
      <ViewSales />
    </ProtectedRoute>
  }   
  />
<Route
  path="/sale-items/:invoiceId"
  element={
    <ProtectedRoute>
      <SaleItemsPage />
    </ProtectedRoute>
  }
/>


  <Route path="*" element={
  access ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
