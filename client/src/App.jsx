import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './utils/api';
import PCVisualizer from './components/PCVisualizer';
import './App.css';
import {
  FiLogOut, FiPlus, FiTrash2, FiExternalLink, FiCpu, FiGrid
} from 'react-icons/fi';

// --- CATEGORY LIST ---
const CATEGORIES = [
  'CPU', 'GPU', 'Monitor', 'Keyboard', 'Mouse',
  'Motherboard', 'RAM', 'Storage', 'Case', 'Other'
];
const FILTER_CATEGORIES = ['All', ...CATEGORIES];

function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [myBuild, setMyBuild] = useState({ products: [] });
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [error, setError] = useState('');
  
  // --- NEW STATE FOR FILTER ---
  const [activeFilter, setActiveFilter] = useState('All');

  // --- ADMIN FORM STATE ---
  const [adminFormData, setAdminFormData] = useState({
    title: '', productUrl: '', imageUrl: '', price: '', model3DUrl: '',
    category: 'Other', // Add category to admin form
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    setUserRole(localStorage.getItem('role'));
    api.get('/products').then(res => setAllProducts(res.data)).catch(err => console.error('Error fetching master list', err));
    api.get('/build').then(res => setMyBuild(res.data)).catch(err => console.error('Error fetching user build', err));
  }, [navigate]);

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const addToBuild = async (productId) => {
    try {
      const res = await api.post(`/build/add/${productId}`);
      setMyBuild(res.data);
    } catch (err) { console.error('Error adding to build', err); }
  };

  const removeFromBuild = async (productId) => {
    try {
      const res = await api.delete(`/build/remove/${productId}`);
      setMyBuild(res.data);
    } catch (err) { console.error('Error removing from build', err); }
  };
  
  const onAdminFormChange = (e) =>
    setAdminFormData({ ...adminFormData, [e.target.name]: e.target.value });

  const onAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/products/add', adminFormData);
      setAllProducts([res.data, ...allProducts]);
      setAdminFormData({
        title: '', productUrl: '', imageUrl: '', price: '', model3DUrl: '', category: 'Other'
      });
    } catch (err) { setError(err.response?.data?.msg || 'Failed to add product'); }
  };

  // --- CALCULATIONS ---
  const totalPrice = myBuild.products.reduce((sum, product) => sum + (product.price || 0), 0);

  // --- NEW FILTER LOGIC ---
  const filteredProducts = allProducts.filter(product => {
    if (activeFilter === 'All') return true;
    return product.category === activeFilter;
  });

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiCpu size={24} color="var(--accent)" />
          <h1 style={{ fontSize: '1.5rem' }}>PC Part Builder</h1>
        </div>
        <button onClick={onLogout} className="btn btn-danger">
          <FiLogOut />
          <span>Logout</span>
        </button>
      </nav>

      <div className="main-content">
        
        {/* --- LEFT COLUMN: MY BUILD --- */}
        <div className="build-section">
          <div className="section-header">
            <h2>My Build</h2>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>
          <div className="my-build-list">
            {myBuild.products.length > 0 ? (
              myBuild.products.map(product => (
                <div key={product._id} className="build-item-card">
                  <div className="build-item-info">
                    <span>{product.title}</span>
                    <strong>${product.price}</strong>
                  </div>
                  <button onClick={() => removeFromBuild(product._id)} className="btn btn-outline">
                    <FiTrash2 />
                  </button>
                </div>
              ))
            ) : (
              <p>Your build is empty. Add parts from the list.</p>
            )}
          </div>
        </div>
        
        {/* --- CENTER COLUMN: VISUALIZER --- */}
        <div className="visualizer-section">
          <div className="section-header">
            <h2>Your 3D Build</h2>
          </div>
          <div className="visualizer-wrapper">
            <PCVisualizer products={myBuild.products} />
          </div>
        </div>

        {/* --- RIGHT COLUMN: MASTER LIST --- */}
        <div className="list-section">
          <div className="section-header">
            <h2>All Parts</h2>
          </div>
          
          {/* --- NEW FILTER BUTTONS --- */}
          <div className="product-list-filter">
            {FILTER_CATEGORIES.map(category => (
              <button
                key={category}
                className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="product-list">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.imageUrl} alt={product.title} className="product-image" />
                <div className="product-info">
                  <h4>{product.title}</h4>
                  <p className="product-price">${product.price}</p>
                  <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="btn-link">
                    View Product <FiExternalLink size={12} style={{ marginLeft: '4px' }} />
                  </a>
                </div>
                <button onClick={() => addToBuild(product._id)} className="btn btn-primary" style={{ padding: '8px' }}>
                  <FiPlus />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- BOTTOM ROW: ADMIN FORM --- */}
        {userRole === 'admin' && (
          <div className="admin-section">
            <div className="section-header">
              <h2><FiGrid style={{ marginRight: '8px' }} /> Admin: Add New Part</h2>
            </div>
            <form onSubmit={onAdminSubmit} className="product-form">
              <input name="title" value={adminFormData.title} onChange={onAdminFormChange} placeholder="Product Title" required />
              <input name="productUrl" value={adminFormData.productUrl} onChange={onAdminFormChange} placeholder="Product URL" required />
              <input name="imageUrl" value={adminFormData.imageUrl} onChange={onAdminFormChange} placeholder="Image URL" required />
              <input name="price" value={adminFormData.price} onChange={onAdminFormChange} placeholder="Price" type="number" required />
              <input name="model3DUrl" value={adminFormData.model3DUrl} onChange={onAdminFormChange} placeholder="3D Model URL" />
              
              {/* --- NEW CATEGORY DROPDOWN --- */}
              <select name="category" value={adminFormData.category} onChange={onAdminFormChange} required>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>
                <FiPlus />
                <span>Add Product</span>
              </button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;