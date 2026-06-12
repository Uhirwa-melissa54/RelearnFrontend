import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Activity, TrendingUp } from 'lucide-react';
import './AdminOverview.css';
import { adminApi } from '../../api';

const AdminOverview = ({ onNavigate }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.getDashboard();
        setDashboard(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const quickActions = [
    { label: 'Manage Users',    desc: 'Register and manage students and teachers', icon: <Users size={28} color="#00234b" />,   view: 'manage-users' },
    { label: 'Manage Classes',  desc: 'Create and organize class structures',       icon: <BookOpen size={28} color="#00234b" />, view: 'manage-classes' },
    { label: 'View Reports',    desc: 'Analytics and performance metrics',           icon: <TrendingUp size={28} color="#00234b" />, view: 'overview' },
  ];

  if (loading) {
    return (
      <div className="admin-overview">
        <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-overview">
        <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626', backgroundColor: '#fef2f2', borderRadius: '12px', margin: '20px' }}>
          {error}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Students',  value: dashboard?.totalStudents?.toLocaleString() || '0',  icon: <Users size={28} color="#00234b" />,   iconBg: '#eef2ff' },
    { label: 'Total Teachers',  value: dashboard?.totalTeachers?.toLocaleString() || '0',  icon: <Users size={28} color="#059669" />,   iconBg: '#ecfdf5' },
    { label: 'Active Classes',  value: dashboard?.totalActiveClasses?.toLocaleString() || '0', icon: <BookOpen size={28} color="#7c3aed" />, iconBg: '#f5f3ff' },
    { label: 'System Activity', value: `${dashboard?.systemActivityPercentage ?? 0}%`,     icon: <Activity size={28} color="#d97706" />, iconBg: '#fffbeb' },
  ];

  return (
    <div className="admin-overview">
      <header className="admin-overview-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your school's academic platform</p>
      </header>

      {/* Stats */}
      <div className="admin-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card card-box">
            <div className="asc-top">
              <div className="asc-icon" style={{ backgroundColor: stat.iconBg }}>
                {stat.icon}
              </div>
            </div>
            <div className="asc-value">{stat.value}</div>
            <div className="asc-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="admin-quick-actions card-box">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="qa-grid">
          {quickActions.map((qa, i) => (
            <button key={i} className="qa-card" onClick={() => onNavigate(qa.view)}>
              <div className="qa-icon">{qa.icon}</div>
              <div className="qa-text">
                <strong>{qa.label}</strong>
                <span>{qa.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="admin-recent-activity card-box">
        <h2 className="admin-section-title">Recent Activity</h2>
        <div className="activity-list">
          {(dashboard?.recentActivities || []).length === 0 ? (
            <p style={{ color: '#9ca3af', padding: '16px 0' }}>No recent activity.</p>
          ) : (
            (dashboard?.recentActivities || []).map(item => (
              <div key={item.id} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-content">
                  <span className="activity-text">{item.description}</span>
                  <span className="activity-sub">
                    {item.actorName || 'System'} · {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
