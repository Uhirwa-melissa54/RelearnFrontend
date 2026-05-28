import React, { useState } from 'react';
import { Download, FileText, CheckCircle, ChevronLeft, User, Calendar, AlertCircle } from 'lucide-react';
import './TeacherSubmissionReviewView.css';
import { teacherApi, studentApi, getUser } from '../../api';

const TeacherSubmissionReviewView = ({ onNavigate, data }) => {
  const submission = data || {};
  const user = getUser();

  const [grade, setGrade]           = useState(submission.score !== null && submission.score !== undefined ? String(submission.score) : '');
  const [maxScore, setMaxScore]     = useState(submission.maxScore ? String(submission.maxScore) : '100');
  const [feedback, setFeedback]     = useState(submission.feedback || '');
  const [saving, setSaving]         = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors]         = useState({});

  const validate = () => {
    const errs = {};
    if (grade === '') errs.grade = 'Score is required.';
    else if (Number(grade) < 0 || Number(grade) > Number(maxScore)) errs.grade = `Score must be between 0 and ${maxScore}.`;
    return errs;
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      await teacherApi.gradeSubmission(submission.id, user.id, {
        score:    Number(grade),
        maxScore: Number(maxScore),
        feedback,
        gradedBy: user.id,
      });
      setSaveSuccess(true);
      setTimeout(() => { setSaveSuccess(false); onNavigate('assignment-details'); }, 1200);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save grade.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="submission-review-view">
      <button className="btn-back-text" onClick={() => onNavigate('assignment-details')}>
        <ChevronLeft size={18} /> Back to Submissions
      </button>

      <header className="review-header">
        <div className="header-title-row">
          <h1>Student #{submission.studentId} Submission</h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {submission.status === 'LATE' && (
              <span className="status-badge-small late"><AlertCircle size={13} /> Late</span>
            )}
            {submission.status === 'GRADED' ? (
              <span className="status-badge-small graded"><CheckCircle size={13} /> Graded</span>
            ) : (
              <span className="status-badge-small pending">Needs Grading</span>
            )}
          </div>
        </div>
        <div className="review-meta-row">
          <span className="review-meta-item"><FileText size={14} color="#6b7280" /> {submission.assignmentTitle}</span>
          {submission.assignmentClass && (
            <span className="review-meta-item"><User size={14} color="#6b7280" /> {submission.assignmentClass} · {submission.assignmentCourse}</span>
          )}
          {submission.submittedAt && (
            <span className="review-meta-item"><Calendar size={14} color="#6b7280" /> Submitted: {new Date(submission.submittedAt).toLocaleString()}</span>
          )}
        </div>
      </header>

      {saveSuccess && (
        <div className="success-banner">
          <CheckCircle size={18} color="#16a34a" /> Grade saved! Redirecting...
        </div>
      )}

      {errors.submit && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fca5a5' }}>
          {errors.submit}
        </div>
      )}

      <div className="review-grid">
        {/* Left: Submission Content */}
        <div className="submission-content card-box">
          <h2>Submission Details</h2>

          {!submission.fileUrl && !submission.submissionText && (
            <div className="no-submission-msg">
              <FileText size={36} color="#d1d5db" />
              <p>No submission content available.</p>
            </div>
          )}

          {submission.fileUrl && (
            <div className="attached-file-box">
              <div className="file-info">
                <div className="file-icon-wrap"><FileText size={22} color="#1A264A" /></div>
                <div>
                  <h4>{submission.fileUrl}</h4>
                  <p>Click to download</p>
                </div>
              </div>
              <a href={studentApi.downloadSubmission(submission.fileUrl)} download className="btn-download">
                <Download size={16} /> Download
              </a>
            </div>
          )}

          {submission.submissionText && (
            <div className="text-submission-box">
              <h3>Text Answer</h3>
              <div className="text-content">{submission.submissionText}</div>
            </div>
          )}
        </div>

        {/* Right: Grading Panel */}
        <div className="grading-panel card-box">
          <h2>Evaluation</h2>
          <div className="student-info-row">
            <div className="student-avatar-review" style={{ backgroundColor: '#1A264A', color: 'white', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {submission.studentId}
            </div>
            <div>
              <strong>Student #{submission.studentId}</strong>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Student</p>
            </div>
          </div>

          <form onSubmit={handleSaveGrade} className="grading-form">
            <div className="form-group">
              <label>Score / Points</label>
              <div className="score-input-wrapper">
                <input type="number" min="0" max={maxScore}
                  value={grade} onChange={(e) => { setGrade(e.target.value); setErrors({}); }}
                  placeholder="e.g. 85" />
                <span className="max-score">
                  / <input type="number" min="1" value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    style={{ width: '60px', border: 'none', background: 'transparent', fontWeight: 600 }} />
                </span>
              </div>
              {errors.grade && <span className="field-error">{errors.grade}</span>}
            </div>

            <div className="form-group">
              <label>Feedback & Comments</label>
              <textarea rows={6} value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Great job on the derivatives section..." />
            </div>

            <button type="submit" className="btn-save-grade" disabled={saving}>
              {saving ? 'Saving...' : submission.status === 'GRADED' ? 'Update Grade' : 'Save Grade'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherSubmissionReviewView;
