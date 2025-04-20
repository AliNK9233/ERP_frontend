import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { access, user, loadingUser } = useSelector((state) => state.auth);

  // 🛑 Show loader while checking user
  if (access && loadingUser) {
    return <div className="p-4 text-center">🔄 Checking session...</div>;
  }

  // ❌ No token or no user, redirect to login
  if (!access || (!user && !loadingUser)) {
    return <Navigate to="/login" />;
  }

  // ✅ All good, show protected page
  return children;
};

export default ProtectedRoute;
