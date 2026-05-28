import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle, ChevronLeft, X } from 'lucide-react';
import './TeacherUploadNotesView.css';
import { teacherApi, getUser } from '../../api';

const TeacherUploadNotesView = ({ onNavigate, data }) => {
  const isEditMode = data?.editMode === true;
  const user = getUser();

  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Lecture Notes',
    class: 'Y1A', course: 'Mathematics', academicYear: '2024-2025',
    file: null,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors]         = useState({});
  const [saving, setSaving]         = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode && data?.note) {
      setFormData({
        title:       data.note.title       || '',
        description: data.note.description || '',
        category:    data.note.category    || 'Lecture Notes',
        class:       data.note.className   || data.class || 'Y1A',
        course:      data.note.courseName  || data.course || 'Mathematics',
        academicYear: data.note.academicYear || '2024-2025',
        file: data.note.fileUrl ? { name: data.note.fileUrl, existing: true } : null,
      });
    } else if (data && !data.editMode) {
      setFormData(prev => ({
        ...prev,
        class:  data.class  || 'Y1A',
        course: data.course || 'Mathematics',
      }));
    }
  }, [isEditMode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) setFormData(prev => ({ ...prev, file: e.dataTransfer.files[0] }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Note title is required.';
    if (!isEditMode && !formData.file) errs.file = 'Please upload a file.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title',       formData.title);
      fd.append('description', formData.description || '');
      fd.append('className',   formData.class);
      fd.append('courseName',  formData.course);
      fd.append('academicYear', formData.academicYear);
      fd.append('teacherId',   user.id);
      if (formData.file && !formData.file.existing) {
        fd.append('file', formData.file);
      }

      if (isEditMode && data?.note?.id) {
        await teacherApi.updateNote(data.note.id, fd);
      } else {
        await teacherApi.uploadNote(fd);
      }

      setSaveSuccess(true);
      setTimeout(() => { setSaveSuccess(false); onNavigate('class'); }, 1200);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save note.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="upload-notes-view">
      <button className="btn-back-text" onClick={() => onNavigate('class')}>
        <ChevronLeft size={18} /> Back to Class
      </button>

      <header className="upload-header">
        <h1>{isEditMode ? 'Edit Notes' : 'Upload Notes'}</h1>
        <p>{isEditMode ? 'Update existing study materials' : 'Share study materials with your class'}</p>
      </header>

      {saveSuccess && (
        <div className="success-banner">
          <CheckCircle size={18} color="#16a34a" />
          Notes {isEditMode ? 'updated' : 'uploaded'} successfully!
        </div>
      )}

      {errors.submit && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fca5a5' }}>
          {errors.submit}
        </div>
      )}

      <div className="upload-form-card card-box">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Note Title</label>
            <input type="text" name="title" placeholder="e.g. Introduction to Calculus"
              value={formData.title} onChange={handleChange} />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows={4} placeholder="Brief description..."
              value={formData.description} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Class</label>
              <select name="class" value={formData.class} onChange={handleChange} className="form-select">
                {['Y1A','Y1B','Y2A','Y2B','Y3A'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group half">
              <label>Course</label>
              <select name="course" value={formData.course} onChange={handleChange} className="form-select">
                {['Mathematics','Physics','Chemistry','Biology'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Academic Year</label>
              <input type="text" name="academicYear" placeholder="e.g. 2024-2025"
                value={formData.academicYear} onChange={handleChange} />
            </div>
            <div className="form-group half">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-select">
                {['Lecture Notes','Study Guide','Practice Problems','Past Papers','Reference Material'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Upload File</label>
            <div className={`upload-dropzone ${isDragOver ? 'drag-over' : ''} ${formData.file ? 'has-file' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}>
              <input type="file" id="file-upload" className="file-input-hidden"
                onChange={handleFileChange} accept=".pdf,.doc,.docx,.ppt,.pptx" />
              <label htmlFor="file-upload" className="dropzone-content">
                {formData.file ? (
                  <div className="file-selected">
                    <CheckCircle size={32} color="#16a34a" />
                    <span>{formData.file.name}</span>
                    <button className="remove-file-btn" type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFormData(prev => ({ ...prev, file: null })); }}>
                      <X size={14} /> Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={36} color="#6b7280" />
                    <strong>Click to upload or drag and drop</strong>
                    <span>PDF, DOC, DOCX, PPT, PPTX (Max 50MB)</span>
                  </>
                )}
              </label>
            </div>
            {errors.file && <span className="field-error">{errors.file}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => onNavigate('class')}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={saving}>
              {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Upload Notes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherUploadNotesView;
