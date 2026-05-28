import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Users, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import './TeacherOverview.css';
import { teacherApi, getUser } from '../../api';

const TeacherOverview = ({ onNavigate, onSelectData }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [teacherProfile, setTeacherProfile] = useState(null);
  const user = getUser();

  useEffect(() => {
    const load = async () => {
      try {
        // Resolve teacher identity from backend first to avoid stale localStorage IDs.
        const profile = await teacherApi.getProfile();
        setTeacherProfile(profile);
        const teacherId = profile?.id || user?.id;
        if (!teacherId) {
          throw new Error('Teacher profile is missing ID');
        }

        const data = await teacherApi.getDashboard(teacherId);
        setDashboard(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const handleClassClick = (cls) => { onSelectData('class', cls); onNavigate('class'); };
  const handleAssignmentClick = (a) => { onSelectData('assignment', a); onNavigate('assignment-details'); };

  const getProgressPercent = (submitted, total) =>
    total ? Math.round((submitted / total) * 100) : 0;

  if (loading) return (
    <div className="teacher-overview">
      <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading dashboard...</div>
    </div>
  );

  if (error) return (
    <div className="teacher-overview">
      <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626', backgroundColor: '#fef2f2', borderRadius: '12px', margin: '20px' }}>{error}</div>
    </div>
  );

  const stats = [
    { label: 'Classes Assigned',  value: dashboard?.totalClassAssignments ?? 0, icon: <BookOpen size={24} color="#1A264A" />, bgColor: '#f3f4f6' },
    { label: 'Total Assignments', value: dashboard?.totalAssignmentsGiven  ?? 0, icon: <FileText size={24} color="#22c55e" />, bgColor: '#f0fdf4' },
    { label: 'Pending Reviews',   value: dashboard?.totalPendingReviews    ?? 0, icon: <Clock size={24} color="#f97316" />,   bgColor: '#fff7ed' },
  ];

  const classCards       = dashboard?.classCards       || [];
  const recentAssignments = dashboard?.recentAssignments || [];
  const fallbackClassCards =
    classCards.length === 0 && teacherProfile?.className
      ? [{
          className: teacherProfile.className,
          courseName: teacherProfile.academicYear || 'Assigned Class',
          totalAssignments: 0,
          totalPendingReviews: 0,
          activeAssignments: 0,
        }]
      : classCards;

  return (
    <div className="teacher-overview">
      <header className="overview-header">
        <h1>Teacher Dashboard</h1>
        <p>Manage your classes and assignments</p>
      </header>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card card-box">
            <div className="stat-icon-bg" style={{ backgroundColor: stat.bgColor }}>{stat.icon}</div>
            <div className="stat-text">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Class Overview */}
      <section className="classes-section card-box">
        <div className="section-header-row">
          <h2 className="section-title">Class Overview</h2>
          <button className="btn-view-all" onClick={() => onNavigate('all-classes')}>
            View All <ChevronRight size={16} />
          </button>
        </div>
        {fallbackClassCards.length === 0 ? (
          <p style={{ color: '#9ca3af', padding: '16px 0' }}>No classes assigned yet.</p>
        ) : (
          <div className="classes-grid">
            {fallbackClassCards.map((cls, i) => (
              <div key={i} className="teacher-class-card" onClick={() => handleClassClick(cls)}>
                <div className="class-card-header">
                  <div>
                    <h3>{cls.className}</h3>
                    <p>{cls.courseName}</p>
                  </div>
                  <BookOpen size={20} color="#1A264A" />
                </div>
                <div className="class-card-stats">
                  <div className="class-stat-row"><span>Assignments</span><strong>{cls.totalAssignments}</strong></div>
                  <div className="class-stat-row"><span>Pending Reviews</span><strong>{cls.totalPendingReviews}</strong></div>
                  <div className="class-stat-row"><span>Active</span><strong>{cls.activeAssignments}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Assignments */}
      <section className="recent-assignments-section card-box">
        <div className="section-header-row">
          <h2 className="section-title">Recent Assignments</h2>
          <button className="btn-view-all" onClick={() => onNavigate('assignments')}>
            View All <ChevronRight size={16} />
          </button>
        </div>
        {recentAssignments.length === 0 ? (
          <p style={{ color: '#9ca3af', padding: '16px 0' }}>No assignments yet.</p>
        ) : (
          <div className="recent-assignments-list">
            {recentAssignments.map(a => {
              const pct = getProgressPercent(a.totalSubmitted, a.totalSubmitted + (a.totalPendingReview || 0));
              const isOverdue = a.assignmentStatus === 'OVERDUE';
              return (
                <div key={a.id} className="recent-assignment-card" onClick={() => handleAssignmentClick(a)}>
                  <div className="ra-left">
                    <div className="ra-title-row">
                      <h4>{a.title}</h4>
                      {isOverdue && <span className="overdue-chip"><AlertCircle size={12} /> Overdue</span>}
                    </div>
                    <p className="ra-meta">{a.className} · {a.courseName} · Due {new Date(a.deadline).toLocaleDateString()}</p>
                    <div className="ra-progress-bar-wrap">
                      <div className="ra-progress-bar">
                        <div className="ra-progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="ra-progress-label">{pct}%</span>
                    </div>
                  </div>
                  <div className="ra-right">
                    <div className="ra-submission-count">
                      <strong>{a.totalSubmitted}</strong>
                      <span>Submitted</span>
                    </div>
                    {a.totalPendingReview > 0 && (
                      <span className="pending-chip">{a.totalPendingReview} pending</span>
                    )}
                    <ChevronRight size={18} color="#9ca3af" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeacherOverview;
