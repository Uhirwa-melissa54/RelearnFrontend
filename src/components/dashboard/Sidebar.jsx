import React from 'react';
import { BookOpen, LayoutGrid, FileText, History, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ currentView, onNavigate }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <BookOpen size={24} className="logo-icon" color="#ffffff" />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">Relearn</span>
            <span className="logo-subtitle">Student</span>
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
          className={`nav-item ${currentView === 'assignments' ? 'active' : ''}`}
          onClick={() => onNavigate('assignments')}
        >
          <FileText size={20} />
          <span>Assignments</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'all-classes' ? 'active' : ''}`}
          onClick={() => onNavigate('all-classes')}
        >
          <BookOpen size={20} />
          <span>All Classes</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'history' ? 'active' : ''}`}
          onClick={() => onNavigate('history')}
        >
          <History size={20} />
          <span>Academic History</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div 
          className="user-profile-card" 
          onClick={() => onNavigate('profile')}
        >
          <div className="avatar">
            U
          </div>
          <div className="user-info">
            <span className="user-name">Uhirwa Melissa</span>
            <span className="user-email">uhirwamelissa@relearn.edu</span>
          </div>
        </div>
        <button className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
