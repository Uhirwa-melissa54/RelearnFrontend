import React from 'react';
import { Users, BookOpen, ChevronRight } from 'lucide-react';
// Reuse AllClassesView.css from the student side, as the layout is identical
import './AllClassesView.css';

const TeacherAllClassesView = ({ onNavigate, onSelectData }) => {
  const classes = [
    { id: 'Y1A', name: 'Year 1 - Class A', subject: 'Mathematics', students: 42, assignments: 12 },
    { id: 'Y2B', name: 'Year 2 - Class B', subject: 'Physics', students: 40, assignments: 10 },
    { id: 'Y3A', name: 'Year 3 - Class A', subject: 'Mathematics', students: 35, assignments: 15 },
  ];

  const handleClassClick = (classInfo) => {
    onSelectData('class', classInfo);
    onNavigate('class');
  };

  return (
    <div className="all-classes-view">
      <header className="classes-header">
        <h1>My Assigned Classes</h1>
        <p>Manage courses, notes, and assignments for your classes.</p>
      </header>

      <div className="classes-grid">
        {classes.map(cls => (
          <div key={cls.id} className="class-directory-card card-box" onClick={() => handleClassClick(cls)}>
            <div className="class-card-header">
              <h2>{cls.id}</h2>
              <span className="class-full-name">{cls.name} • {cls.subject}</span>
            </div>
            
            <div className="class-stats">
              <div className="class-stat">
                <Users size={16} color="#6b7280" />
                <span>{cls.students} Enrolled Students</span>
              </div>
              <div className="class-stat">
                <BookOpen size={16} color="#6b7280" />
                <span>{cls.assignments} Active Assignments</span>
              </div>
            </div>

            <div className="class-card-footer">
              <span>Manage Class</span>
              <ChevronRight size={18} color="#1A264A" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherAllClassesView;
