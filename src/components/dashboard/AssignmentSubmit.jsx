import React from 'react';
import { UploadCloud, Send } from 'lucide-react';
import './AssignmentSubmit.css';

const AssignmentSubmit = ({ data, onNavigate }) => {
  // If no data provided, use default
  const assignment = data || { title: 'Calculus Problem Set 3', due: 'May 15, 2026', course: 'Mathematics' };

  return (
    <div className="assignment-submit">
      <header className="assignment-header">
        <h1>{assignment.title}</h1>
        <p>{assignment.course} • Due {assignment.due} • 100 points</p>
      </header>

      <div className="instructions-card card-box">
        <h3>Assignment Instructions</h3>
        <p>{assignment.description || 'Complete all problems from Chapter 3. Show all work and explain your reasoning for each solution. Submit as a single PDF file.'}</p>
      </div>

      {assignment.readOnly ? (
        <div className="submit-card card-box read-only-notice">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444' }}>
            <h3>Read Only Access</h3>
          </div>
          <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
            You are viewing this assignment in read-only mode because it belongs to a past academic year or a different class. Submission features are disabled.
          </p>
          <div className="submit-actions" style={{ marginTop: '24px' }}>
            <button className="btn-cancel" onClick={() => onNavigate('overview')}>Go Back</button>
            <button className="btn-submit" onClick={() => alert('Downloading assignment files...')}>
              Download Assignment Files
            </button>
          </div>
        </div>
      ) : (
        <div className="submit-card card-box">
          <h3>Your Submission</h3>
          
          <div className="submission-tabs">
          <button className="tab-btn active">File Upload</button>
          <button className="tab-btn">Text Submission</button>
        </div>

        <div className="upload-dropzone">
          <UploadCloud size={40} color="#6b7280" />
          <p><strong>Click to upload or drag and drop</strong></p>
          <span className="upload-hint">Allowed: PDF, DOC, DOCX (Max 25MB)</span>
        </div>

        <div className="comments-section">
          <h3>Additional Comments (Optional)</h3>
          <textarea 
            placeholder="Any additional notes for your teacher..."
            rows={4}
          ></textarea>
        </div>

        <div className="submit-actions">
          <button className="btn-cancel" onClick={() => onNavigate('overview')}>Cancel</button>
          <button className="btn-submit">
            <Send size={18} />
            Submit Assignment
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default AssignmentSubmit;
