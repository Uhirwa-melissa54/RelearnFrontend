import React from 'react';
import { Users, BookOpen, ChevronRight } from 'lucide-react';
import './AllClassesView.css';

const AllClassesView = ({ onNavigate, onSelectData }) => {
  const classes = [
    { id: 'Y1A', name: 'Year 1 - Class A', students: 34, courses: 6 },
    { id: 'Y1B', name: 'Year 1 - Class B', students: 32, courses: 6 },
    { id: 'Y2A', name: 'Year 2 - Class A', students: 28, courses: 5 },
    { id: 'Y2B', name: 'Year 2 - Class B', students: 30, courses: 5 },
    { id: 'Y3A', name: 'Year 3 - Class A', students: 25, courses: 4 },
  ];

  const handleClassClick = (classInfo) => {
    // Pass readOnly flag as part of selected data
    onSelectData('class', { ...classInfo, readOnly: true });
    onNavigate('class');
  };

  return (
    <div className="all-classes-view">
      <header className="classes-header">
        <h1>All Registered Classes</h1>
        <p>Explore academic materials from all classes across the school. (Read-Only Access)</p>
      </header>

      <div className="classes-grid">
        {classes.map(cls => (
          <div key={cls.id} className="class-directory-card card-box" onClick={() => handleClassClick(cls)}>
            <div className="class-card-header">
              <h2>{cls.id}</h2>
              <span className="class-full-name">{cls.name}</span>
            </div>
            
            <div className="class-stats">
              <div className="class-stat">
                <Users size={16} color="#6b7280" />
                <span>{cls.students} Students</span>
              </div>
              <div className="class-stat">
                <BookOpen size={16} color="#6b7280" />
                <span>{cls.courses} Courses</span>
              </div>
            </div>

            <div className="class-card-footer">
              <span>View Materials</span>
              <ChevronRight size={18} color="#1A264A" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllClassesView;
