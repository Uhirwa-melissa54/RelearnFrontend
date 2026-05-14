import React from 'react';
import { BookOpen, FileText, Users, Clock } from 'lucide-react';
import './TeacherOverview.css';

const TeacherOverview = ({ onNavigate, onSelectData }) => {
  const stats = [
    { label: 'Active Classes', value: '3', icon: <BookOpen size={24} color="#1A264A" />, bgColor: '#f3f4f6' },
    { label: 'Total Assignments', value: '37', icon: <FileText size={24} color="#22c55e" />, bgColor: '#f0fdf4' },
    { label: 'Total Students', value: '117', icon: <Users size={24} color="#a855f7" />, bgColor: '#faf5ff' },
    { label: 'Pending Reviews', value: '12', icon: <Clock size={24} color="#f97316" />, bgColor: '#fff7ed' },
  ];

  const classes = [
    { id: 'Y1A', subject: 'Mathematics', students: 42, assignments: 12 },
    { id: 'Y2B', subject: 'Physics', students: 40, assignments: 10 },
    { id: 'Y3A', subject: 'Mathematics', students: 35, assignments: 15 },
  ];

  const recentAssignments = [
    { id: 1, title: 'Calculus Problem Set 3', class: 'Y3A', due: 'May 15, 2026', submitted: 28, total: 35 },
    { id: 2, title: 'Quantum Mechanics Quiz', class: 'Y2B', due: 'May 18, 2026', submitted: 35, total: 40 },
    { id: 3, title: 'Linear Algebra Assignment', class: 'Y1A', due: 'May 20, 2026', submitted: 30, total: 42 },
  ];

  const handleClassClick = (cls) => {
    onSelectData('class', cls);
    onNavigate('class');
  };

  return (
    <div className="teacher-overview">
      <header className="overview-header">
        <h1>Teacher Dashboard</h1>
        <p>Manage your classes and assignments</p>
      </header>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card card-box">
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

      <section className="classes-section card-box">
        <h2 className="section-title">My Classes</h2>
        <div className="classes-grid">
          {classes.map(cls => (
            <div key={cls.id} className="teacher-class-card" onClick={() => handleClassClick(cls)}>
              <div className="class-card-header">
                <div>
                  <h3>{cls.id}</h3>
                  <p>{cls.subject}</p>
                </div>
                <BookOpen size={20} color="#1A264A" />
              </div>
              <div className="class-card-stats">
                <div className="class-stat-row">
                  <span>Students</span>
                  <strong>{cls.students}</strong>
                </div>
                <div className="class-stat-row">
                  <span>Assignments</span>
                  <strong>{cls.assignments}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="recent-assignments-section card-box">
        <h2 className="section-title">Recent Assignments</h2>
        <div className="assignments-list">
          {recentAssignments.map(assignment => (
            <div key={assignment.id} className="assignment-item">
              <div className="assignment-info">
                <h4>{assignment.title}</h4>
                <p>{assignment.class} • Due {assignment.due}</p>
              </div>
              <div className="assignment-progress">
                <strong>{assignment.submitted}/{assignment.total}</strong>
                <span>Submitted</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeacherOverview;
