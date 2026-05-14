import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Eye } from 'lucide-react';
// Reuse AssignmentsView.css from the student side, as the layout is identical
import './AssignmentsView.css';

const TeacherAssignmentsView = ({ onNavigate, onSelectData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const assignments = [
    { 
      id: 1, 
      title: 'Calculus Problem Set 3', 
      course: 'Mathematics', 
      class: 'Y3A',
      deadline: 'May 15, 2026',
      status: 'ACTIVE',
      submitted: 28,
      total: 35
    },
    { 
      id: 2, 
      title: 'Quantum Mechanics Quiz', 
      course: 'Physics', 
      class: 'Y2B',
      deadline: 'May 18, 2026',
      status: 'ACTIVE',
      submitted: 35,
      total: 40
    },
    { 
      id: 3, 
      title: 'Integration Assignment', 
      course: 'Mathematics', 
      class: 'Y1A',
      deadline: 'May 10, 2026',
      status: 'COMPLETED',
      submitted: 42,
      total: 42
    }
  ];

  const handleActionClick = (assignment) => {
    onSelectData('assignment', assignment);
    onNavigate('assignment-details');
  };

  return (
    <div className="assignments-view">
      <header className="assignments-header">
        <div className="header-title-group">
          <h1>All Assignments</h1>
          <p>{assignments.length} assignments found</p>
        </div>
        <button className="btn-refresh">
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      <div className="filters-bar card-box">
        <div className="search-wrapper">
          <Search size={18} color="#9ca3af" />
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter size={18} color="#9ca3af" />
        </div>
        <select className="filter-select">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Overdue</option>
          <option>Graded</option>
          <option>Completed</option>
        </select>
        <select className="filter-select">
          <option>All Classes</option>
          <option>Y1A</option>
          <option>Y2B</option>
          <option>Y3A</option>
        </select>
        <select className="filter-select">
          <option>All Courses</option>
          <option>Mathematics</option>
          <option>Physics</option>
        </select>
      </div>

      <div className="assignments-list">
        {assignments.map(assignment => (
          <div key={assignment.id} className="assignment-list-card card-box">
            <div className="card-top-row">
              <div className="card-title">
                <h3>{assignment.title} <span>#{assignment.id}</span></h3>
              </div>
              <div className={`status-badge status-${assignment.status.toLowerCase()}`}>
                {assignment.status}
              </div>
            </div>
            
            <div className="card-meta-row" style={{ marginTop: '12px' }}>
              <span className="course-badge">{assignment.class} - {assignment.course}</span>
              <span className="priority-badge priority-medium">
                {assignment.submitted}/{assignment.total} Submitted
              </span>
            </div>

            <div className="card-bottom-row">
              <span className="deadline-text">DUE: {assignment.deadline}</span>
              <button 
                className="btn-action" 
                onClick={() => handleActionClick(assignment)}
              >
                <Eye size={16} /> View Submissions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherAssignmentsView;
