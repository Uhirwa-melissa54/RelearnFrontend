import React from 'react';
import { UploadCloud, Plus, FileText, Calendar, Users } from 'lucide-react';
import './TeacherClassView.css';

const TeacherClassView = ({ onNavigate, data }) => {
  const cls = data || { id: 'Y1A', subject: 'Mathematics', students: 42 };

  const notes = [
    { id: 1, title: 'Introduction to Calculus', date: 'May 1, 2026', downloads: 42 },
    { id: 2, title: 'Limits and Continuity', date: 'May 3, 2026', downloads: 40 },
    { id: 3, title: 'Derivatives - Part 1', date: 'May 5, 2026', downloads: 38 },
  ];

  const assignments = [
    { id: 1, title: 'Calculus Problem Set 3', due: 'May 15, 2026', status: 'active', submitted: 28, total: 42 },
    { id: 2, title: 'Midterm Preparation', due: 'May 18, 2026', status: 'active', submitted: 35, total: 42 },
    { id: 3, title: 'Integration Assignment', due: 'May 10, 2026', status: 'completed', submitted: 42, total: 42 },
  ];

  return (
    <div className="teacher-class-view">
      <header className="class-header-row">
        <div className="class-header-text">
          <h1>Class {cls.id} - {cls.subject}</h1>
          <p>{cls.students} Students enrolled</p>
        </div>
        <div className="class-header-actions">
          <button className="btn-secondary">
            <UploadCloud size={18} /> Upload Notes
          </button>
          <button className="btn-primary" onClick={() => onNavigate('create-assignment')}>
            <Plus size={18} /> Create Assignment
          </button>
        </div>
      </header>

      <div className="class-stats-grid">
        <div className="stat-card-slim card-box">
          <div className="slim-stat-header">
            <FileText size={18} color="#3b82f6" />
            <span>Total Notes</span>
          </div>
          <span className="slim-stat-value">3</span>
        </div>
        <div className="stat-card-slim card-box">
          <div className="slim-stat-header">
            <Calendar size={18} color="#22c55e" />
            <span>Active Assignments</span>
          </div>
          <span className="slim-stat-value">2</span>
        </div>
        <div className="stat-card-slim card-box">
          <div className="slim-stat-header">
            <Users size={18} color="#a855f7" />
            <span>Students</span>
          </div>
          <span className="slim-stat-value">{cls.students}</span>
        </div>
      </div>

      <section className="class-content-section card-box">
        <h2 className="section-title">Class Notes</h2>
        <div className="content-list">
          {notes.map(note => (
            <div key={note.id} className="content-list-item">
              <div className="item-left">
                <FileText size={20} color="#1A264A" />
                <div>
                  <h4>{note.title}</h4>
                  <p>{note.date}</p>
                </div>
              </div>
              <div className="item-right">
                <span className="item-meta">{note.downloads} downloads</span>
                <button className="btn-edit">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="class-content-section card-box">
        <h2 className="section-title">Assignments</h2>
        <div className="content-list">
          {assignments.map(assignment => (
            <div key={assignment.id} className="content-list-item">
              <div className="item-left">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h4>{assignment.title}</h4>
                    <span className={`status-badge-small ${assignment.status}`}>{assignment.status}</span>
                  </div>
                  <p>Due: {assignment.due}</p>
                </div>
              </div>
              <div className="item-right-progress">
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

export default TeacherClassView;
