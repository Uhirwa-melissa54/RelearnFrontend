import React from 'react';
import { Eye, Download, CheckCircle, Clock } from 'lucide-react';
import './TeacherAssignmentDetailsView.css';

const TeacherAssignmentDetailsView = ({ onNavigate, onSelectData, data }) => {
  const assignment = data || { title: 'Calculus Problem Set 3', due: 'May 15, 2026' };

  const submissions = [
    {
      id: 1,
      studentName: 'Alice Johnson',
      submittedAt: 'May 10, 2026 2:30 PM',
      status: 'submitted',
      grade: null,
      isLate: false,
      file: 'alice_calc_hw.pdf'
    },
    {
      id: 2,
      studentName: 'Bob Smith',
      submittedAt: 'May 10, 2026 3:45 PM',
      status: 'graded',
      grade: 95,
      isLate: false,
      file: 'bob_calc_ps3.pdf'
    },
    {
      id: 3,
      studentName: 'Charlie Davis',
      submittedAt: 'May 11, 2026 9:15 AM',
      status: 'submitted',
      grade: null,
      isLate: true,
      file: 'charlie_math.docx'
    },
    {
      id: 4,
      studentName: 'Diana Prince',
      submittedAt: null,
      status: 'missing',
      grade: null,
      isLate: false,
      file: null
    }
  ];

  const handleGradeClick = (submission) => {
    onSelectData('submission', { ...submission, assignmentTitle: assignment.title });
    onNavigate('review-submission');
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="assignment-details-view">
      <header className="assignment-details-header">
        <h1>Assignment Submissions</h1>
        <p>{assignment.title}</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card-slim card-box">
          <div className="slim-stat-header">
            <span>Total Students</span>
          </div>
          <span className="slim-stat-value">4</span>
        </div>
        <div className="stat-card-slim card-box">
          <div className="slim-stat-header">
            <span>Submitted</span>
          </div>
          <span className="slim-stat-value" style={{ color: '#16a34a' }}>3</span>
        </div>
        <div className="stat-card-slim card-box">
          <div className="slim-stat-header">
            <span>Graded</span>
          </div>
          <span className="slim-stat-value" style={{ color: '#3b82f6' }}>1</span>
        </div>
        <div className="stat-card-slim card-box">
          <div className="slim-stat-header">
            <span>Missing</span>
          </div>
          <span className="slim-stat-value" style={{ color: '#ef4444' }}>1</span>
        </div>
      </div>

      <section className="submissions-section card-box">
        <h2 className="section-title">Student Submissions</h2>
        <div className="submissions-list">
          {submissions.map(sub => (
            <div key={sub.id} className="submission-list-item">
              <div className="sub-left">
                <div className="student-avatar-small">
                  {getInitials(sub.studentName)}
                </div>
                <div className="sub-info">
                  <h4>{sub.studentName}</h4>
                  {sub.status === 'missing' ? (
                    <p className="missing-text">No submission</p>
                  ) : (
                    <p>
                      Submitted: {sub.submittedAt} 
                      {sub.isLate && <span className="late-badge"><Clock size={12} /> Late</span>}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="sub-right">
                <div className="sub-status-col">
                  {sub.status === 'graded' ? (
                    <>
                      <span className="grade-text">Grade: {sub.grade}/100</span>
                      <CheckCircle size={16} color="#16a34a" />
                    </>
                  ) : sub.status === 'missing' ? (
                    <span className="status-text missing">Missing</span>
                  ) : (
                    <span className="status-text">Not graded</span>
                  )}
                </div>

                {sub.status !== 'missing' && (
                  <div className="sub-actions">
                    <button className="icon-btn" onClick={() => handleGradeClick(sub)} title="View Submission">
                      <Eye size={18} />
                    </button>
                    <button className="icon-btn" title="Download File">
                      <Download size={18} />
                    </button>
                    <button 
                      className={sub.status === 'graded' ? 'btn-secondary' : 'btn-primary'}
                      onClick={() => handleGradeClick(sub)}
                    >
                      {sub.status === 'graded' ? 'Regrade' : 'Grade'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeacherAssignmentDetailsView;
