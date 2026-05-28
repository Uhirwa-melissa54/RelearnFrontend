import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Calendar } from 'lucide-react';
import './ClassView.css';
import { studentApi, getUser } from '../../api';

const ClassView = ({ onSelectData, onNavigate, data }) => {
  const readOnly  = data?.readOnly || false;
  const className = data?.id || data?.className || getUser()?.className || 'Y1A';
  const classDesc = data?.name || '';

  const [noteGroups, setNoteGroups]             = useState([]);
  const [assignmentGroups, setAssignmentGroups] = useState([]);
  const [loading, setLoading]                   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [notes, assignments] = await Promise.all([
          studentApi.getNotesByClass(className),
          studentApi.getAssignmentsByClass(className),
        ]);
        setNoteGroups(notes || []);
        setAssignmentGroups(assignments || []);
      } catch (err) {
        console.error('ClassView load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [className]);

  const handleNoteClick = (note) => {
    onSelectData('document', note);
    onNavigate('document');
  };

  const handleAssignmentClick = (assignment) => {
    onSelectData('assignment', { ...assignment, readOnly });
    onNavigate('assignment');
  };

  if (loading) return (
    <div className="class-view">
      <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading class...</div>
    </div>
  );

  // Merge notes and assignments by course
  const allCourses = [...new Set([
    ...noteGroups.map(g => g.courseName),
    ...assignmentGroups.map(g => g.courseName),
  ])];

  return (
    <div className="class-view">
      <header className="class-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Class {className}</h1>
          <p>{classDesc}</p>
        </div>
        {readOnly && (
          <div className="read-only-badge" style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid #fca5a5' }}>
            Read-Only Access
          </div>
        )}
      </header>

      {allCourses.length === 0 ? (
        <div className="card-box" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          No content available for this class yet.
        </div>
      ) : (
        <div className="subjects-container">
          {allCourses.map(courseName => {
            const noteGroup       = noteGroups.find(g => g.courseName === courseName);
            const assignmentGroup = assignmentGroups.find(g => g.courseName === courseName);
            const notes       = noteGroup?.notes       || [];
            const assignments = assignmentGroup?.assignments || [];

            return (
              <div key={courseName} className="subject-block card-box">
                <div className="subject-header">
                  <div className="subject-title-row">
                    <BookOpen size={24} color="#1A264A" />
                    <h2>{courseName}</h2>
                  </div>
                </div>

                <div className="subject-content-grid">
                  {/* Notes */}
                  <div className="subject-column">
                    <div className="column-header">
                      <FileText size={18} color="#4b5563" />
                      <h3>Course Notes</h3>
                    </div>
                    <div className="items-list">
                      {notes.length === 0
                        ? <p className="empty-text">No notes available.</p>
                        : notes.map(note => (
                          <div key={note.id} className="detail-item" onClick={() => handleNoteClick(note)}>
                            <h4>{note.title}</h4>
                            <p>{new Date(note.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Assignments */}
                  <div className="subject-column">
                    <div className="column-header">
                      <Calendar size={18} color="#4b5563" />
                      <h3>Assignments</h3>
                    </div>
                    <div className="items-list">
                      {assignments.length === 0
                        ? <p className="empty-text">No assignments.</p>
                        : assignments.map(a => (
                          <div key={a.id} className="detail-item" onClick={() => handleAssignmentClick(a)}>
                            <div className="detail-item-main">
                              <h4>{a.title}</h4>
                              <p>Due: {a.deadline ? new Date(a.deadline).toLocaleDateString() : '—'}</p>
                            </div>
                            <div className={`status-badge ${a.assignmentStatus === 'OVERDUE' ? 'red' : 'orange'}`}>
                              {a.assignmentStatus || 'ACTIVE'}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassView;
