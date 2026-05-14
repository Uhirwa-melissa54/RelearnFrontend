import React from 'react';
import { BookOpen, LayoutGrid, LogOut } from 'lucide-react';
import './TeacherSidebar.css';

const TeacherSidebar = ({ currentView, onNavigate }) => {
  return (
    <aside className="sidebar teacher-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <BookOpen size={24} className="logo-icon" color="#ffffff" />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">Relearn</span>
            <span className="logo-subtitle">Teacher</span>
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
          className={`nav-item ${currentView === 'assignments' || currentView === 'assignment-details' || currentView === 'review-submission' ? 'active' : ''}`}
          onClick={() => onNavigate('assignments')}
        >
          <FileText size={20} />
          <span>Assignments</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'all-classes' || currentView === 'class' ? 'active' : ''}`}
          onClick={() => onNavigate('all-classes')}
        >
          <BookOpen size={20} />
          <span>My Classes</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div 
          className="user-profile-card"
          onClick={() => onNavigate('profile')}
        >
          <div className="avatar">
            T
          </div>
          <div className="user-info">
            <span className="user-name">Teacher User</span>
            <span className="user-email">teacher@relearn.edu</span>
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

export default TeacherSidebar;
