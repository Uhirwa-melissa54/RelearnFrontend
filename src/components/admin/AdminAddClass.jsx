import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, Plus, X } from 'lucide-react';
import './AdminAddClass.css';

const YEARS = ['1', '2', '3'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];
const TEACHERS = [
  'Prof. Sarah Johnson',
  'Dr. Michael Chen',
  'Ms. Emma Wilson',
  'Mr. James Carter',
  'Dr. Lisa Park',
];
const COURSES = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'History', 'Computer Science', 'Geography',
];

const emptyCourse = () => ({ id: Date.now() + Math.random(), course: 'Mathematics' });

const AdminAddClass = ({ onNavigate, data }) => {
  const isEditMode = data?.editMode === true;

  const [formData, setFormData] = useState({
    year: '1',
    section: 'A',
    teacher: TEACHERS[0],
    capacity: 40,
  });
  const [assignedCourses, setAssignedCourses] = useState([emptyCourse()]);
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode && data) {
      setFormData({
        year: String(data.year || '1'),
        section: data.section || 'A',
        teacher: data.teacher || TEACHERS[0],
        capacity: data.students || 40,
      });
      if (data.courses > 0) {
        // Pre-fill with placeholder courses in edit mode
        setAssignedCourses(
          Array.from({ length: data.courses }, (_, i) => ({
            id: i,
            course: COURSES[i % COURSES.length],
          }))
        );
      }
    }
  }, [isEditMode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCourseChange = (id, value) => {
    setAssignedCourses(prev => prev.map(c => c.id === id ? { ...c, course: value } : c));
  };

  const addCourse = () => setAssignedCourses(prev => [...prev, emptyCourse()]);

  const removeCourse = (id) => {
    setAssignedCourses(prev => prev.filter(c => c.id !== id));
  };

  const validate = () => {
    const errs = {};
    if (!formData.year) errs.year = 'Year is required.';
    if (!formData.section) errs.section = 'Section is required.';
    if (!formData.teacher) errs.teacher = 'Main teacher is required.';
    if (assignedCourses.length === 0) errs.courses = 'Add at least one course.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onNavigate('manage-classes');
    }, 1400);
  };

  const classId = `Y${formData.year}${formData.section}`;

  return (
    <div className="admin-add-class">
      <button className="btn-back-text" onClick={() => onNavigate('manage-classes')}>
        <ChevronLeft size={18} /> Back to Classes
      </button>

      <header className="aac-header">
        <h1>{isEditMode ? `Edit Class ${data?.id}` : 'Create New Class'}</h1>
        <p>{isEditMode ? 'Update class details and assignments' : 'Set up a new academic class'}</p>
      </header>

      {saveSuccess && (
        <div className="aac-success">
          <CheckCircle size={18} color="#16a34a" />
          Class {isEditMode ? 'updated' : 'created'} successfully!
        </div>
      )}

      {/* Preview badge */}
      <div className="aac-preview-badge">
        <span className="aac-preview-label">Class ID Preview:</span>
        <span className="aac-preview-id">{classId}</span>
        <span className="aac-preview-sub">Year {formData.year} — Section {formData.section}</span>
      </div>

      <div className="aac-form-card card-box">
        <form onSubmit={handleSubmit}>
          {/* Year & Section */}
          <h2 className="aac-section-heading">Class Details</h2>
          <div className="form-row">
            <div className="form-group half">
              <label>Year</label>
              <select name="year" value={formData.year} onChange={handleChange}>
                {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
              {errors.year && <span className="field-error">{errors.year}</span>}
            </div>
            <div className="form-group half">
              <label>Section</label>
              <select name="section" value={formData.section} onChange={handleChange}>
                {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
              </select>
              {errors.section && <span className="field-error">{errors.section}</span>}
            </div>
          </div>

          {/* Main Teacher */}
          <div className="form-group">
            <label>Main Teacher</label>
            <select name="teacher" value={formData.teacher} onChange={handleChange}>
              {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.teacher && <span className="field-error">{errors.teacher}</span>}
          </div>

          {/* Capacity */}
          <div className="form-group half">
            <label>Student Capacity</label>
            <input
              type="number"
              name="capacity"
              min="1"
              max="100"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div>

          {/* Courses */}
          <div className="aac-section-divider">Assigned Courses</div>

          <div className="aac-courses-list">
            {assignedCourses.map((c, idx) => (
              <div key={c.id} className="aac-course-row">
                <span className="aac-course-num">{idx + 1}.</span>
                <select
                  value={c.course}
                  onChange={(e) => handleCourseChange(c.id, e.target.value)}
                >
                  {COURSES.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                {assignedCourses.length > 1 && (
                  <button
                    type="button"
                    className="aac-remove-course"
                    onClick={() => removeCourse(c.id)}
                    title="Remove course"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.courses && <span className="field-error">{errors.courses}</span>}

          <button type="button" className="btn-add-course-row" onClick={addCourse}>
            <Plus size={16} /> Add Another Course
          </button>

          <div className="aac-form-actions">
            <button type="button" className="btn-cancel-form" onClick={() => onNavigate('manage-classes')}>
              Cancel
            </button>
            <button type="submit" className="btn-save-class">
              {isEditMode ? 'Save Changes' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddClass;
