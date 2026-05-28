import React from 'react';
import { BookOpen, LayoutGrid, Users, LogOut } from 'lucide-react';
import './AdminSidebar.css';
import { getUser, performLogout } from '../../api';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ currentView, onNavigate }) => {
  const navigate = useNavigate();
  const user = getUser();
  const isUsersActive = currentView === 'manage-users' || currentView === 'add-user';
  const isClassesActive = currentView === 'manage-classes' || currentView === 'add-class';

  const handleLogout = async () => {
    await performLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar admin-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <BookOpen size={24} color="#ffffff" />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">Relearn</span>
            <span className="logo-subtitle">Admin</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentView === 'overview' ? 'active' : ''}`}
          onClick={() => onNavigate('overview')}
        >
          <LayoutGrid size={20} />
          <span>Dashboard</span>
        </button>
        <button
          className={`nav-item ${isUsersActive ? 'active' : ''}`}
          onClick={() => onNavigate('manage-users')}
        >
          <Users size={20} />
          <span>Manage Users</span>
        </button>
        <button
          className={`nav-item ${isClassesActive ? 'active' : ''}`}
          onClick={() => onNavigate('manage-classes')}
        >
          <BookOpen size={20} />
          <span>Manage Classes</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div
          className="user-profile-card"
          onClick={() => {}}
          title="Admin Profile"
        >
          <div className="avatar">{(user?.fullName || 'A').charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{user?.fullName || 'Admin User'}</span>
            <span className="user-email">{user?.email || 'user@relearn.edu'}</span>
          </div>
        </div>
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
