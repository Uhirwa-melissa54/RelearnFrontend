import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, LogOut } from 'lucide-react';
import { teacherApi, getUser, performLogout } from '../../api';
import { useNavigate } from 'react-router-dom';

const TeacherProfile = ({ onNavigate }) => {
  const [profile, setProfile]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]   = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError]           = useState('');
  const [pwSuccess, setPwSuccess]       = useState(false);
  const [saving, setSaving]             = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await teacherApi.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (newPassword !== confirmPassword) { setPwError("New passwords don't match!"); return; }
    if (newPassword.length < 6)          { setPwError('Password must be at least 6 characters.'); return; }

    setSaving(true);
    try {
      await teacherApi.changePassword({ currentPassword, newPassword });
      setPwSuccess(true);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await performLogout();
    navigate('/login');
  };

  if (loading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading profile...</div>
  );

  const displayProfile = profile || user;

  return (
    <div className="student-profile">
      <header className="profile-header">
        <h1>Teacher Profile</h1>
        <p>Manage your account settings and security</p>
      </header>

      <div className="profile-grid">
        {/* Info Card */}
        <div className="profile-info-card card-box">
          <div className="profile-avatar-large">
            {(displayProfile?.fullName || 'T').charAt(0).toUpperCase()}
          </div>
          <h2>{displayProfile?.fullName || 'Teacher'}</h2>
          <p className="role-badge">Teacher</p>

          <div className="info-list">
            <div className="info-item">
              <Mail size={18} color="#6b7280" />
              <span>{displayProfile?.email || '—'}</span>
            </div>
            <div className="info-item">
              <User size={18} color="#6b7280" />
              <span>Role: {displayProfile?.role || 'TEACHER'}</span>
            </div>
            {displayProfile?.joinedDate && (
              <div className="info-item" style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', justifyContent: 'center' }}>
                <strong>Joined:</strong>&nbsp;{new Date(displayProfile.joinedDate).toLocaleDateString()}
              </div>
            )}
          </div>

          <button onClick={handleLogout}
            style={{ marginTop: '20px', width: '100%', padding: '10px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}>
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Security Card */}
        <div className="security-card card-box">
          <div className="section-title">
            <Shield size={24} color="#00234b" />
            <h2>Security Settings</h2>
          </div>

          {pwSuccess && (
            <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #86efac' }}>
              Password changed successfully!
            </div>
          )}
          {pwError && (
            <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fca5a5' }}>
              {pwError}
            </div>
          )}

          <form className="password-form" onSubmit={handlePasswordChange}>
            <h3>Change Password</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password" required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password" required />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password" required />
            </div>
            <button type="submit" className="btn-save" disabled={saving}>
              <Save size={18} /> {saving ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
