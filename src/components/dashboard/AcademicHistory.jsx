import React, { useState } from 'react';
import { Calendar, BookOpen, FileText, Award, TrendingUp } from 'lucide-react';
import './AcademicHistory.css';

const AcademicHistory = ({ onNavigate }) => {
  const [selectedYear, setSelectedYear] = useState('2026-Y2A');

  const stats = [
    { label: 'Courses Completed', value: '3', icon: <BookOpen size={24} color="#3b82f6" />, bgColor: '#eff6ff', id: 'courses' },
    { label: 'Total Notes', value: '62', icon: <FileText size={24} color="#22c55e" />, bgColor: '#f0fdf4', id: 'notes', clickable: true },
    { label: 'Assignments Done', value: '45', icon: <TrendingUp size={24} color="#a855f7" />, bgColor: '#faf5ff', id: 'assignments', clickable: true },
    { label: 'Achievements', value: '2', icon: <Award size={24} color="#f97316" />, bgColor: '#fff7ed', id: 'achievements' },
  ];

  const handleStatClick = (id) => {
    if (id === 'notes') {
      onNavigate('all-notes');
    } else if (id === 'assignments') {
      onNavigate('all-assignments');
    }
  };

  return (
    <div className="academic-history">
      <header className="history-header">
        <h1>Academic History</h1>
        <p>Your complete academic journey across all years</p>
      </header>

      <div className="year-selector-card card-box">
        <div className="selector-wrapper">
          <Calendar size={20} color="#3b82f6" />
          <label htmlFor="year-select">Select Academic Year:</label>
          <select 
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2026-Y2A">2026 - Class Y2A</option>
            <option value="2025-Y1A">2025 - Class Y1A</option>
          </select>
        </div>
      </div>

      <div className="history-stats-grid">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            className={`history-stat-card card-box ${stat.clickable ? 'clickable' : ''}`}
            onClick={() => stat.clickable && handleStatClick(stat.id)}
          >
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

      <div className="achievements-section card-box">
        <div className="section-title">
          <Award size={20} color="#3b82f6" />
          <h3>Achievements</h3>
        </div>
        <div className="badges-container">
          <div className="badge primary">Dean's List</div>
          <div className="badge primary">Perfect Attendance</div>
        </div>
      </div>
    </div>
  );
};

export default AcademicHistory;
