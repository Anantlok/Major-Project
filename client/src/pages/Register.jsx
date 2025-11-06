import React, { useState } from 'react';
// 🛑 IMPORT THE CENTRALIZED API CLIENT INSTEAD OF AXIOS
import api from '../utils/api'; 
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiCpu } from 'react-icons/fi'; // Import icons

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { name, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 🛑 USE 'api.post' with the relative path. 
      // The dynamic URL (Render URL) is handled in api.js.
      await api.post('/auth/register', {
        name, email, password,
      });
      // Optionally show a success message before navigating
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="icon-wrapper">
          <FiCpu size={24} color="var(--accent)" />
        </div>
        <h1>Create Account</h1>
      </div>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <FiUser className="input-icon" />
          <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="input-group">
          <FiMail className="input-icon" />
          <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="input-group">
          <FiLock className="input-icon" />
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} minLength="6" required />
        </div>
        <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
          Register
        </button>
      </form>
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
      <p style={{marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-light)'}}>
        Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
      </p>
    </div>
  );
}

export default Register;