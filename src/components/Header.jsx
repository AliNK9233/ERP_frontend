import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '@/features/auth/authSlice';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-2 p-4 border-b shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 w-20 h-4">TEST</div>
          {user?.business_logo && (
            <img
              src={user.business_logo.startsWith('http') ? user.business_logo : `http://localhost:8000${user.business_logo}`}
              alt="Logo"
              className="rounded-full object-cover"
              style={{ width: "40px", height: "40px" }}
            />
          )}
          <h2 className="font-semibold text-lg">{user?.business_name}</h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">👤 {user?.username} ({user?.role})</span>
          <button onClick={handleLogout} className="text-red-600 hover:underline text-sm">Logout</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-2 text-sm">
        <Link to="/dashboard" className="text-blue-600 underline">Dashboard</Link>
        <Link to="/add-item" className="text-blue-600 underline">Add Item</Link>
        <Link to="/items" className="text-blue-600 underline">View Items</Link>
        <Link to="/add-customer" className="text-blue-600 underline">Add Customer</Link>
        <Link to="/customers" className="text-blue-600 underline">View Customers</Link>
        <Link to="/add-sale" className="text-blue-600 underline">Add Sale</Link>
        <Link to="/sales" className="text-blue-600 underline">View Sales</Link>
      </div>
    </div>
  );
};

export default Header;
