import React from 'react';
import { BookOpen, FileText, Calendar } from 'lucide-react';
import './ClassView.css';

const ClassView = ({ onSelectData, onNavigate }) => {
  const subjects = [
    {
      id: 1,
      name: 'Mathematics',
      teacher: 'Prof. Sarah Williams',
      notes: [
        { id: 1, title: 'Introduction to Calculus', date: 'May 1, 2026' },
        { id: 2, title: 'Limits and Continuity', date: 'May 3, 2026' },
        { id: 3, title: 'Derivatives - Part 1', date: 'May 5, 2026' },
      ],
      assignments: [
        { id: 1, title: 'Calculus Problem Set 3', due: 'May 15, 2026', status: 'pending' },
        { id: 2, title: 'Midterm Preparation', due: 'May 18, 2026', status: 'pending' },
      ]
    },
    {
      id: 2,
      name: 'Physics',
      teacher: 'Dr. Michael Chang',
      notes: [
        { id: 4, title: 'Kinematics', date: 'May 2, 2026' }
      ],
      assignments: []
    }
  ];

  const handleNoteClick = (note) => {
    onSelectData('document', note);
    onNavigate('document');
  };

  const handleAssignmentClick = (assignment) => {
    onSelectData('assignment', assignment);
    onNavigate('assignment');
  };

  return (
    <div className="class-view">
      <header className="class-header">
        <h1>Class Y2A</h1>
        <p>Year 2 • 45 Students</p>
      </header>

      <div className="subjects-container">
        {subjects.map(subject => (
          <div key={subject.id} className="subject-block card-box">
            <div className="subject-header">
              <div className="subject-title-row">
                <BookOpen size={24} color="#3b82f6" />
                <h2>{subject.name}</h2>
              </div>
              <p className="subject-teacher">{subject.teacher}</p>
            </div>

            <div className="subject-content-grid">
              {/* Left Column: Notes */}
              <div className="subject-column">
                <div className="column-header">
                  <FileText size={18} color="#4b5563" />
                  <h3>Course Notes</h3>
                </div>
                <div className="items-list">
                  {subject.notes.map(note => (
                    <div key={note.id} className="detail-item" onClick={() => handleNoteClick(note)}>
                      <h4>{note.title}</h4>
                      <p>{note.date}</p>
                    </div>
                  ))}
                  {subject.notes.length === 0 && <p className="empty-text">No notes available.</p>}
                </div>
              </div>

              {/* Right Column: Assignments */}
              <div className="subject-column">
                <div className="column-header">
                  <Calendar size={18} color="#4b5563" />
                  <h3>Assignments</h3>
                </div>
                <div className="items-list">
                  {subject.assignments.map(assignment => (
                    <div key={assignment.id} className="detail-item" onClick={() => handleAssignmentClick(assignment)}>
                      <div className="detail-item-main">
                        <h4>{assignment.title}</h4>
                        <p>Due: {assignment.due}</p>
                      </div>
                      <div className={`status-badge ${assignment.status === 'pending' ? 'orange' : ''}`}>
                        {assignment.status}
                      </div>
                    </div>
                  ))}
                  {subject.assignments.length === 0 && <p className="empty-text">No pending assignments.</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassView;
