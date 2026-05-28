import React, { useState, useEffect } from 'react';
import { ChevronLeft, Users, BookOpen, CheckCircle, Plus, X } from 'lucide-react';
import './AdminAddUser.css';
import { adminApi } from '../../api';

const CLASSES  = ['Y1A', 'Y1B', 'Y1C', 'Y2A', 'Y2B', 'Y2C', 'Y3A', 'Y3B', 'Y3C'];
const COURSES  = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science'];
const emptyRow = () => ({ id: Date.now() + Math.random(), class: 'Y1A', course: 'Mathematics' });

const AdminAddUser = ({ onNavigate, data }) => {
  const isEditMode   = data?.editMode === true;
  const initialType  = data?.userType || 'student';

  const [userType, setUserType]         = useState(initialType);
  const [teacherClasses, setTeacherClasses] = useState([emptyRow()]);
  const [errors, setErrors]             = useState({});
  const [saving, setSaving]             = useState(false);
  const [saveSuccess, setSaveSuccess]   = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '',
    studentClass: 'Y1A', academicYear: '2024-2025',
  });

  useEffect(() => {
    if (isEditMode && data) {
      const parts = (data.fullName || '').split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: parts[0] || '',
        lastName:  parts.slice(1).join(' ') || '',
        email:     data.email || '',
        studentClass: data.className || 'Y1A',
        academicYear: data.academicYear || '2024-2025',
      }));
    }
  }, [isEditMode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleClassRowChange = (id, field, value) =>
    setTeacherClasses(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim())  errs.lastName  = 'Last name is required.';
    if (!formData.email.trim())     errs.email     = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email.';
    if (!isEditMode) {
      if (!formData.password)              errs.password        = 'Password is required.';
      else if (formData.password.length < 6) errs.password      = 'Min 6 characters.';
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords don't match.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const role     = userType === 'student' ? 'STUDENT' : 'TEACHER';
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      if (isEditMode) {
        await adminApi.updateUser(data.id, {
          fullName,
          email:       formData.email,
          role,
          className:   userType === 'student' ? formData.studentClass : null,
          academicYear: userType === 'student' ? formData.academicYear : null,
          active:      true,
        });
      } else {
        await adminApi.createUser({
          fullName,
          email:       formData.email,
          password:    formData.password,
          role,
          className:   userType === 'student' ? formData.studentClass : null,
          academicYear: userType === 'student' ? formData.academicYear : null,
        });
      }

      setSaveSuccess(true);
      setTimeout(() => { setSaveSuccess(false); onNavigate('manage-users'); }, 1200);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save user.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-add-user">
      <button className="btn-back-text" onClick={() => onNavigate('manage-users')}>
        <ChevronLeft size={18} /> Back to Users
      </button>

      <header className="aau-header">
        <h1>{isEditMode ? 'Edit User' : 'Add New User'}</h1>
        <p>{isEditMode ? 'Update user account details' : 'Create a new student or teacher account'}</p>
      </header>

      {saveSuccess && (
        <div className="aau-success">
          <CheckCircle size={18} color="#16a34a" />
          User {isEditMode ? 'updated' : 'created'} successfully!
        </div>
      )}

      {errors.submit && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fca5a5' }}>
          {errors.submit}
        </div>
      )}

      {!isEditMode && (
        <div className="role-selector">
          {[
            { type: 'student', label: 'Student', sub: 'Assign to one class',       icon: <Users size={26} color="#1A264A" />,   bg: '#eef2ff' },
            { type: 'teacher', label: 'Teacher', sub: 'Assign multiple classes',   icon: <BookOpen size={26} color="#059669" />, bg: '#ecfdf5' },
          ].map(opt => (
            <button key={opt.type} type="button"
              className={`role-option ${userType === opt.type ? 'selected' : ''}`}
              onClick={() => setUserType(opt.type)}>
              <div className="role-icon" style={{ backgroundColor: opt.bg }}>{opt.icon}</div>
              <div className="role-text"><strong>{opt.label}</strong><span>{opt.sub}</span></div>
              <div className="role-check">{userType === opt.type && <CheckCircle size={14} color="white" />}</div>
            </button>
          ))}
        </div>
      )}

      <div className="aau-form-card card-box">
        <h2>{userType === 'student' ? 'Student' : 'Teacher'} Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group half">
              <label>First Name</label>
              <input type="text" name="firstName" placeholder="e.g. Alice"
                value={formData.firstName} onChange={handleChange} />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>
            <div className="form-group half">
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="e.g. Johnson"
                value={formData.lastName} onChange={handleChange} />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="e.g. alice@relearn.edu"
              value={formData.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {!isEditMode && (
            <div className="form-row">
              <div className="form-group half">
                <label>Password</label>
                <input type="password" name="password" placeholder="Min. 6 characters"
                  value={formData.password} onChange={handleChange} />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
              <div className="form-group half">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="Repeat password"
                  value={formData.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>
            </div>
          )}

          {userType === 'student' && (
            <>
              <div className="aau-section-divider">Class Assignment</div>
              <div className="form-row">
                <div className="form-group half">
                  <label>Assign Class</label>
                  <select name="studentClass" value={formData.studentClass} onChange={handleChange}>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group half">
                  <label>Academic Year</label>
                  <input type="text" name="academicYear" placeholder="e.g. 2024-2025"
                    value={formData.academicYear} onChange={handleChange} />
                </div>
              </div>
            </>
          )}

          {userType === 'teacher' && (
            <>
              <div className="aau-section-divider">Class Assignments</div>
              <div className="teacher-classes-section">
                <div className="class-assignment-list">
                  {teacherClasses.map((row, idx) => (
                    <div key={row.id} className="class-assignment-row">
                      <span style={{ fontSize: '0.82rem', color: '#9ca3af', minWidth: '20px', fontWeight: 600 }}>{idx + 1}.</span>
                      <select value={row.class} onChange={(e) => handleClassRowChange(row.id, 'class', e.target.value)}>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select value={row.course} onChange={(e) => handleClassRowChange(row.id, 'course', e.target.value)}>
                        {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {teacherClasses.length > 1 && (
                        <button type="button" className="remove-class-btn"
                          onClick={() => setTeacherClasses(prev => prev.filter(r => r.id !== row.id))}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" className="btn-add-class-row"
                  onClick={() => setTeacherClasses(prev => [...prev, emptyRow()])}>
                  <Plus size={16} /> Add Another Class
                </button>
              </div>
            </>
          )}

          <div className="aau-form-actions">
            <button type="button" className="btn-cancel-form" onClick={() => onNavigate('manage-users')}>Cancel</button>
            <button type="submit" className="btn-save-user" disabled={saving}>
              {saving ? 'Saving...' : isEditMode ? 'Save Changes' : `Create ${userType === 'student' ? 'Student' : 'Teacher'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUser;
