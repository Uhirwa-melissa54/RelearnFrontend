import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, Plus, X } from 'lucide-react';
import './AdminAddClass.css';
import { adminApi } from '../../api';

const YEARS    = ['1', '2', '3'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];
const COURSES  = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'History', 'Computer Science', 'Geography',
];

const emptyCourse = () => ({ id: Date.now() + Math.random(), course: 'Mathematics' });

/**
 * Admin create/edit class form.
 *
 * On submit, calls adminApi.createUser to register a student with the new className,
 * which effectively "creates" the class in the system (classes are derived from
 * student.className values in the Auth Service).
 *
 * For teacher assignment: calls adminApi.assignRole / adminApi.updateUser to set
 * the teacher's class assignment.
 *
 * NOTE: The backend does not have a dedicated "Class" entity. Classes are implicit —
 * they exist when at least one student has that className. This form creates the
 * class by updating the admin's records.
 */
const AdminAddClass = ({ onNavigate, data }) => {
  const isEditMode = data?.editMode === true;

  const [teachers, setTeachers]         = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [formData, setFormData]         = useState({
    year: '1', section: 'A', teacherId: '', capacity: 40,
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  });
  const [assignedCourses, setAssignedCourses] = useState([emptyCourse()]);
  const [errors, setErrors]             = useState({});
  const [saving, setSaving]             = useState(false);
  const [saveSuccess, setSaveSuccess]   = useState(false);

  // Load real teachers from Auth Service
  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminApi.getTeachers({ size: 100 });
        const list = Array.isArray(res) ? res : (res?.content || []);
        setTeachers(list);
        if (list.length > 0 && !formData.teacherId) {
          setFormData(prev => ({ ...prev, teacherId: String(list[0].id) }));
        }
      } catch (err) {
        console.error('Failed to load teachers:', err);
      } finally {
        setLoadingTeachers(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (isEditMode && data) {
      setFormData({
        year:      String(data.year || data.className?.match(/\d/)?.[0] || '1'),
        section:   data.section || data.className?.replace(/[^A-Z]/g, '') || 'A',
        teacherId: String(data.teacherId || ''),
        capacity:  data.totalStudents || 40,
      });
    }
  }, [isEditMode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.year)    errs.year    = 'Year is required.';
    if (!formData.section) errs.section = 'Section is required.';
    if (assignedCourses.length === 0) errs.courses = 'Add at least one course.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const classId = `Y${formData.year}${formData.section}`;
      const payload = {
        className:    classId,
        academicYear: formData.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        capacity:     Number(formData.capacity) || 40,
        teacherId:    formData.teacherId ? Number(formData.teacherId) : null,
      };

      if (isEditMode && data?.className) {
        await adminApi.updateClass(data.className, payload);
      } else {
        await adminApi.createClass(payload);
      }

      // If a teacher was selected, also call assign-teacher to make it explicit
      if (formData.teacherId) {
        await adminApi.assignTeacher(classId, Number(formData.teacherId));
      }

      setSaveSuccess(true);
      setTimeout(() => { setSaveSuccess(false); onNavigate('manage-classes'); }, 1400);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save class.' });
    } finally {
      setSaving(false);
    }
  };

  const classId = `Y${formData.year}${formData.section}`;

  return (
    <div className="admin-add-class">
      <button className="btn-back-text" onClick={() => onNavigate('manage-classes')}>
        <ChevronLeft size={18} /> Back to Classes
      </button>

      <header className="aac-header">
        <h1>{isEditMode ? `Edit Class ${data?.className || data?.id}` : 'Create New Class'}</h1>
        <p>{isEditMode ? 'Update class details' : 'Set up a new academic class'}</p>
      </header>

      {saveSuccess && (
        <div className="aac-success">
          <CheckCircle size={18} color="#16a34a" />
          Class {isEditMode ? 'updated' : 'created'} successfully!
        </div>
      )}

      {errors.submit && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fca5a5' }}>
          {errors.submit}
        </div>
      )}

      <div className="aac-preview-badge">
        <span className="aac-preview-label">Class ID Preview:</span>
        <span className="aac-preview-id">{classId}</span>
        <span className="aac-preview-sub">Year {formData.year} — Section {formData.section}</span>
      </div>

      <div className="aac-form-card card-box">
        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>Assign Teacher {loadingTeachers && <span style={{ color: '#9ca3af', fontWeight: 400 }}>(loading...)</span>}</label>
            <select name="teacherId" value={formData.teacherId} onChange={handleChange}
              disabled={loadingTeachers}>
              <option value="">— Select a teacher —</option>
              {teachers.map(t => (
                <option key={t.id} value={String(t.id)}>{t.fullName} ({t.email})</option>
              ))}
            </select>
          </div>

          <div className="form-group half">
            <label>Student Capacity</label>
            <input type="number" name="capacity" min="1" max="100"
              value={formData.capacity} onChange={handleChange} />
          </div>

          <div className="aac-section-divider">Assigned Courses</div>
          <div className="aac-courses-list">
            {assignedCourses.map((c, idx) => (
              <div key={c.id} className="aac-course-row">
                <span className="aac-course-num">{idx + 1}.</span>
                <select value={c.course}
                  onChange={(e) => setAssignedCourses(prev =>
                    prev.map(x => x.id === c.id ? { ...x, course: e.target.value } : x))}>
                  {COURSES.map(course => <option key={course} value={course}>{course}</option>)}
                </select>
                {assignedCourses.length > 1 && (
                  <button type="button" className="aac-remove-course"
                    onClick={() => setAssignedCourses(prev => prev.filter(x => x.id !== c.id))}>
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.courses && <span className="field-error">{errors.courses}</span>}

          <button type="button" className="btn-add-course-row"
            onClick={() => setAssignedCourses(prev => [...prev, emptyCourse()])}>
            <Plus size={16} /> Add Another Course
          </button>

          <div className="aac-form-actions">
            <button type="button" className="btn-cancel-form"
              onClick={() => onNavigate('manage-classes')}>Cancel</button>
            <button type="submit" className="btn-save-class" disabled={saving}>
              {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddClass;
