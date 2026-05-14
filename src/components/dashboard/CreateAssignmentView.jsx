import React, { useState } from 'react';
import { Calendar, Clock, Hash } from 'lucide-react';
import './CreateAssignmentView.css';

const CreateAssignmentView = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    points: 100,
    submissionType: 'both',
    allowLate: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Assignment created successfully!');
    onNavigate('overview');
  };

  return (
    <div className="create-assignment-view">
      <header className="create-header">
        <h1>Create Assignment</h1>
        <p>Add a new assignment for your class</p>
      </header>

      <div className="create-form-card card-box">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Assignment Title</label>
            <input 
              type="text" 
              name="title"
              placeholder="e.g. Calculus Problem Set 4" 
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Description & Instructions</label>
            <textarea 
              name="description"
              rows={5} 
              placeholder="Provide detailed instructions for the assignment..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Due Date</label>
              <div className="input-with-icon">
                <Calendar size={18} color="#9ca3af" />
                <input 
                  type="date" 
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="form-group half">
              <label>Due Time</label>
              <div className="input-with-icon">
                <Clock size={18} color="#9ca3af" />
                <input 
                  type="time" 
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-group half">
            <label>Total Points</label>
            <div className="input-with-icon">
              <Hash size={18} color="#9ca3af" />
              <input 
                type="number" 
                name="points"
                min="0"
                value={formData.points}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* New Fields as Requested */}
          <div className="form-group">
            <label>Submission Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="submissionType" 
                  value="file" 
                  checked={formData.submissionType === 'file'}
                  onChange={handleChange}
                />
                File Upload
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="submissionType" 
                  value="text" 
                  checked={formData.submissionType === 'text'}
                  onChange={handleChange}
                />
                Text Submission
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="submissionType" 
                  value="both" 
                  checked={formData.submissionType === 'both'}
                  onChange={handleChange}
                />
                Both
              </label>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="allowLate"
                checked={formData.allowLate}
                onChange={handleChange}
              />
              Allow late submissions
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => onNavigate('overview')}>Cancel</button>
            <button type="submit" className="btn-submit">Create Assignment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignmentView;
