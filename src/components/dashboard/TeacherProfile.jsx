import React, { useState } from 'react';
import { Mail, User, BookOpen, Calendar, Lock } from 'lucide-react';
// We can reuse StudentProfile.css since the layout is identical
import './StudentProfile.css';

const TeacherProfile = ({ onNavigate }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords don't match!");
      return;
    }
    alert('Password updated successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleLogout = () => {
    // Implement actual logout logic
    alert('Logging out...');
    window.location.href = '/login';
  };

  return (
    <div className="student-profile">
      <header className="profile-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Teacher Profile</h1>
            <p>Manage your account settings and security</p>
          </div>
          <button className="btn-cancel" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} /> Logout
          </button>
        </div>
      </header>

      <div className="profile-grid">
        {/* Left Column: Teacher Info */}
        <div className="profile-info-card card-box">
          <div className="profile-avatar-large">
            T
          </div>
          <h2>Teacher User</h2>
          <p className="role-badge" style={{ backgroundColor: '#1A264A', color: 'white' }}>Teacher</p>
          
          <div className="info-list">
            <div className="info-item">
              <Mail size={18} color="#6b7280" />
              <span>teacher@relearn.edu</span>
            </div>
            <div className="info-item">
              <User size={18} color="#6b7280" />
              <span>Username: teacher_user</span>
            </div>
            <div className="info-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', color: '#4b5563', fontSize: '0.95rem', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <BookOpen size={18} color="#6b7280" />
              <strong>Assigned:</strong> Y1A, Y2B, Y3A
            </div>
            <div className="info-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', color: '#4b5563', fontSize: '0.95rem', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <Calendar size={18} color="#6b7280" />
              <strong>Joined:</strong> September 1, 2023
            </div>
          </div>
        </div>

        {/* Right Column: Security */}
        <div className="profile-security-card card-box">
          <h3>Change Password</h3>
          <p className="security-desc">Ensure your account is using a long, random password to stay secure.</p>
          
          <form onSubmit={handlePasswordSubmit} className="security-form">
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                name="current"
                value={passwords.current}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                name="new"
                value={passwords.new}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                name="confirm"
                value={passwords.confirm}
                onChange={handleChange}
                required 
              />
            </div>

            <button type="submit" className="btn-save-password">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
