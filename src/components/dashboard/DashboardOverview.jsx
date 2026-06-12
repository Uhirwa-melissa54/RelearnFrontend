import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import './DashboardOverview.css';
import { studentApi, getUser } from '../../api';

const DashboardOverview = ({ onNavigate, onSelectData }) => {
  const [recentNotes, setRecentNotes]           = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [activeAssignments, setActiveAssignments] = useState([]);
  const [overdueAssignments, setOverdueAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  const className = user?.className || 'Y1A';

  useEffect(() => {
    const load = async () => {
      try {
        const [notes, recent, active, overdue] = await Promise.all([
          studentApi.getRecentNotes(className, 3),
          studentApi.getRecentAssignments(className, 5),
          studentApi.getActiveAssignments(className),
          studentApi.getOverdueAssignments(className),
        ]);
        setRecentNotes(notes || []);
        setRecentAssignments(recent || []);
        setActiveAssignments(active || []);
        setOverdueAssignments(overdue || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [className]);

  const handleAssignmentClick = (assignment) => {
    onSelectData('assignment', assignment);
    onNavigate('assignment');
  };

  const stats = [
    { label: 'Active Assignments', value: activeAssignments.length,  icon: <Clock size={20} color="#f97316" />,      bgColor: '#fff7ed' },
    { label: 'Overdue',            value: overdueAssignments.length, icon: <AlertCircle size={20} color="#ef4444" />, bgColor: '#fef2f2' },
    { label: 'Recent Notes',       value: recentNotes.length,        icon: <FileText size={20} color="#00234b" />,    bgColor: 'var(--secondary-color)' },
  ];

  if (loading) return (
    <div className="dashboard-overview">
      <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading dashboard...</div>
    </div>
  );

  return (
    <div className="dashboard-overview">
      <header className="overview-header">
        <h1>Student Dashboard</h1>
        <p>Welcome back, {user?.fullName || 'Student'}! Here's your academic overview.</p>
      </header>

      <div className="stats-container">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon-bg" style={{ backgroundColor: stat.bgColor }}>{stat.icon}</div>
            <div className="stat-text">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* My Class */}
      <section className="class-section card-box">
        <div className="section-header-row">
          <div>
            <h2>My Class — {className}</h2>
            <p className="subtitle">{user?.academicYear || ''}</p>
          </div>
          <button className="btn-outline" onClick={() => onNavigate('class')}>View Class</button>
        </div>
      </section>

      <div className="bottom-grid">
        {/* Upcoming Assignments */}
        <section className="assignments-section card-box">
          <div className="section-header-row">
            <h2>Upcoming Assignments</h2>
            <button className="btn-link" onClick={() => onNavigate('assignments')}>View all</button>
          </div>
          <div className="list-container">
            {recentAssignments.length === 0 ? (
              <p style={{ color: '#9ca3af', padding: '12px 0' }}>No upcoming assignments.</p>
            ) : recentAssignments.map(task => {
              const isOverdue = task.assignmentStatus === 'OVERDUE';
              return (
                <div key={task.id} className="list-item" onClick={() => handleAssignmentClick(task)}>
                  <div className="list-item-main">
                    <h4>{task.title}</h4>
                    <p>{task.courseName} <br /> Due: {new Date(task.deadline).toLocaleDateString()}</p>
                  </div>
                  <div className={`status-badge ${isOverdue ? 'red' : 'orange'}`}>
                    {isOverdue ? 'Overdue' : 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Notes */}
        <section className="notes-section card-box">
          <div className="section-header-row">
            <h2>Recent Notes</h2>
          </div>
          <div className="list-container">
            {recentNotes.length === 0 ? (
              <p style={{ color: '#9ca3af', padding: '12px 0' }}>No notes uploaded yet.</p>
            ) : recentNotes.map(note => (
              <div key={note.id} className="list-item note-list-item" onClick={() => { onSelectData('document', note); onNavigate('document'); }}>
                <FileText size={18} color="#00234b" className="note-icon" />
                <div className="list-item-main">
                  <h4>{note.title}</h4>
                  <p>{note.courseName} • {new Date(note.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="history-section card-box history-banner">
        <div className="history-text">
          <h2>Academic History</h2>
          <p>View your complete academic journey across all years</p>
        </div>
        <button className="btn-primary" onClick={() => onNavigate('history')}>View History</button>
      </section>
    </div>
  );
};

export default DashboardOverview;
