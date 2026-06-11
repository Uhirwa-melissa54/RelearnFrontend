import React, { useState, useEffect } from 'react';
import { Eye, Download, CheckCircle, Clock, ChevronLeft, AlertCircle, Users, FileText } from 'lucide-react';
import './TeacherAssignmentDetailsView.css';
import { teacherApi, downloadSubmissionFile } from '../../api';

const TeacherAssignmentDetailsView = ({ onNavigate, onSelectData, data }) => {
  const assignment = data || {};
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats]             = useState(null);
  const [studentsMap, setStudentsMap] = useState({});
  const [loading, setLoading]         = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (!assignment.id) { setLoading(false); return; }
    const load = async () => {
      try {
        const [subs, st] = await Promise.all([
          teacherApi.getSubmissionsForAssignment(assignment.id),
          teacherApi.getStudentCount(assignment.className).then(r => teacherApi.getAssignmentStats(assignment.id, r?.studentCount || 0)),
        ]);
        const classStudents = await teacherApi.getStudentsByClass(assignment.className);
        const map = {};
        (classStudents || []).forEach((s) => {
          map[s.id] = s;
        });
        setSubmissions(subs || []);
        setStats(st);
        setStudentsMap(map);
      } catch (err) {
        console.error('Failed to load submissions:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [assignment.id]);

  const handleGradeClick = (sub) => {
    const student = studentsMap[sub.studentId];
    onSelectData('submission', {
      ...sub,
      assignmentTitle:  assignment.title,
      assignmentClass:  assignment.className,
      assignmentCourse: assignment.courseName,
      studentName: student?.fullName,
      studentClass: student?.className,
    });
    onNavigate('review-submission');
  };

  const filtered = submissions.filter(s => {
    if (activeFilter === 'all')       return true;
    if (activeFilter === 'submitted') return s.status === 'PENDING' && !s.status?.includes('LATE');
    if (activeFilter === 'graded')    return s.status === 'GRADED';
    if (activeFilter === 'late')      return s.status === 'LATE';
    return true;
  });

  const totalSubmitted = submissions.length;
  const totalGraded    = submissions.filter(s => s.status === 'GRADED').length;
  const totalLate      = submissions.filter(s => s.status === 'LATE').length;
  const totalPending   = submissions.filter(s => s.status === 'PENDING').length;

  const getInitials   = (name) => (name || '?').split(' ').map(n => n[0]).join('');
  const getAvatarColor = (name) => {
    const colors = ['#1A264A', '#7c3aed', '#0891b2', '#059669', '#d97706'];
    return colors[(name || '').charCodeAt(0) % colors.length];
  };

  if (loading) return (
    <div className="assignment-details-view">
      <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading submissions...</div>
    </div>
  );

  return (
    <div className="assignment-details-view">
      <button className="btn-back-text" onClick={() => onNavigate('assignments')}>
        <ChevronLeft size={18} /> Back to Assignments
      </button>

      <header className="assignment-details-header">
        <div className="adh-top">
          <div>
            <h1>Assignment Submissions</h1>
            <p className="adh-subtitle">{assignment.title}</p>
          </div>
          <div className="adh-meta">
            <span className="adh-meta-item"><Users size={15} color="#6b7280" /> {assignment.className} · {assignment.courseName}</span>
            <span className="adh-meta-item"><Clock size={15} color="#6b7280" /> Due: {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : '—'}</span>
          </div>
        </div>
      </header>

      <div className="ad-stats-grid">
        {[
          { label: 'Total Submitted', value: totalSubmitted, color: '#16a34a' },
          { label: 'Graded',          value: totalGraded,    color: '#1A264A' },
          { label: 'Pending',         value: totalPending,   color: '#f97316' },
          { label: 'Late',            value: totalLate,      color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} className="ad-stat-card card-box">
            <span className="ad-stat-label">{s.label}</span>
            <span className="ad-stat-value" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      <section className="submissions-section card-box">
        <div className="submissions-section-header">
          <h2 className="section-title">Student Submissions</h2>
          <div className="filter-tabs">
            {[
              { key: 'all',       label: 'All' },
              { key: 'submitted', label: 'Pending' },
              { key: 'graded',    label: 'Graded' },
              { key: 'late',      label: 'Late' },
            ].map(tab => (
              <button key={tab.key}
                className={`filter-tab ${activeFilter === tab.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-submissions">
            <FileText size={36} color="#d1d5db" />
            <p>No submissions in this category.</p>
          </div>
        ) : (
          <div className="submissions-list">
            {filtered.map(sub => (
              <div key={sub.id} className="submission-list-item">
                <div className="sub-left">
                  <div className="student-avatar-small"
                    style={{ backgroundColor: getAvatarColor(studentsMap[sub.studentId]?.fullName || String(sub.studentId)), color: 'white' }}>
                    {(studentsMap[sub.studentId]?.fullName || `S${sub.studentId}`).charAt(0).toUpperCase()}
                  </div>
                  <div className="sub-info">
                    <h4>{studentsMap[sub.studentId]?.fullName || `Student #${sub.studentId}`}</h4>
                    <p>
                      {studentsMap[sub.studentId]?.className ? `${studentsMap[sub.studentId].className} · ` : ''}
                      Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : '—'}
                      {sub.status === 'LATE' && (
                        <span className="late-badge"><AlertCircle size={12} /> Late</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="sub-right">
                  <div className="sub-status-col">
                    {sub.status === 'GRADED' ? (
                      <><span className="grade-text">Grade: {sub.score}/{sub.maxScore}</span><CheckCircle size={16} color="#16a34a" /></>
                    ) : (
                      <span className="status-text">{sub.status}</span>
                    )}
                  </div>
                  <div className="sub-actions">
                    <button className="icon-btn" onClick={() => handleGradeClick(sub)} title="View Submission">
                      <Eye size={18} />
                    </button>
                    {sub.fileUrl && (
                      <button
                        type="button"
                        className="icon-btn"
                        title="Download"
                        onClick={() => downloadSubmissionFile(sub.fileUrl)}
                      >
                        <Download size={18} />
                      </button>
                    )}
                    <button className={sub.status === 'GRADED' ? 'btn-regrade' : 'btn-grade'}
                      onClick={() => handleGradeClick(sub)}>
                      {sub.status === 'GRADED' ? 'Regrade' : 'Grade'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeacherAssignmentDetailsView;
