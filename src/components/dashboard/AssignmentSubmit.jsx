import React, { useState } from 'react';
import { UploadCloud, Send } from 'lucide-react';
import './AssignmentSubmit.css';
import { studentApi, getUser } from '../../api';

const AssignmentSubmit = ({ data, onNavigate }) => {
  const assignment = data || { title: 'Assignment', deadline: null, courseName: '' };
  const user = getUser();

  const getAssignmentFileLink = () => {
    if (!assignment?.fileUrl) return null;
    if (/^https?:\/\//i.test(assignment.fileUrl)) return assignment.fileUrl;
    return studentApi.downloadSubmission(assignment.fileUrl);
  };

  const [submissionText, setSubmissionText] = useState('');
  const [file, setFile]                     = useState(null);
  const [activeTab, setActiveTab]           = useState('file');
  const [submitting, setSubmitting]         = useState(false);
  const [success, setSuccess]               = useState(false);
  const [error, setError]                   = useState('');

  const handleSubmit = async () => {
    if (!submissionText.trim() && !file) {
      setError('Please provide a text answer or upload a file.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('assignmentId', assignment.id);
      fd.append('studentId',    user.id);
      if (submissionText.trim()) fd.append('submissionText', submissionText);
      if (file)                  fd.append('file', file);

      await studentApi.submitAssignment(fd);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onNavigate('assignments'); }, 1500);
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (assignment.readOnly) {
    return (
      <div className="assignment-submit">
        <header className="assignment-header">
          <h1>{assignment.title}</h1>
          <p>{assignment.courseName} • Due {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : '—'}</p>
        </header>
        <div className="submit-card card-box read-only-notice">
          <h3>Read Only Access</h3>
          <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
            You are viewing this assignment in read-only mode. Submission is disabled.
          </p>
          {assignment.fileUrl && (
            <a href={getAssignmentFileLink()} download
              className="btn-submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', textDecoration: 'none' }}>
              Download Assignment File
            </a>
          )}
          <div className="submit-actions" style={{ marginTop: '16px' }}>
            <button className="btn-cancel" onClick={() => onNavigate('assignments')}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-submit">
      <header className="assignment-header">
        <h1>{assignment.title}</h1>
        <p>{assignment.courseName} • Due {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : '—'}</p>
      </header>

      <div className="instructions-card card-box">
        <h3>Assignment Instructions</h3>
        <p>{assignment.description || 'Complete the assignment as instructed. Submit your work before the deadline.'}</p>
        {assignment.fileUrl && (
          <a href={getAssignmentFileLink()} download
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: '#1A264A', fontWeight: 600, textDecoration: 'none' }}>
            📎 Download Assignment File
          </a>
        )}
      </div>

      {success && (
        <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #86efac', fontWeight: 600 }}>
          ✓ Assignment submitted successfully!
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      <div className="submit-card card-box">
        <h3>Your Submission</h3>

        <div className="submission-tabs">
          <button className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`}
            onClick={() => setActiveTab('file')}>File Upload</button>
          <button className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => setActiveTab('text')}>Text Submission</button>
        </div>

        {activeTab === 'file' && (
          <div className="upload-dropzone">
            <input type="file" id="sub-file" style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <label htmlFor="sub-file" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              {file ? (
                <>
                  <UploadCloud size={40} color="#16a34a" />
                  <p><strong>{file.name}</strong></p>
                  <span className="upload-hint">Click to replace</span>
                </>
              ) : (
                <>
                  <UploadCloud size={40} color="#6b7280" />
                  <p><strong>Click to upload or drag and drop</strong></p>
                  <span className="upload-hint">Allowed: PDF, DOC, DOCX (Max 50MB)</span>
                </>
              )}
            </label>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="comments-section">
            <textarea
              placeholder="Write your answer here..."
              rows={8}
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
            />
          </div>
        )}

        <div className="comments-section">
          <h3>Additional Comments <span style={{ fontWeight: 400, color: '#9ca3af' }}>(Optional)</span></h3>
          <textarea placeholder="Any additional notes for your teacher..." rows={3} />
        </div>

        <div className="submit-actions">
          <button className="btn-cancel" onClick={() => onNavigate('assignments')}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
            <Send size={18} />
            {submitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmit;
