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
          className={`nav-item ${currentView === 'assignment' ? 'active' : ''}`}
          onClick={() => onNavigate('overview')} // For prototype, clicking assignments can just go to overview or a specific assignment list if we had one. Let's just keep it active if currentView is assignment
        >
          <FileText size={20} />
          <span>Assignments</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'history' ? 'active' : ''}`}
          onClick={() => onNavigate('overview')}
        >
          <History size={20} />
          <span>Academic History</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-card">
          <div className="avatar">
            S
          </div>
          <div className="user-info">
            <span className="user-name">Student User</span>
            <span className="user-email">user@relearn.edu</span>
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
