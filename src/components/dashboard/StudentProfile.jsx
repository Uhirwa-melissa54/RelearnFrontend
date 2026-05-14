import React, { useState } from 'react';
import { User, Mail, Shield, Save } from 'lucide-react';
import './StudentProfile.css';

const StudentProfile = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // Handle password change logic here
    alert("Password successfully changed!");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="student-profile">
      <header className="profile-header">
        <h1>Student Profile</h1>
        <p>Manage your account settings and security</p>
      </header>

      <div className="profile-grid">
        <div className="profile-info-card card-box">
          <div className="profile-avatar-large">
            U
          </div>
          <h2>Uhirwa Melissa</h2>
          <p className="role-badge">Student</p>
          
          <div className="info-list">
            <div className="info-item">
              <Mail size={18} color="#6b7280" />
              <span>uhirwamelissa@relearn.edu</span>
            </div>
            <div className="info-item">
              <User size={18} color="#6b7280" />
              <span>Username: uhirwamelissa</span>
            </div>
            <div className="info-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#4b5563', fontSize: '0.95rem', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <strong>Class:</strong> Y2A Mathematics
            </div>
            <div className="info-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#4b5563', fontSize: '0.95rem', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <strong>Academic Year:</strong> 2026
            </div>
            <div className="info-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#4b5563', fontSize: '0.95rem', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <strong>Joined:</strong> September 1, 2024
            </div>
          </div>
        </div>

        <div className="security-card card-box">
          <div className="section-title">
            <Shield size={24} color="#1A264A" />
            <h2>Security Settings</h2>
          </div>
          
          <form className="password-form" onSubmit={handlePasswordChange}>
            <h3>Change Password</h3>
            
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit" className="btn-save">
              <Save size={18} />
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
