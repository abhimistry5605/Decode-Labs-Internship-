import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Layers, ShoppingBag, Send, FilePlus2, Trash2, Users, MessageSquare, Edit3 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // States
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin specific states
  const [adminTab, setAdminTab] = useState('orders'); // 'orders', 'inquiries', 'products', 'users', 'messages'
  const [editingId, setEditingId] = useState(null);
  
  const [newKit, setNewKit] = useState({
    name: '',
    category: 'Embedded Systems Kits',
    description: '',
    price: '',
    stock: '',
    difficultyLevel: 'Intermediate',
    componentsList: '',
    projectsList: '',
  });
  
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch Orders
      const orderUrl = user.role === 'admin' ? '/api/orders/admin' : '/api/orders/user';
      const orderRes = await api.get(orderUrl);
      setOrders(orderRes.data);

      // Fetch Inquiries (if Faculty or Admin)
      if (user.role === 'admin' || user.role === 'faculty') {
        const inquiryRes = await api.get('/api/inquiries');
        setInquiries(inquiryRes.data);
      }

      // Fetch admin data blocks
      if (user.role === 'admin') {
        // Fetch Catalog Kits
        const prodRes = await api.get('/api/products');
        setProducts(prodRes.data);

        // Fetch registered user list
        const usersRes = await api.get('/api/users');
        setUsersList(usersRes.data);

        // Fetch general contact form messages
        const contactsRes = await api.get('/api/contact');
        setContacts(contactsRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Admin actions
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/api/orders/${orderId}`, { status: newStatus });
      if (response.status === 200) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const response = await api.put(`/api/inquiries/${inquiryId}/status`, { status: newStatus });
      if (response.status === 200) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this training kit?')) return;
    try {
      const response = await api.delete(`/api/products/${productId}`);
      if (response.status === 200) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingId(prod.id || prod._id);
    let featuresList = '';
    if (Array.isArray(prod.features)) {
      featuresList = prod.features.join('\n');
    } else {
      try {
        const parsed = JSON.parse(prod.componentsList);
        featuresList = parsed.join('\n');
      } catch (e) {
        featuresList = typeof prod.componentsList === 'string' ? prod.componentsList.replace(/,/g, '\n') : '';
      }
    }

    setNewKit({
      name: prod.name,
      category: prod.category || 'Embedded Systems Kits',
      description: prod.description,
      price: prod.price,
      stock: prod.stock || 10,
      difficultyLevel: prod.difficultyLevel || 'Intermediate',
      componentsList: featuresList,
      projectsList: featuresList
    });
    setAdminSuccess(`Editing "${prod.name}". Scroll up to modify properties.`);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await api.put(`/api/users/${userId}/role`, { role: newRole });
      if (response.status === 200) {
        fetchDashboardData();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update user role.';
      alert(msg);
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (!newKit.name || !newKit.description || !newKit.price) {
      setAdminError('Please fill in name, description, and price.');
      return;
    }

    try {
      const featuresArray = newKit.componentsList
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const payload = {
        name: newKit.name,
        category: newKit.category,
        description: newKit.description,
        price: parseFloat(newKit.price),
        stock: newKit.stock ? parseInt(newKit.stock) : 10,
        features: featuresArray,
        image: newKit.category === 'Robotics Kits' 
          ? '/photos/products/robotics_kit.jpg' 
          : newKit.category === 'IoT Kits' 
            ? '/photos/products/electronics_equipment.jpg' 
            : '/photos/products/arduino_board.jpg'
      };

      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      
      const response = await api({
        method: editingId ? 'PUT' : 'POST',
        url: url,
        data: payload
      });

      if (response.status === 200 || response.status === 201) {
        setAdminSuccess(editingId ? 'Training kit updated successfully!' : 'New training kit registered successfully!');
        setEditingId(null);
        setNewKit({
          name: '',
          category: 'Embedded Systems Kits',
          description: '',
          price: '',
          stock: '',
          difficultyLevel: 'Intermediate',
          componentsList: '',
          projectsList: '',
        });
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
      setAdminError(err.response?.data?.message || 'Connection failure. Try again.');
    }
  };

  if (loading) {
    return (
      <div className="loader-container page-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    if (status === 'pending') return 'status-badge stat-pending';
    if (status === 'approved' || status === 'resolved') return 'status-badge stat-completed';
    if (status === 'shipped') return 'status-badge stat-shipped';
    if (status === 'contacted') return 'status-badge stat-contacted';
    return 'status-badge stat-cancelled';
  };

  return (
    <div className="container" style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }} id="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          Workspace <span>Dashboard</span>
        </h1>
        <p style={{ marginTop: '8px' }}>
          Signed in as: <strong>{user.name}</strong> ({user.role}) | College: <strong>{user.institutionName || 'Self-Learner'}</strong>
        </p>
      </div>

      {/* STUDENT & FACULTY VIEW */}
      {user.role !== 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Purchase History */}
          <div className="dashboard-card card-panel">
            <h3>
              <ShoppingBag className="dash-icon-title" size={18} />
              My Purchases History
            </h3>
            {orders.length === 0 ? (
              <p className="no-records-text">No purchases found. Search our catalog to get training kits.</p>
            ) : (
              <div className="records-table-container">
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>Reference ID</th>
                      <th>Date</th>
                      <th>Kits Summary</th>
                      <th>Status</th>
                      <th>Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => {
                      const items = JSON.parse(ord.items);
                      return (
                        <tr key={ord.id}>
                          <td className="mono-cell">{ord.id.substring(0, 8)}...</td>
                          <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                          <td>
                            <ul className="items-cell-list">
                              {items.map((it, idx) => (
                                <li key={idx}>{it.name} <span className="qty-sub">x{it.quantity}</span></li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <span className={getStatusBadgeClass(ord.status)}>{ord.status}</span>
                          </td>
                          <td className="bold-cell">₹{ord.totalPrice}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Institutional Quote Log (Faculty Reps only) */}
          {user.role === 'faculty' && (
            <div className="dashboard-card card-panel">
              <h3>
                <Send className="dash-icon-title" size={18} />
                My Bulk Inquiries Log
              </h3>
              {inquiries.length === 0 ? (
                <p className="no-records-text">No quotes submitted yet. Submit quotes using the quote portal.</p>
              ) : (
                <div className="records-table-container">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>Reference ID</th>
                        <th>Kit Name</th>
                        <th>Volume</th>
                        <th>Status</th>
                        <th>My Message / Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inq) => (
                        <tr key={inq.id}>
                          <td className="mono-cell">{inq.id.substring(0, 8)}...</td>
                          <td className="bold-cell">{inq.kitName}</td>
                          <td>{inq.quantity} units</td>
                          <td>
                            <span className={getStatusBadgeClass(inq.status)}>{inq.status}</span>
                          </td>
                          <td className="message-cell italic-cell">{inq.message || 'None.'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ADMIN CONTROL PANEL */}
      {user.role === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Tab Switcher */}
          <div className="admin-tabs">
            <button 
              className={`admin-tab-btn ${adminTab === 'orders' ? 'active' : ''}`}
              onClick={() => setAdminTab('orders')}
            >
              <ShoppingBag size={16} /> Orders ({orders.length})
            </button>
            <button 
              className={`admin-tab-btn ${adminTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => setAdminTab('inquiries')}
            >
              <Send size={16} /> Inquiries ({inquiries.length})
            </button>
            <button 
              className={`admin-tab-btn ${adminTab === 'products' ? 'active' : ''}`}
              onClick={() => setAdminTab('products')}
            >
              <Layers size={16} /> Inventory ({products.length})
            </button>
            <button 
              className={`admin-tab-btn ${adminTab === 'messages' ? 'active' : ''}`}
              onClick={() => setAdminTab('messages')}
            >
              <MessageSquare size={16} /> Messages ({contacts.length})
            </button>
            <button 
              className={`admin-tab-btn ${adminTab === 'users' ? 'active' : ''}`}
              onClick={() => setAdminTab('users')}
            >
              <Users size={16} /> Users ({usersList.length})
            </button>
          </div>

          {/* TAB 1: ALL ORDERS */}
          {adminTab === 'orders' && (
            <div className="dashboard-card card-panel">
              <h3>Purchase Order Database</h3>
              {orders.length === 0 ? (
                <p className="no-records-text">No purchases logged.</p>
              ) : (
                <div className="records-table-container">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>Customer & Campus</th>
                        <th>Purchases</th>
                        <th>Address</th>
                        <th>Total Paid</th>
                        <th>Fulfillment Stage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => {
                        const items = JSON.parse(ord.items);
                        return (
                          <tr key={ord.id}>
                            <td>
                              <div className="bold-cell">{ord.user ? ord.user.name : 'System Guest'}</div>
                              <div className="sub-detail">{ord.user ? ord.user.email : ''}</div>
                              <div className="sub-detail-inst">{ord.user && ord.user.institutionName ? ord.user.institutionName : 'Individual'}</div>
                            </td>
                            <td>
                              <ul className="items-cell-list">
                                {items.map((it, idx) => (
                                  <li key={idx} style={{ fontSize: '0.8rem' }}>{it.name} <span className="qty-sub">x{it.quantity}</span></li>
                                ))}
                              </ul>
                            </td>
                            <td className="address-cell">{ord.shippingAddress} (Ph: {ord.contactPhone || 'N/A'})</td>
                            <td className="bold-cell">₹{ord.totalPrice}</td>
                            <td>
                              <select
                                className="select-box grid-select"
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BULK INQUIRIES */}
          {adminTab === 'inquiries' && (
            <div className="dashboard-card card-panel">
              <h3>Academic Quotes Inbox</h3>
              {inquiries.length === 0 ? (
                <p className="no-records-text">No quote messages logged.</p>
              ) : (
                <div className="records-table-container">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>Campus Rep</th>
                        <th>College / Institution</th>
                        <th>Requested Kit & Volume</th>
                        <th>Inquiry Details</th>
                        <th>Action Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inq) => (
                        <tr key={inq.id}>
                          <td>
                            <div className="bold-cell">{inq.name}</div>
                            <div className="sub-detail">{inq.email}</div>
                            <div className="sub-detail">{inq.phone}</div>
                          </td>
                          <td className="bold-cell">{inq.institutionName}</td>
                          <td>
                            <div className="bold-cell" style={{ fontSize: '0.8rem' }}>{inq.kitName}</div>
                            <div className="qty-sub">{inq.quantity} units requested</div>
                          </td>
                          <td className="message-cell message-cell-wide">{inq.message || 'No additional remarks.'}</td>
                          <td>
                            <select
                              className="select-box grid-select"
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INVENTORY CRUD */}
          {adminTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Add/Edit Form */}
              <form onSubmit={handleAddProductSubmit} className="add-product-form card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <FilePlus2 className="logo-icon" size={20} />
                  {editingId ? 'Edit Product Kit Details' : 'Register New Training Kit'}
                </h3>
                
                {adminError && <div className="error-alert">{adminError}</div>}
                {adminSuccess && <div className="success-alert">{adminSuccess}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="filter-group-item">
                    <label className="select-label">Kit Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. ESP32 Automation Sandbox"
                      value={newKit.name}
                      onChange={(e) => setNewKit({ ...newKit, name: e.target.value })}
                    />
                  </div>
                  <div className="filter-group-item">
                    <label className="select-label">Category *</label>
                    <select
                      className="select-box"
                      value={newKit.category}
                      onChange={(e) => setNewKit({ ...newKit, category: e.target.value })}
                    >
                      <option value="Arduino Kits">Arduino Kits</option>
                      <option value="IoT Kits">IoT Kits</option>
                      <option value="Robotics Kits">Robotics Kits</option>
                      <option value="Embedded Systems Kits">Embedded Systems Kits</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  <div className="filter-group-item">
                    <label className="select-label">Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={newKit.price}
                      onChange={(e) => setNewKit({ ...newKit, price: e.target.value })}
                    />
                  </div>
                  <div className="filter-group-item">
                    <label className="select-label">Initial Stock *</label>
                    <input
                      type="number"
                      placeholder="20"
                      value={newKit.stock}
                      onChange={(e) => setNewKit({ ...newKit, stock: e.target.value })}
                    />
                  </div>
                  <div className="filter-group-item">
                    <label className="select-label">Difficulty Level</label>
                    <select
                      className="select-box"
                      value={newKit.difficultyLevel}
                      onChange={(e) => setNewKit({ ...newKit, difficultyLevel: e.target.value })}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="filter-group-item">
                  <label className="select-label">Kit Description *</label>
                  <textarea
                    className="text-area-input"
                    rows="3"
                    placeholder="Briefly summarize the target concepts..."
                    value={newKit.description}
                    onChange={(e) => setNewKit({ ...newKit, description: e.target.value })}
                  />
                </div>

                <div className="filter-group-item">
                  <label className="select-label" style={{ fontFamily: 'monospace' }}>Kit Features (one per line) *</label>
                  <textarea
                    className="text-area-input"
                    style={{ fontFamily: 'monospace' }}
                    rows="4"
                    placeholder="Arduino Uno board&#10;1x Breadboard&#10;Jumper wires"
                    value={newKit.componentsList}
                    onChange={(e) => setNewKit({ ...newKit, componentsList: e.target.value, projectsList: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn-primary">
                    {editingId ? 'Save Changes' : 'Register Catalog Kit'}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingId(null);
                        setNewKit({
                          name: '', category: 'Embedded Systems Kits', description: '', price: '', stock: '', difficultyLevel: 'Intermediate', componentsList: '', projectsList: ''
                        });
                        setAdminSuccess('');
                      }} 
                      className="btn-secondary"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {/* Kits Inventory Table */}
              <div className="dashboard-card card-panel">
                <h3>Active Catalog Kits Inventory</h3>
                <div className="records-table-container">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>Kit Name & Category</th>
                        <th>Difficulty</th>
                        <th>Price</th>
                        <th>Stock Available</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod.id || prod._id}>
                          <td>
                            <strong className="bold-cell">{prod.name}</strong> <br />
                            <span className="sub-detail">{prod.category}</span>
                          </td>
                          <td>
                            <span className="status-badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                              {prod.difficultyLevel}
                            </span>
                          </td>
                          <td className="bold-cell">₹{prod.price}</td>
                          <td>{prod.stock} units</td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleEditProductClick(prod)}
                                className="btn-secondary delete-btn-circle"
                                title="Edit Product Kit"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id || prod._id)}
                                className="btn-secondary delete-btn-circle"
                                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                title="Delete Product Kit"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT MESSAGES */}
          {adminTab === 'messages' && (
            <div className="dashboard-card card-panel">
              <h3>Contact Form Messages Log</h3>
              {contacts.length === 0 ? (
                <p className="no-records-text">No general feedback messages recorded.</p>
              ) : (
                <div className="records-table-container">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact Details</th>
                        <th>Message / Comment</th>
                        <th>Received Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((c) => (
                        <tr key={c.id || c._id}>
                          <td className="bold-cell">{c.name}</td>
                          <td>
                            <div className="sub-detail">Email: {c.email}</div>
                            <div className="sub-detail">Phone: {c.phone}</div>
                          </td>
                          <td className="message-cell message-cell-wide">{c.message}</td>
                          <td>{new Date(c.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: USERS ROLE PRIVILEGES */}
          {adminTab === 'users' && (
            <div className="dashboard-card card-panel">
              <h3>Registered Users Accounts</h3>
              {usersList.length === 0 ? (
                <p className="no-records-text">No users found.</p>
              ) : (
                <div className="records-table-container">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Academic College</th>
                        <th>Active Role Privilege</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u.id || u._id}>
                          <td className="bold-cell">{u.name}</td>
                          <td className="mono-cell">{u.email}</td>
                          <td>{u.institutionName || 'Self-Learner / Individual'}</td>
                          <td>
                            <select
                              className="select-box grid-select"
                              style={{ fontWeight: '600' }}
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u.id || u._id, e.target.value)}
                              disabled={u.email === user.email} // Disable editing self-privilege
                            >
                              <option value="student">Student</option>
                              <option value="faculty">Faculty</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
