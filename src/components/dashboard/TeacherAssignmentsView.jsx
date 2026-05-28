import React, { useState, useEffect, useMemo } from 'react';
import { Search, Eye, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './AssignmentsView.css';
import './TeacherAssignmentsView.css';
import { teacherApi, getUser } from '../../api';

const STATUS_ORDER = { ACTIVE: 0, OVERDUE: 1, COMPLETED: 2 };

const TeacherAssignmentsView = ({ onNavigate, onSelectData }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterClass, setFilterClass]   = useState('ALL');
  const [filterCourse, setFilterCourse] = useState('ALL');
  const user = getUser();

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await teacherApi.getProfile();
        const teacherId = profile?.id || user?.id;
        if (!teacherId) {
          setAssignments([]);
          return;
        }
        const data = await teacherApi.getAssignments(teacherId);
        setAssignments(data || []);
      } catch (err) {
        console.error('Failed to load assignments:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const classes = [...new Set(assignments.map(a => a.className).filter(Boolean))];
  const courses = [...new Set(assignments.map(a => a.courseName).filter(Boolean))];

  const filtered = useMemo(() =>
    assignments
      .filter(a => {
        const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || a.assignmentStatus === filterStatus;
        const matchClass  = filterClass  === 'ALL' || a.className  === filterClass;
        const matchCourse = filterCourse === 'ALL' || a.courseName === filterCourse;
        return matchSearch && matchStatus && matchClass && matchCourse;
      })
      .sort((a, b) => (STATUS_ORDER[a.assignmentStatus] ?? 99) - (STATUS_ORDER[b.assignmentStatus] ?? 99)),
    [assignments, searchTerm, filterStatus, filterClass, filterCourse]
  );

  const handleViewSubmissions = (a) => { onSelectData('assignment', a); onNavigate('assignment-details'); };

  const getStatusIcon = (s) => {
    if (s === 'ACTIVE')   return <Clock size={13} />;
    if (s === 'OVERDUE')  return <AlertCircle size={13} />;
    if (s === 'COMPLETED') return <CheckCircle size={13} />;
  };

  const getStatusClass = (s) => {
    if (s === 'ACTIVE')   return 'status-active';
    if (s === 'OVERDUE')  return 'status-overdue';
    if (s === 'COMPLETED') return 'status-completed';
    return '';
  };

  if (loading) return (
    <div className="assignments-view teacher-assignments-view">
      <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading assignments...</div>
    </div>
  );

  return (
    <div className="assignments-view teacher-assignments-view">
      <header className="assignments-header">
        <div className="header-title-group">
          <h1>All Assignments</h1>
          <p>{filtered.length} assignment{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn-primary-action" onClick={() => onNavigate('create-assignment')}>
          <Plus size={16} /> Create Assignment
        </button>
      </header>

      <div className="filters-bar card-box">
        <div className="search-wrapper">
          <Search size={18} color="#9ca3af" />
          <input type="text" placeholder="Search by title..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="OVERDUE">Overdue</option>
        </select>
        <select className="filter-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="ALL">All Classes</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
          <option value="ALL">All Courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-assignments card-box">
          <Search size={40} color="#d1d5db" />
          <p>No assignments match your filters.</p>
        </div>
      ) : (
        <div className="assignments-list">
          {filtered.map(a => {
            const pct = a.totalSubmitted
              ? Math.round((a.totalSubmitted / (a.totalSubmitted + (a.totalPendingReview || 0) + (a.totalGraded || 0))) * 100)
              : 0;
            return (
              <div key={a.id} className="assignment-list-card card-box ta-card">
                <div className="card-top-row">
                  <div className="card-title"><h3>{a.title}</h3></div>
                  <span className={`ta-status-badge ${getStatusClass(a.assignmentStatus)}`}>
                    {getStatusIcon(a.assignmentStatus)} {a.assignmentStatus}
                  </span>
                </div>
                <div className="card-meta-row" style={{ marginTop: '10px' }}>
                  <span className="course-badge">{a.className} · {a.courseName}</span>
                  {a.totalPendingReview > 0 && (
                    <span className="pending-review-badge">{a.totalPendingReview} pending review</span>
                  )}
                </div>
                <div className="ta-progress-wrap">
                  <div className="ta-progress-bar">
                    <div className="ta-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="ta-progress-text">{a.totalSubmitted || 0} submitted</span>
                </div>
                <div className="card-bottom-row">
                  <span className="deadline-text">DUE: {new Date(a.deadline).toLocaleDateString()}</span>
                  <button className="btn-action" onClick={() => handleViewSubmissions(a)}>
                    <Eye size={16} /> View Submissions
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherAssignmentsView;
