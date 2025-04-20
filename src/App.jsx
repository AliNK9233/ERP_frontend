import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AddItem from '@/pages/AddItem';
import ViewItems from '@/pages/ViewItems';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUser } from '@/features/auth/authSlice';

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
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
        <Route path="/items" element={<ProtectedRoute><ViewItems /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
