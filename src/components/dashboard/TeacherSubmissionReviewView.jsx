import React, { useState } from 'react';
import { Download, FileText, CheckCircle, ChevronLeft } from 'lucide-react';
import './TeacherSubmissionReviewView.css';

const TeacherSubmissionReviewView = ({ onNavigate, data }) => {
  const submission = data || {
    studentName: 'Alice Johnson',
    assignmentTitle: 'Calculus Problem Set 3',
    submittedAt: 'May 10, 2026 2:30 PM',
    status: 'submitted', // submitted, graded
    grade: null,
    feedback: '',
    file: 'alice_calc_hw.pdf',
    textSubmission: 'Here is my submission for the problem set. I had some trouble with question 4 but managed to solve it.'
  };

  const [grade, setGrade] = useState(submission.grade || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [isGraded, setIsGraded] = useState(submission.status === 'graded');

  const handleSaveGrade = (e) => {
    e.preventDefault();
    setIsGraded(true);
    alert('Grade and feedback saved successfully!');
    onNavigate('assignment-details');
  };

  return (
    <div className="submission-review-view">
      <header className="review-header">
        <button className="btn-back-text" onClick={() => onNavigate('assignment-details')}>
          <ChevronLeft size={18} /> Back to Submissions
        </button>
        <div className="header-title-row">
          <h1>{submission.studentName}'s Submission</h1>
          {isGraded ? (
            <span className="status-badge-small graded"><CheckCircle size={14} /> Graded</span>
          ) : (
            <span className="status-badge-small active">Needs Grading</span>
          )}
        </div>
        <p>{submission.assignmentTitle} • Submitted: {submission.submittedAt}</p>
      </header>

      <div className="review-grid">
        {/* Left Column: Submission Content */}
        <div className="submission-content card-box">
          <h2>Submission Details</h2>
          
          {submission.file && (
            <div className="attached-file-box">
              <div className="file-info">
                <FileText size={24} color="#1A264A" />
                <div>
                  <h4>{submission.file}</h4>
                  <p>PDF Document • 2.4 MB</p>
                </div>
              </div>
              <button className="btn-secondary">
                <Download size={18} /> Download
              </button>
            </div>
          )}

          {submission.textSubmission && (
            <div className="text-submission-box">
              <h3>Text Answer</h3>
              <div className="text-content">
                {submission.textSubmission}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Grading Panel */}
        <div className="grading-panel card-box">
          <h2>Evaluation</h2>
          
          <form onSubmit={handleSaveGrade}>
            <div className="form-group">
              <label>Score / Points</label>
              <div className="score-input-wrapper">
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. 95"
                  required
                />
                <span className="max-score">/ 100</span>
              </div>
            </div>

            <div className="form-group">
              <label>Feedback & Comments</label>
              <textarea 
                rows={6}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Great job on the derivatives section. However, review your limits..."
              ></textarea>
            </div>

            <button type="submit" className="btn-primary w-full">
              {isGraded ? 'Update Grade' : 'Save Grade'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherSubmissionReviewView;
