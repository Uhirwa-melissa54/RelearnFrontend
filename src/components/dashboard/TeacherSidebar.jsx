import React from 'react';
import { BookOpen, LayoutGrid, FileText, LogOut } from 'lucide-react';
import './TeacherSidebar.css';
import { getUser, performLogout } from '../../api';
import { useNavigate } from 'react-router-dom';

const TeacherSidebar = ({ currentView, onNavigate }) => {
  const user = getUser();
  const navigate = useNavigate();

  const isClassActive      = ['all-classes', 'class', 'upload-notes'].includes(currentView);
  const isAssignmentActive = ['assignments', 'assignment-details', 'review-submission', 'create-assignment'].includes(currentView);

  const handleLogout = async () => {
    await performLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar teacher-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <BookOpen size={24} color="#ffffff" />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">Relearn</span>
            <span className="logo-subtitle">Teacher</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className={`nav-item ${currentView === 'overview' ? 'active' : ''}`}
          onClick={() => onNavigate('overview')}>
          <LayoutGrid size={20} /><span>Dashboard</span>
        </button>
        <button className={`nav-item ${isClassActive ? 'active' : ''}`}
          onClick={() => onNavigate('all-classes')}>
          <BookOpen size={20} /><span>My Classes</span>
        </button>
        <button className={`nav-item ${isAssignmentActive ? 'active' : ''}`}
          onClick={() => onNavigate('assignments')}>
          <FileText size={20} /><span>Assignments</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className={`user-profile-card ${currentView === 'profile' ? 'profile-active' : ''}`}
          onClick={() => onNavigate('profile')}>
          <div className="avatar">
            {(user?.fullName || 'T').charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.fullName || 'Teacher'}</span>
            <span className="user-email">{user?.email || ''}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} /><span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
