import React from 'react';
import { BookOpen, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import './DashboardOverview.css';

const DashboardOverview = ({ onNavigate, onSelectData }) => {
  const stats = [
    { label: 'Active Courses', value: '3', icon: <BookOpen size={20} color="#1A264A" />, bgColor: 'var(--secondary-color)' },
    { label: 'Pending Assignments', value: '2', icon: <Clock size={20} color="#f97316" />, bgColor: '#fff7ed' },
    { label: 'Completed Assignments', value: '15', icon: <CheckCircle size={20} color="#22c55e" />, bgColor: '#f0fdf4' },
    { label: 'Overdue', value: '1', icon: <AlertCircle size={20} color="#ef4444" />, bgColor: '#fef2f2' },
  ];

  const subjects = [
    { id: 1, name: 'Mathematics', teacher: 'Prof. Sarah', notes: '12 notes available' },
    { id: 2, name: 'Physics', teacher: 'Dr. Michael', notes: '10 notes available' },
    { id: 3, name: 'Chemistry', teacher: 'Ms. Emma', notes: '8 notes available' },
  ];

  const upcomingAssignments = [
    { id: 1, title: 'Calculus Problem Set 3', course: 'Mathematics', due: 'May 15, 2026', status: '4d left', statusColor: 'orange' },
    { id: 2, title: 'Quantum Mechanics Quiz', course: 'Physics', due: 'May 18, 2026', status: '7d left', statusColor: 'orange' },
    { id: 3, title: 'Organic Chemistry Lab Report', course: 'Chemistry', due: 'May 12, 2026', status: 'Overdue', statusColor: 'red' },
  ];

  const recentNotes = [
    { id: 1, title: 'Introduction to Calculus', course: 'Mathematics', date: 'May 8, 2026' },
    { id: 2, title: 'Quantum Mechanics Basics', course: 'Physics', date: 'May 7, 2026' },
    { id: 3, title: 'Organic Reactions', course: 'Chemistry', date: 'May 6, 2026' },
  ];

  const handleViewClass = () => {
    onNavigate('class');
  };

  const handleAssignmentClick = (assignment) => {
    onSelectData('assignment', assignment);
    onNavigate('assignment');
  };

  return (
    <div className="dashboard-overview">
      <header className="overview-header">
        <h1>Student Dashboard</h1>
        <p>Welcome back! Here's your academic overview</p>
      </header>

      <div className="stats-container">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon-bg" style={{ backgroundColor: stat.bgColor }}>
              {stat.icon}
            </div>
            <div className="stat-text">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="class-section card-box">
        <div className="section-header-row">
          <div>
            <h2>My Class - Y2A</h2>
            <p className="subtitle">Year 2</p>
          </div>
          <button className="btn-outline" onClick={handleViewClass}>View Class</button>
        </div>
        <div className="subjects-grid">
          {subjects.map(subject => (
            <div key={subject.id} className="subject-card">
              <BookOpen size={20} color="#1A264A" />
              <h3>{subject.name}</h3>
              <p className="teacher">{subject.teacher}</p>
              <p className="notes-count">{subject.notes}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bottom-grid">
        <section className="assignments-section card-box">
          <div className="section-header-row">
            <h2>Upcoming Assignments</h2>
            <button className="btn-link">View all</button>
          </div>
          <div className="list-container">
            {upcomingAssignments.map(task => (
              <div key={task.id} className="list-item" onClick={() => handleAssignmentClick(task)}>
                <div className="list-item-main">
                  <h4>{task.title}</h4>
                  <p>{task.course} <br/> Due: {task.due}</p>
                </div>
                <div className={`status-badge ${task.statusColor}`}>
                  {task.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="notes-section card-box">
          <div className="section-header-row">
            <h2>Recent Notes</h2>
          </div>
          <div className="list-container">
            {recentNotes.map(note => (
              <div key={note.id} className="list-item note-list-item">
                <FileText size={18} color="#1A264A" className="note-icon" />
                <div className="list-item-main">
                  <h4>{note.title}</h4>
                  <p>{note.course} • {note.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="history-section card-box history-banner">
        <div className="history-text">
          <h2>Academic History</h2>
          <p>View your complete academic journey across all years</p>
        </div>
        <button className="btn-primary" onClick={() => onNavigate('history')}>View History</button>
      </section>
    </div>
  );
};

export default DashboardOverview;
