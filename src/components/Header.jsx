import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '@/features/auth/authSlice';
import './Header.css';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <img
          src={
            user?.business_logo
              ? user.business_logo.startsWith('http')
                ? user.business_logo
                : `http://localhost:8000${user.business_logo}`
              : '/placeholder-logo.png'
          }
          alt="Logo"
          className="brand-logo"
        />
        <div className="business-info">
          <h1>{user?.business_name || 'Business Name'}</h1>
          <span className="user-meta">👤 {user?.username} ({user?.role})</span>
        </div>
      </div>

      <div className="header-right">
        <nav className="nav-menu">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/add-item">Add Item</Link>
          <Link to="/items">Items</Link>
          <Link to="/add-customer">Add Customer</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/add-sale">Add Sale</Link>
          <Link to="/sales">Sales</Link>
        </nav>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </header>
  );
};

export default Header;
