import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';
import './TeacherUploadNotesView.css';

const TeacherUploadNotesView = ({ onNavigate, data }) => {
  const isEditMode = data && data.editMode;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Lecture Notes',
    class: 'Y1A',
    course: 'Mathematics',
    file: null
  });

  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (isEditMode && data.note) {
      setFormData({
        title: data.note.title || '',
        description: data.note.description || 'Brief description of the notes...',
        category: data.note.category || 'Lecture Notes',
        class: data.note.class || 'Y1A',
        course: data.note.course || 'Mathematics',
        file: { name: `${data.note.title}.pdf` } // Mock existing file
      });
    }
  }, [isEditMode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFormData(prev => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Notes ${isEditMode ? 'updated' : 'uploaded'} successfully!`);
    onNavigate('class'); // Usually navigate back to class view
  };

  return (
    <div className="upload-notes-view">
      <header className="upload-header">
        <h1>{isEditMode ? 'Edit Notes' : 'Upload Notes'}</h1>
        <p>{isEditMode ? 'Update existing study materials' : 'Share study materials with your class'}</p>
      </header>

      <div className="upload-form-card card-box">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Note Title</label>
            <input 
              type="text" 
              name="title"
              placeholder="e.g. Introduction to Calculus" 
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description"
              rows={4} 
              placeholder="Brief description of the notes..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Class</label>
              <select name="class" value={formData.class} onChange={handleChange} className="form-select">
                <option value="Y1A">Y1A</option>
                <option value="Y1B">Y1B</option>
                <option value="Y2A">Y2A</option>
              </select>
            </div>
            <div className="form-group half">
              <label>Course</label>
              <select name="course" value={formData.course} onChange={handleChange} className="form-select">
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="form-select">
              <option value="Lecture Notes">Lecture Notes</option>
              <option value="Study Guide">Study Guide</option>
              <option value="Practice Problems">Practice Problems</option>
              <option value="Past Papers">Past Papers</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Files</label>
            <div 
              className={`upload-dropzone ${isDragOver ? 'drag-over' : ''} ${formData.file ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                id="file-upload" 
                className="file-input-hidden" 
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="dropzone-content">
                {formData.file ? (
                  <div className="file-selected">
                    <CheckCircle size={32} color="#16a34a" />
                    <span>{formData.file.name}</span>
                    <small>Click to replace file</small>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={32} color="#6b7280" />
                    <strong>Click to upload or drag and drop</strong>
                    <span>PDF, DOC, DOCX, PPT, PPTX (Max 25MB)</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => onNavigate('class')}>Cancel</button>
            <button type="submit" className="btn-submit">
              {isEditMode ? 'Save Changes' : 'Upload Notes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherUploadNotesView;
