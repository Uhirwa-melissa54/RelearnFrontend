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
        <p>{assignment.course} • Due: {assignment.due}</p>
      </header>

      <div className="submit-card card-box">
        <div className="upload-section">
          <h3>Upload Files</h3>
          <div className="upload-dropzone">
            <UploadCloud size={32} color="#9ca3af" />
            <p>Drag and drop files here, or click to browse</p>
            <span className="upload-hint">Supported formats: PDF, DOCX, JPG (Max 10MB)</span>
          </div>
        </div>

        <div className="comments-section">
          <h3>Additional Comments (Optional)</h3>
          <textarea 
            placeholder="Any additional notes for your teacher..."
            rows={5}
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
    </div>
  );
};

export default AssignmentSubmit;
