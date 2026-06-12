import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, BookOpen, FileText, Award, TrendingUp } from 'lucide-react';
import './AcademicHistory.css';
import { studentApi, getUser } from '../../api';

const AcademicHistory = ({ onNavigate }) => {
  const user = getUser();
  const [selectedYear, setSelectedYear] = useState(user?.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
  const [noteGroups, setNoteGroups]     = useState([]);
  const [assignmentGroups, setAssignmentGroups] = useState([]);
  const [loading, setLoading]           = useState(true);

  const className = user?.className || 'Y1A';
  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const opts = [];
    for (let y = current + 1; y >= current - 5; y -= 1) {
      opts.push(`${y - 1}-${y}`);
    }
    if (user?.academicYear && !opts.includes(user.academicYear)) {
      opts.unshift(user.academicYear);
    }
    return [...new Set(opts)];
  }, [user?.academicYear]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [notes, assignments] = await Promise.all([
          studentApi.getNotesByYear(className, selectedYear),
          studentApi.getAssignmentsByYear(className, selectedYear),
        ]);
        setNoteGroups(notes || []);
        setAssignmentGroups(assignments || []);
      } catch (err) {
        console.error('History load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedYear, className]);

  const totalNotes       = noteGroups.reduce((sum, g) => sum + (g.notes?.length || 0), 0);
  const totalAssignments = assignmentGroups.reduce((sum, g) => sum + (g.assignments?.length || 0), 0);

  const stats = [
    { label: 'Total Notes',       value: totalNotes,       icon: <FileText size={24} color="#22c55e" />,  bgColor: '#f0fdf4', id: 'notes',       clickable: true },
    { label: 'Assignments Done',  value: totalAssignments, icon: <TrendingUp size={24} color="#a855f7" />, bgColor: '#faf5ff', id: 'assignments', clickable: true },
    { label: 'Achievements',      value: 0,                icon: <Award size={24} color="#f97316" />,      bgColor: '#fff7ed', id: 'achievements', clickable: false },
  ];

  return (
    <div className="academic-history">
      <header className="history-header">
        <h1>Academic History</h1>
        <p>Your complete academic journey across all years</p>
      </header>

      <div className="year-selector-card card-box">
        <div className="selector-wrapper">
          <Calendar size={20} color="#00234b" />
          <label htmlFor="year-select">Select Academic Year:</label>
          <select id="year-select" value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading history...</div>
      ) : (
        <>
          <div className="history-stats-grid">
            {stats.map((stat) => (
              <div key={stat.id}
                className={`history-stat-card card-box ${stat.clickable ? 'clickable' : ''}`}
                onClick={() => stat.clickable && onNavigate(stat.id === 'notes' ? 'all-notes' : 'all-assignments')}>
                <div className="stat-icon-bg" style={{ backgroundColor: stat.bgColor }}>{stat.icon}</div>
                <div className="stat-text">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="achievements-section card-box">
            <div className="section-title">
              <Award size={20} color="#00234b" />
              <h3>Achievements</h3>
            </div>
            <div className="badges-container">
              <div className="badge primary">Active Learner</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AcademicHistory;
