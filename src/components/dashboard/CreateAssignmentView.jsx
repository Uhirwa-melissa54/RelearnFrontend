import React, { useState } from 'react';
import { Calendar, Clock, Hash, ChevronLeft, CheckCircle, UploadCloud, X } from 'lucide-react';
import './CreateAssignmentView.css';
import { teacherApi, getUser } from '../../api';

const CreateAssignmentView = ({ onNavigate, data }) => {
  const classData = data;
  const user = getUser();

  const [formData, setFormData] = useState({
    title: '', description: '', dueDate: '', dueTime: '',
    points: 100, submissionType: 'BOTH', allowLate: false,
    class:  classData?.id      || classData?.className  || 'Y1A',
    course: classData?.subject || classData?.courseName || 'Mathematics',
    academicYear: '2024-2025',
    file: null,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors]         = useState({});
  const [saving, setSaving]         = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
    if (!formData.title.trim()) errs.title   = 'Assignment title is required.';
    if (!formData.dueDate)      errs.dueDate  = 'Due date is required.';
    if (!formData.dueTime)      errs.dueTime  = 'Due time is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      // If a file is attached, upload via multipart; otherwise use JSON
      const deadline = `${formData.dueDate}T${formData.dueTime}:00`;

      if (formData.file) {
        const fd = new FormData();
        fd.append('title',          formData.title);
        fd.append('description',    formData.description || '');
        fd.append('deadline',       deadline);
        fd.append('className',      formData.class);
        fd.append('courseName',     formData.course);
        fd.append('academicYear',   formData.academicYear);
        fd.append('teacherId',      user.id);
        fd.append('submissionType', formData.submissionType);
        fd.append('file',           formData.file);
        // Use the multipart endpoint on the assignment controller
        const { apiUpload } = await import('../../api');
        await apiUpload('/teacher/assignments', fd, 'POST');
      } else {
        await teacherApi.createAssignment({
          title:          formData.title,
          description:    formData.description,
          deadline,
          className:      formData.class,
          courseName:     formData.course,
          academicYear:   formData.academicYear,
          teacherId:      user.id,
          submissionType: formData.submissionType,
        });
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onNavigate(classData ? 'class' : 'assignments');
      }, 1200);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to create assignment.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-assignment-view">
      <button className="btn-back-nav" onClick={() => onNavigate(classData ? 'class' : 'assignments')}>
        <ChevronLeft size={18} /> Back
      </button>

      <header className="create-header">
        <h1>Create Assignment</h1>
        <p>{classData
          ? `Adding assignment for ${formData.class} — ${formData.course}`
          : 'Add a new assignment for your class'}</p>
      </header>

      {saveSuccess && (
        <div className="ca-success-banner">
          <CheckCircle size={18} color="#16a34a" /> Assignment created successfully!
        </div>
      )}

      {errors.submit && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fca5a5' }}>
          {errors.submit}
        </div>
      )}

      <div className="create-form-card card-box">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Assignment Title</label>
            <input type="text" name="title" placeholder="e.g. Calculus Problem Set 4"
              value={formData.title} onChange={handleChange} />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description & Instructions</label>
            <textarea name="description" rows={5}
              placeholder="Provide detailed instructions..."
              value={formData.description} onChange={handleChange} />
          </div>

          {!classData && (
            <div className="form-row">
              <div className="form-group half">
                <label>Class</label>
                <select name="class" value={formData.class} onChange={handleChange} className="ca-select">
                  {['Y1A','Y1B','Y2A','Y2B','Y3A'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group half">
                <label>Course</label>
                <select name="course" value={formData.course} onChange={handleChange} className="ca-select">
                  {['Mathematics','Physics','Chemistry','Biology'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group half">
              <label>Academic Year</label>
              <input type="text" name="academicYear" placeholder="e.g. 2024-2025"
                value={formData.academicYear} onChange={handleChange} />
            </div>
            <div className="form-group half">
              <label>Total Points</label>
              <div className="input-with-icon">
                <Hash size={18} color="#9ca3af" />
                <input type="number" name="points" min="0"
                  value={formData.points} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Due Date</label>
              <div className="input-with-icon">
                <Calendar size={18} color="#9ca3af" />
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
              </div>
              {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
            </div>
            <div className="form-group half">
              <label>Due Time</label>
              <div className="input-with-icon">
                <Clock size={18} color="#9ca3af" />
                <input type="time" name="dueTime" value={formData.dueTime} onChange={handleChange} />
              </div>
              {errors.dueTime && <span className="field-error">{errors.dueTime}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Submission Type</label>
            <div className="radio-group">
              {[
                { value: 'FILE_ONLY', label: 'File Upload Only' },
                { value: 'TEXT_ONLY', label: 'Text Submission Only' },
                { value: 'BOTH',      label: 'Both' },
              ].map(opt => (
                <label key={opt.value} className="radio-label">
                  <input type="radio" name="submissionType" value={opt.value}
                    checked={formData.submissionType === opt.value} onChange={handleChange} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Attach File <span className="optional-label">(optional)</span></label>
            <div className={`upload-dropzone-sm ${isDragOver ? 'drag-over' : ''} ${formData.file ? 'has-file' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}>
              <input type="file" id="assignment-file" className="file-input-hidden" onChange={handleFileChange} />
              <label htmlFor="assignment-file" className="dropzone-content-sm">
                {formData.file ? (
                  <div className="file-selected-sm">
                    <CheckCircle size={20} color="#16a34a" />
                    <span>{formData.file.name}</span>
                    <button className="remove-file-btn-sm" type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFormData(prev => ({ ...prev, file: null })); }}>
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={22} color="#9ca3af" />
                    <span>Click to attach a file or drag and drop</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" name="allowLate" checked={formData.allowLate} onChange={handleChange} />
              Allow late submissions
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel"
              onClick={() => onNavigate(classData ? 'class' : 'assignments')}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignmentView;
