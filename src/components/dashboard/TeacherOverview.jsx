import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import './TeacherOverview.css';
import { teacherApi } from '../../api';

const TeacherOverview = ({ onNavigate, onSelectData }) => {
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Get the authenticated teacher's profile (authoritative ID from backend)
        const profile = await teacherApi.getProfile();
        if (!profile?.id) throw new Error('Teacher profile is missing ID');

        const teacherId = profile.id;

        // 2. Fetch assigned classes from AcademicClass table — this is the source of truth.
        //    Admin assigns classes here; teacher sees them immediately.
        const classes = await teacherApi.getAssignedClasses();
        setAssignedClasses(classes || []);

        // 3. Fetch assignment-based dashboard data (recent assignments, counts).
        //    This may return empty for a brand-new teacher — that's fine.
        try {
          const dashboard = await teacherApi.getDashboard(teacherId);
          setRecentAssignments(dashboard?.recentAssignments || []);
          setTotalAssignments(dashboard?.totalAssignmentsGiven || 0);
          setPendingReviews(dashboard?.totalPendingReviews || 0);
        } catch {
          // Dashboard call is non-critical — teacher can still see assigned classes
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleClassClick = (cls) => {
    onSelectData('class', {
      id:        cls.className,
      className: cls.className,
      subject:   cls.courseName || '',
      courseName: cls.courseName || '',
      students:  cls.totalStudents || 0,
    });
    onNavigate('class');
  };

  const handleAssignmentClick = (a) => {
    onSelectData('assignment', a);
    onNavigate('assignment-details');
  };

  const getProgressPercent = (submitted, pending) =>
    (submitted + pending) > 0 ? Math.round((submitted / (submitted + pending)) * 100) : 0;

  if (loading) return (
    <div className="teacher-overview">
      <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
        Loading dashboard...
      </div>
    </div>
  );

  if (error) return (
    <div className="teacher-overview">
      <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626',
        backgroundColor: '#fef2f2', borderRadius: '12px', margin: '20px' }}>
        {error}
      </div>
    </div>
  );

  const stats = [
    { label: 'Classes Assigned',  value: assignedClasses.length, icon: <BookOpen size={24} color="#1A264A" />, bgColor: '#f3f4f6' },
    { label: 'Total Assignments', value: totalAssignments,        icon: <FileText size={24} color="#22c55e" />, bgColor: '#f0fdf4' },
    { label: 'Pending Reviews',   value: pendingReviews,          icon: <Clock    size={24} color="#f97316" />, bgColor: '#fff7ed' },
  ];

  return (
    <div className="teacher-overview">
      <header className="overview-header">
        <h1>Teacher Dashboard</h1>
        <p>Manage your classes and assignments</p>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card card-box">
            <div className="stat-icon-bg" style={{ backgroundColor: stat.bgColor }}>
              {stat.icon}
            </div>
            <div className="stat-text">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Class Overview — from AcademicClass table */}
      <section className="classes-section card-box">
        <div className="section-header-row">
          <h2 className="section-title">My Assigned Classes</h2>
          <button className="btn-view-all" onClick={() => onNavigate('all-classes')}>
            View All <ChevronRight size={16} />
          </button>
        </div>

        {assignedClasses.length === 0 ? (
          <div style={{ padding: '24px 0', color: '#9ca3af', textAlign: 'center' }}>
            <BookOpen size={32} color="#d1d5db" style={{ marginBottom: '8px' }} />
            <p>No classes assigned yet.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              Ask your admin to assign classes to your account.
            </p>
          </div>
        ) : (
          <div className="classes-grid">
            {assignedClasses.map((cls, i) => (
              <div key={i} className="teacher-class-card" onClick={() => handleClassClick(cls)}>
                <div className="class-card-header">
                  <div>
                    <h3>{cls.className}</h3>
                    <p>{cls.academicYear || ''}</p>
                  </div>
                  <BookOpen size={20} color="#1A264A" />
                </div>
                <div className="class-card-stats">
                  <div className="class-stat-row">
                    <span>Students</span>
                    <strong>{cls.totalStudents ?? 0}</strong>
                  </div>
                  <div className="class-stat-row">
                    <span>Capacity</span>
                    <strong>{cls.capacity ?? '—'}</strong>
                  </div>
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
          <p style={{ color: '#9ca3af', padding: '16px 0' }}>No assignments created yet.</p>
        ) : (
          <div className="recent-assignments-list">
            {recentAssignments.map(a => {
              const pct = getProgressPercent(a.totalSubmitted || 0, a.totalPendingReview || 0);
              const isOverdue = a.assignmentStatus === 'OVERDUE';
              return (
                <div key={a.id} className="recent-assignment-card"
                  onClick={() => handleAssignmentClick(a)}>
                  <div className="ra-left">
                    <div className="ra-title-row">
                      <h4>{a.title}</h4>
                      {isOverdue && (
                        <span className="overdue-chip">
                          <AlertCircle size={12} /> Overdue
                        </span>
                      )}
                    </div>
                    <p className="ra-meta">
                      {a.className} · {a.courseName} · Due {new Date(a.deadline).toLocaleDateString()}
                    </p>
                    <div className="ra-progress-bar-wrap">
                      <div className="ra-progress-bar">
                        <div className="ra-progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="ra-progress-label">{pct}%</span>
                    </div>
                  </div>
                  <div className="ra-right">
                    <div className="ra-submission-count">
                      <strong>{a.totalSubmitted || 0}</strong>
                      <span>Submitted</span>
                    </div>
                    {(a.totalPendingReview || 0) > 0 && (
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
