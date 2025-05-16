import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, fetchUser } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './Styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setFormError('Username and password are required');
      return;
    }
    setFormError('');
    const res = await dispatch(loginUser({ username, password }));
    if (res.meta.requestStatus === 'fulfilled') {
      await dispatch(fetchUser());
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <header className="login-welcome">
        <h1>Welcome to Easy ERP</h1>
        <p>Sign in to manage your business smartly</p>
      </header>

      <div className="login-card">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {(formError || error) && (
            <div className="error">{formError || error}</div>
          )}
        </form>
      </div>

      <footer className="login-footer">
        © {new Date().getFullYear()} Easy ERP. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
