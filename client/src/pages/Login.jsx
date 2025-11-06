import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiCpu } from 'react-icons/fi';
// 🛑 IMPORT THE CENTRALIZED API CLIENT INSTEAD OF AXIOS
import api from './utils/api'; 

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 🛑 USE 'api.post' with the relative path. 
      // The baseURL logic (Render URL) is now handled in api.js.
      const res = await api.post('/auth/login', {
        email, password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="icon-wrapper">
          <FiCpu size={24} color="var(--accent)" />
        </div>
        <h1>Sign In</h1>
      </div>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <FiMail className="input-icon" />
          <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="input-group">
          <FiLock className="input-icon" />
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
          Login
        </button>
      </form>
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
      <p style={{marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-light)'}}>
        Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;