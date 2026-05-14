import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Send, Eye } from 'lucide-react';
import './AssignmentsView.css';

const AssignmentsView = ({ onNavigate, onSelectData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const assignments = [
    { 
      id: 1, 
      title: 'Calculus Problem Set 3', 
      course: 'Mathematics', 
      teacher: 'Prof. Sarah Williams',
      deadline: 'May 15, 2026',
      status: 'PENDING',
      priority: 'CRITICAL Priority',
      description: 'Complete all problems from Chapter 3. Show all work and explain your reasoning for each solution.'
    },
    { 
      id: 2, 
      title: 'Quantum Mechanics Quiz', 
      course: 'Physics', 
      teacher: 'Dr. Michael Chang',
      deadline: 'May 18, 2026',
      status: 'RESOLVED',
      priority: 'MEDIUM Priority',
      description: 'Online quiz covering wave functions and the Schrodinger equation.'
    },
    { 
      id: 3, 
      title: 'Organic Chemistry Lab Report', 
      course: 'Chemistry', 
      teacher: 'Ms. Emma Davis',
      deadline: 'May 12, 2026',
      status: 'OVERDUE',
      priority: 'HIGH Priority',
      description: 'Full lab report on the synthesis of aspirin, including yield calculations.'
    }
  ];

  const handleActionClick = (assignment) => {
    onSelectData('assignment', assignment);
    onNavigate('assignment');
  };

  return (
    <div className="assignments-view">
      <header className="assignments-header">
        <div className="header-title-group">
          <h1>Manage Assignments</h1>
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
            placeholder="Search by title, course..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter size={18} color="#9ca3af" />
        </div>
        <select className="filter-select">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Resolved</option>
          <option>Overdue</option>
        </select>
        <select className="filter-select">
          <option>All Priorities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
        </select>
        <select className="filter-select">
          <option>All Courses</option>
          <option>Mathematics</option>
          <option>Physics</option>
          <option>Chemistry</option>
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
            
            <p className="assignment-desc">{assignment.description}</p>
            
            <div className="card-meta-row">
              <span className="course-badge">{assignment.course}</span>
              <span className={`priority-badge priority-${assignment.priority.split(' ')[0].toLowerCase()}`}>
                {assignment.priority}
              </span>
              <span className="teacher-info">by {assignment.teacher}</span>
            </div>

            <div className="card-bottom-row">
              <span className="deadline-text">DEADLINE: {assignment.deadline}</span>
              <button 
                className="btn-action" 
                onClick={() => handleActionClick(assignment)}
              >
                {assignment.status === 'PENDING' ? <><Send size={16} /> Submit</> : <><Eye size={16} /> View Details</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsView;
