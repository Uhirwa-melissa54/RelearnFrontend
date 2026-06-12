import React, { useState, useEffect } from 'react';
import { Users, BookOpen, ChevronRight } from 'lucide-react';
import './AllClassesView.css';
import { teacherApi } from '../../api';

/**
 * Teacher "My Classes" view.
 *
 * Uses GET /api/teacher/assigned-classes which reads directly from the
 * AcademicClass table (teacherId column). This reflects admin assignments
 * immediately — no need to have created any assignments first.
 */
const TeacherAllClassesView = ({ onNavigate, onSelectData }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // Single call — gets classes assigned by admin from AcademicClass table
        const data = await teacherApi.getAssignedClasses();
        setClasses(data || []);
      } catch (err) {
        console.error('Failed to load assigned classes:', err);
        setError(err.message || 'Failed to load classes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleClassClick = (cls) => {
    onSelectData('class', {
      id:          cls.className,
      className:   cls.className,
      subject:     cls.courseName || '',
      courseName:  cls.courseName || '',
      students:    cls.totalStudents || 0,
      academicYear: cls.academicYear || '',
    });
    onNavigate('class');
  };

  if (loading) return (
    <div className="all-classes-view">
      <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
        Loading classes...
      </div>
    </div>
  );

  return (
    <div className="all-classes-view">
      <header className="classes-header">
        <h1>My Assigned Classes</h1>
        <p>Classes assigned to you by the admin. Manage notes and assignments here.</p>
      </header>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px',
          borderRadius: '8px', marginBottom: '16px', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      <div className="classes-grid">
        {classes.length === 0 ? (
          <div className="card-box" style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
            <BookOpen size={40} color="#d1d5db" style={{ marginBottom: '12px' }} />
            <p style={{ fontWeight: 600 }}>No classes assigned yet.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>
              Contact your admin to assign classes to your account.
            </p>
          </div>
        ) : classes.map((cls, idx) => (
          <div key={`${cls.className}-${idx}`}
            className="class-directory-card card-box"
            onClick={() => handleClassClick(cls)}>

            <div className="class-card-header">
              <div>
                <h2>{cls.className}</h2>
                <span className="class-full-name">{cls.academicYear || 'Academic Year'}</span>
              </div>
              <div className="class-subject-icon">
                <BookOpen size={20} color="#00234b" />
              </div>
            </div>

            <div className="class-stats">
              <div className="class-stat">
                <Users size={15} color="#6b7280" />
                <span>{cls.totalStudents ?? 0} Students</span>
              </div>
              <div className="class-stat">
                <BookOpen size={15} color="#6b7280" />
                <span>Capacity: {cls.capacity ?? '—'}</span>
              </div>
            </div>

            <div className="class-card-footer">
              <span>Manage Class</span>
              <ChevronRight size={18} color="#00234b" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherAllClassesView;
