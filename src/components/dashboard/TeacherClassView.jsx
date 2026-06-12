import React from 'react';
import { UploadCloud, Plus, FileText, Calendar, Users, Edit2, Eye, ChevronLeft } from 'lucide-react';
import './TeacherClassView.css';
import { teacherApi, getUser } from '../../api';

const TeacherClassView = ({ onNavigate, onSelectData, data }) => {
  const user = getUser();
  const className = data?.className || data?.id || 'Y1A';
  const courseName = data?.courseName || data?.subject || '';
  const [notes, setNotes] = React.useState([]);
  const [assignments, setAssignments] = React.useState([]);
  const [studentCount, setStudentCount] = React.useState(data?.students || 0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const profile = await teacherApi.getProfile();
        const teacherId = profile?.id || user?.id;
        if (!teacherId) {
          setNotes([]);
          setAssignments([]);
          return;
        }

        // Always fetch ALL assignments for this teacher then filter by className.
        // This avoids the empty-courseName issue when navigating from the class list.
        const [noteData, assignmentData, students] = await Promise.all([
          teacherApi.getNotes(teacherId),
          teacherApi.getAssignments(teacherId),
          teacherApi.getStudentsByClass(className),
        ]);

        // Filter notes for this class (ignore courseName filter — show all notes for the class)
        const filteredNotes = (noteData || []).filter(n => n.className === className);

        // Filter assignments for this class
        const filteredAssignments = (assignmentData || []).filter(
          a => a.className === className
        );

        setNotes(filteredNotes);
        setAssignments(filteredAssignments);
        setStudentCount((students || []).length);
      } catch (err) {
        console.error('Failed to load class data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [className, user?.id]);

  if (loading) {
    return (
      <div className="teacher-class-view">
        <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading class data...</div>
      </div>
    );
  }

  const handleUploadNotes = () => {
    onSelectData('note', { editMode: false, class: className, course: courseName });
    onNavigate('upload-notes');
  };

  const handleEditNote = (note) => {
    onSelectData('note', { editMode: true, note: { ...note, class: className, course: courseName } });
    onNavigate('upload-notes');
  };

  const handleAssignmentClick = (assignment) => {
    onSelectData('assignment', assignment);
    onNavigate('assignment-details');
  };

  const handleCreateAssignment = () => {
    onSelectData('class', { id: className, className, subject: courseName, courseName, students: studentCount });
    onNavigate('create-assignment');
  };

  return (
    <div className="teacher-class-view">
      <button className="btn-back-text" onClick={() => onNavigate('all-classes')}>
        <ChevronLeft size={18} /> Back to Classes
      </button>

      <header className="class-header-row">
        <div className="class-header-text">
          <h1>Class {className}{courseName ? ` — ${courseName}` : ''}</h1>
          <p>{studentCount} Students enrolled</p>
        </div>
        <div className="class-header-actions">
          <button className="btn-secondary" onClick={handleUploadNotes}>
            <UploadCloud size={18} /> Upload Notes
          </button>
          <button className="btn-primary" onClick={handleCreateAssignment}>
            <Plus size={18} /> Create Assignment
          </button>
        </div>
      </header>

      <div className="class-stats-grid">
        <div className="stat-card-slim card-box">
          <div className="slim-stat-header">
            <FileText size={18} color="#00234b" />
            <span>Total Notes</span>
          </div>
          <span className="slim-stat-value">{notes.length}</span>
        </div>
        <div className="stat-card-slim card-box">
          <div className="slim-stat-header">
            <Calendar size={18} color="#22c55e" />
            <span>Total Assignments</span>
          </div>
          <span className="slim-stat-value">{assignments.length}</span>
        </div>
        <div className="stat-card-slim card-box">
          <div className="slim-stat-header">
            <Calendar size={18} color="#f97316" />
            <span>Active Assignments</span>
          </div>
          <span className="slim-stat-value">
            {assignments.filter(a =>
              a.assignmentStatus === 'ACTIVE' ||
              (a.deadline && new Date(a.deadline) > new Date())
            ).length}
          </span>
        </div>
        <div className="stat-card-slim card-box">
          <div className="slim-stat-header">
            <Users size={18} color="#a855f7" />
            <span>Students</span>
          </div>
          <span className="slim-stat-value">{studentCount}</span>
        </div>
      </div>

      {/* Notes Section */}
      <section className="class-content-section card-box">
        <div className="section-header-row">
          <h2 className="section-title">Class Notes</h2>
          <button className="btn-secondary btn-sm" onClick={handleUploadNotes}>
            <UploadCloud size={16} /> Upload New
          </button>
        </div>
        {notes.length === 0 ? (
          <div className="empty-state">
            <FileText size={40} color="#d1d5db" />
            <p>No notes uploaded yet.</p>
          </div>
        ) : (
          <div className="content-list">
            {notes.map(note => (
              <div key={note.id} className="content-list-item">
                <div className="item-left">
                  <div className="note-icon-wrap">
                    <FileText size={20} color="#00234b" />
                  </div>
                  <div>
                    <h4>{note.title}</h4>
                    <p>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : '—'} · <span className="category-tag">{note.courseName || 'Notes'}</span></p>
                  </div>
                </div>
                <div className="item-right">
                  <span className="item-meta">{note.fileUrl ? 'File attached' : 'No file'}</span>
                  <button className="btn-edit" onClick={() => handleEditNote(note)}>
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Assignments Section */}
      <section className="class-content-section card-box">
        <div className="section-header-row">
          <h2 className="section-title">Assignments</h2>
          <button className="btn-primary btn-sm" onClick={handleCreateAssignment}>
            <Plus size={16} /> New Assignment
          </button>
        </div>
        {assignments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={40} color="#d1d5db" />
            <p>No assignments created yet.</p>
          </div>
        ) : (
          <div className="content-list">
            {assignments.map(assignment => (
              <div
                key={assignment.id}
                className="content-list-item clickable"
                onClick={() => handleAssignmentClick(assignment)}
              >
                <div className="item-left">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h4>{assignment.title}</h4>
                      <span className={`status-badge-small ${assignment.assignmentStatus === 'ACTIVE' ? 'active' : 'completed'}`}>
                        {assignment.assignmentStatus === 'ACTIVE' ? 'Active' : 'Overdue'}
                      </span>
                    </div>
                    <p>Due: {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
                <div className="item-right">
                  <div className="item-right-progress">
                    <strong>{assignment.totalSubmitted || 0}/{studentCount}</strong>
                    <span>Submitted</span>
                  </div>
                  <button className="btn-action-sm">
                    <Eye size={14} /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeacherClassView;
