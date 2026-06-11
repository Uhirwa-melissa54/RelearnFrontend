import React, { useState, useEffect } from 'react';
import { ChevronLeft, Users, BookOpen, CheckCircle, Plus, X, Copy, Eye, EyeOff } from 'lucide-react';
import './AdminAddUser.css';
import { adminApi } from '../../api';

const COURSES  = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science'];
const emptyRow = (defaultClass = '') => ({ id: Date.now() + Math.random(), class: defaultClass, course: 'Mathematics' });

const AdminAddUser = ({ onNavigate, data }) => {
  const isEditMode  = data?.editMode === true;
  const initialType = data?.userType || 'student';

  const [userType, setUserType]                 = useState(initialType);
  const [teacherClasses, setTeacherClasses]     = useState([emptyRow()]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [errors, setErrors]                     = useState({});
  const [saving, setSaving]                     = useState(false);
  const [saveSuccess, setSaveSuccess]           = useState(false);

  // After creation — show the generated password to admin
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [showPassword, setShowPassword]           = useState(false);
  const [copied, setCopied]                       = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    studentClass: '', academicYear: '2024-2025',
  });

  // ── Load classes from backend ────────────────────────────────────
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await adminApi.getClasses();
        const classNames = (res || []).map(c => c.className).filter(Boolean).sort();
        setAvailableClasses(classNames);
        if (!isEditMode && classNames.length > 0) {
          setFormData(prev => ({ ...prev, studentClass: prev.studentClass || classNames[0] }));
          setTeacherClasses([emptyRow(classNames[0])]);
        }
      } catch (err) {
        console.error('Failed to load classes:', err);
      }
    };
    loadClasses();
  }, []);

  // ── Pre-fill edit mode ───────────────────────────────────────────
  useEffect(() => {
    if (!isEditMode || !data) return;
    const parts = (data.fullName || '').split(' ');
    setFormData(prev => ({
      ...prev,
      firstName:    parts[0] || '',
      lastName:     parts.slice(1).join(' ') || '',
      email:        data.email || '',
      studentClass: data.className || '',
      academicYear: data.academicYear || '2024-2025',
    }));
    if ((data.role === 'TEACHER' || data.userType === 'teacher') && data.id) {
      adminApi.getClassesByTeacher(data.id)
        .then(classes => {
          if (classes?.length > 0) {
            setTeacherClasses(classes.map(c => ({
              id: Date.now() + Math.random(),
              class: c.className || '',
              course: 'Mathematics',
            })));
          }
        })
        .catch(() => {});
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
    return errs;
  };

  const handleCopyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const role     = userType === 'student' ? 'STUDENT' : 'TEACHER';
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      let savedUser;

      if (isEditMode) {
        savedUser = await adminApi.updateUser(data.id, {
          fullName,
          email:        formData.email,
          role,
          className:    userType === 'student' ? formData.studentClass : null,
          academicYear: userType === 'student' ? formData.academicYear : null,
          active:       true,
        });
      } else {
        // No password field — backend auto-generates and emails it
        savedUser = await adminApi.createUser({
          fullName,
          email:        formData.email,
          role,
          className:    userType === 'student' ? formData.studentClass : null,
          academicYear: userType === 'student' ? formData.academicYear : null,
        });

        // Backend returns generatedPassword in the response (one-time only)
        if (savedUser?.generatedPassword) {
          setGeneratedPassword(savedUser.generatedPassword);
        }
      }

      // Assign classes to teacher
      if (userType === 'teacher') {
        const teacherId = savedUser?.id ?? data?.id;
        const validRows = teacherClasses.filter(
          r => r.class?.trim() && availableClasses.includes(r.class.trim())
        );
        if (teacherId && validRows.length > 0) {
          for (const row of validRows) {
            try {
              await adminApi.assignTeacher(row.class.trim(), teacherId);
            } catch (assignErr) {
              console.warn(`Could not assign class "${row.class}":`, assignErr.message);
            }
          }
        }
      }

      setSaveSuccess(true);

      // If password was generated, keep the page open to show it to admin.
      // Admin navigates away manually after copying the password.
      if (!generatedPassword && !savedUser?.generatedPassword) {
        setTimeout(() => { setSaveSuccess(false); onNavigate('manage-users'); }, 1200);
      }

    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save user.' });
    } finally {
      setSaving(false);
    }
  };

  // ── Generated password banner ────────────────────────────────────
  const PasswordBanner = () => (
    <div style={{
      backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px',
      padding: '20px 24px', marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <CheckCircle size={20} color="#16a34a" />
        <strong style={{ color: '#15803d', fontSize: '1rem' }}>
          Account created successfully!
        </strong>
      </div>
      <p style={{ color: '#166534', fontSize: '0.9rem', marginBottom: '12px' }}>
        A welcome email with login credentials has been sent to <strong>{formData.email}</strong>.
        The generated password is shown below — copy it now as it won't be shown again.
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        backgroundColor: '#ffffff', border: '1px solid #d1fae5',
        borderRadius: '8px', padding: '10px 16px',
      }}>
        <code style={{
          flex: 1, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '2px',
          color: '#1A264A', userSelect: 'all',
        }}>
          {showPassword ? generatedPassword : '•'.repeat(generatedPassword?.length || 12)}
        </code>
        <button type="button" onClick={() => setShowPassword(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button type="button" onClick={handleCopyPassword}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: copied ? '#dcfce7' : '#1A264A',
            border: 'none', color: copied ? '#16a34a' : '#fff',
            padding: '6px 14px', borderRadius: '6px', cursor: 'pointer',
            fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
          }}>
          <Copy size={15} /> {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
        <button type="button"
          onClick={() => { setSaveSuccess(false); setGeneratedPassword(null); onNavigate('manage-users'); }}
          style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none',
            backgroundColor: '#16a34a', color: 'white', fontWeight: 600,
            cursor: 'pointer', fontSize: '0.9rem',
          }}>
          Done — Go to Users
        </button>
        <button type="button"
          onClick={() => { setSaveSuccess(false); setGeneratedPassword(null); setFormData({ firstName: '', lastName: '', email: '', studentClass: availableClasses[0] || '', academicYear: '2024-2025' }); }}
          style={{
            padding: '8px 20px', borderRadius: '8px', border: '1px solid #d1d5db',
            backgroundColor: 'white', color: '#4b5563', fontWeight: 600,
            cursor: 'pointer', fontSize: '0.9rem',
          }}>
          Create Another User
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-add-user">
      <button className="btn-back-text" onClick={() => onNavigate('manage-users')}>
        <ChevronLeft size={18} /> Back to Users
      </button>

      <header className="aau-header">
        <h1>{isEditMode ? 'Edit User' : 'Add New User'}</h1>
        <p>
          {isEditMode
            ? 'Update user account details'
            : 'Password is auto-generated and emailed to the user'}
        </p>
      </header>

      {/* Show generated password banner after creation */}
      {generatedPassword && <PasswordBanner />}

      {/* Only show form if we haven't just created (or in edit mode) */}
      {(!generatedPassword || isEditMode) && (
        <>
          {saveSuccess && !generatedPassword && (
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
                { type: 'student', label: 'Student', sub: 'Assign to one class',     icon: <Users    size={26} color="#1A264A" />, bg: '#eef2ff' },
                { type: 'teacher', label: 'Teacher', sub: 'Assign multiple classes', icon: <BookOpen size={26} color="#059669" />, bg: '#ecfdf5' },
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

            {/* Auto-password notice */}
            {!isEditMode && (
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#1e40af', fontSize: '0.875rem' }}>
                🔑 A secure password will be <strong>auto-generated</strong> and sent to the user's email. The user must change it on first login.
              </div>
            )}

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

              {/* Student class */}
              {userType === 'student' && (
                <>
                  <div className="aau-section-divider">Class Assignment</div>
                  <div className="form-row">
                    <div className="form-group half">
                      <label>Assign Class</label>
                      <select name="studentClass" value={formData.studentClass} onChange={handleChange}>
                        {availableClasses.length === 0
                          ? <option value="">No classes available — create one first</option>
                          : availableClasses.map(c => <option key={c} value={c}>{c}</option>)
                        }
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

              {/* Teacher classes */}
              {userType === 'teacher' && (
                <>
                  <div className="aau-section-divider">
                    Class Assignments
                    {availableClasses.length === 0 && (
                      <span style={{ color: '#f97316', fontSize: '0.8rem', fontWeight: 400, marginLeft: '8px' }}>
                        — No classes found. Create classes first.
                      </span>
                    )}
                  </div>
                  <div className="teacher-classes-section">
                    <div className="class-assignment-list">
                      {teacherClasses.map((row, idx) => (
                        <div key={row.id} className="class-assignment-row">
                          <span style={{ fontSize: '0.82rem', color: '#9ca3af', minWidth: '20px', fontWeight: 600 }}>{idx + 1}.</span>
                          <select value={row.class} onChange={(e) => handleClassRowChange(row.id, 'class', e.target.value)}>
                            <option value="">— Select class —</option>
                            {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
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
                      onClick={() => setTeacherClasses(prev => [...prev, emptyRow(availableClasses[0] || '')])}>
                      <Plus size={16} /> Add Another Class
                    </button>
                  </div>
                </>
              )}

              <div className="aau-form-actions">
                <button type="button" className="btn-cancel-form" onClick={() => onNavigate('manage-users')}>
                  Cancel
                </button>
                <button type="submit" className="btn-save-user" disabled={saving}>
                  {saving ? 'Saving...' : isEditMode ? 'Save Changes' : `Create ${userType === 'student' ? 'Student' : 'Teacher'}`}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAddUser;
