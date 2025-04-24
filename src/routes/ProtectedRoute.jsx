import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { access, user, loadingUser, initialized } = useSelector((state) => state.auth);

  // Wait until we finish checking
  if (access && !initialized) {
    return <div className="p-4 text-center">🔄 Checking session...</div>;
  }

  if (!access || (!user && initialized)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
