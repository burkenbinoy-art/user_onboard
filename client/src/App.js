import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    hobbies: '',
    bio: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data.users);
      setMessage('Users loaded successfully!');
    } catch (err) {
      setMessage('Error fetching users');
      console.error(err);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        age: formData.age ? Number(formData.age) : null,
        hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(h => h),
        bio: formData.bio
      };

      if (editingId) {
        // Update user
        const res = await axios.put(`${API_URL}/users/${editingId}`, userData);
        setMessage(res.data.message);
        setEditingId(null);
      } else {
        // Create user
        const res = await axios.post(`${API_URL}/add-user`, userData);
        setMessage(res.data.message);
      }

      setFormData({ name: '', email: '', age: '', hobbies: '', bio: '' });
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error saving user');
      console.error(err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await axios.delete(`${API_URL}/users/${id}`);
        setMessage(res.data.message);
        fetchUsers();
      } catch (err) {
        setMessage('Error deleting user');
        console.error(err);
      }
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      age: user.age || '',
      hobbies: user.hobbies.join(', '),
      bio: user.bio
    });
    setEditingId(user._id);
  };

  // Search users
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/search?query=${searchQuery}`);
      setUsers(res.data.users);
      setMessage(`Found ${res.data.count} results`);
    } catch (err) {
      setMessage('Error searching users');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>👥 User Management System</h1>
        <p>MongoDB & Node.js User Management</p>
      </header>

      <div className="container">
        {/* Message Display */}
        {message && <div className="message">{message}</div>}

        {/* Form Section */}
        <section className="form-section">
          <h2>{editingId ? '✏️ Edit User' : '➕ Add New User'}</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              name="name"
              placeholder="Name (min 3 chars)"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age (0-120)"
              value={formData.age}
              onChange={handleInputChange}
              min="0"
              max="120"
            />
            <input
              type="text"
              name="hobbies"
              placeholder="Hobbies (comma-separated)"
              value={formData.hobbies}
              onChange={handleInputChange}
            />
            <textarea
              name="bio"
              placeholder="Bio (for text search)"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
            />
            <div className="form-buttons">
              <button type="submit">{editingId ? '💾 Update' : '✅ Add User'}</button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', email: '', age: '', hobbies: '', bio: '' });
                  }}
                  className="cancel-btn"
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Search Section */}
        <section className="search-section">
          <h2>🔍 Search Users</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by name or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                fetchUsers();
              }}
            >
              Clear
            </button>
          </form>
        </section>

        {/* Users List */}
        <section className="users-section">
          <h2>📋 All Users ({users.length})</h2>
          {users.length === 0 ? (
            <p className="no-users">No users found. Add a new user to get started!</p>
          ) : (
            <div className="users-grid">
              {users.map(user => (
                <div key={user._id} className="user-card">
                  <h3>{user.name}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  {user.age && <p><strong>Age:</strong> {user.age}</p>}
                  {user.hobbies.length > 0 && (
                    <p><strong>Hobbies:</strong> {user.hobbies.join(', ')}</p>
                  )}
                  {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                  <p className="user-id"><small>ID: {user.userId}</small></p>
                  <p className="created-at"><small>Added: {new Date(user.createdAt).toLocaleDateString()}</small></p>
                  <div className="user-actions">
                    <button
                      onClick={() => handleEdit(user)}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;