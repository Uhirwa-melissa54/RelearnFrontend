import React, { useState, useEffect } from 'react';
import { Users, BookOpen, ChevronRight } from 'lucide-react';
import './AllClassesView.css';
import { studentApi } from '../../api';

/**
 * Student "All Classes" view — shows every registered class (read-only).
 * Fetches the real class list from the admin endpoint.
 * Students can browse notes and assignments from any class.
 */
const AllClassesView = ({ onNavigate, onSelectData }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const classNames = await studentApi.getClasses();
        setClasses((classNames || []).map((name) => ({
          className: name,
          totalStudents: 0,
          totalNotes: 0,
        })));
      } catch (err) {
        console.error('Failed to load classes:', err);
        setError('Could not load classes. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleClassClick = (classInfo) => {
    onSelectData('class', {
      id:        classInfo.className,
      className: classInfo.className,
      name:      classInfo.className,
      readOnly:  true,
    });
    onNavigate('class');
  };

  if (loading) return (
    <div className="all-classes-view">
      <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading classes...</div>
    </div>
  );

  return (
    <div className="all-classes-view">
      <header className="classes-header">
        <h1>All Registered Classes</h1>
        <p>Explore academic materials from all classes across the school. (Read-Only Access)</p>
      </header>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      <div className="classes-grid">
        {classes.length === 0 ? (
          <div className="card-box" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            No classes registered yet.
          </div>
        ) : classes.map(cls => (
          <div key={cls.className} className="class-directory-card card-box"
            onClick={() => handleClassClick(cls)}>
            <div className="class-card-header">
              <h2>{cls.className}</h2>
              <span className="class-full-name">Year {cls.className?.match(/\d/)?.[0] || '?'}</span>
            </div>

            <div className="class-stats">
              <div className="class-stat">
                <Users size={16} color="#6b7280" />
                <span>{cls.totalStudents ?? 0} Students</span>
              </div>
              <div className="class-stat">
                <BookOpen size={16} color="#6b7280" />
                <span>{cls.totalNotes ?? 0} Notes</span>
              </div>
            </div>

            <div className="class-card-footer">
              <span>View Materials</span>
              <ChevronRight size={18} color="#00234b" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllClassesView;
