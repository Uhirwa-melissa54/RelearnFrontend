import React from 'react';
import { 
  BookOpen, 
  Bell, 
  Search, 
  User, 
  BookMarked,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Calendar,
  FileText
} from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  // Mock data for the dashboard
  const stats = [
    { label: 'Active Courses', value: '6', icon: <BookMarked size={20} />, color: 'blue' },
    { label: 'Pending Assignments', value: '3', icon: <Clock size={20} />, color: 'orange' },
    { label: 'Completed', value: '12', icon: <CheckCircle size={20} />, color: 'green' },
    { label: 'Overdue', value: '1', icon: <AlertCircle size={20} />, color: 'red' },
  ];

  const classes = [
    { id: 1, name: 'Advanced Mathematics', code: 'MATH401', teacher: 'Dr. Sarah Jenkins', progress: 75, color: '#3b82f6' },
    { id: 2, name: 'Physics Mechanics', code: 'PHY302', teacher: 'Prof. Alan Turing', progress: 60, color: '#10b981' },
    { id: 3, name: 'World History', code: 'HIS201', teacher: 'Mr. John Doe', progress: 90, color: '#f59e0b' },
    { id: 4, name: 'Computer Science', code: 'CS101', teacher: 'Mrs. Ada Lovelace', progress: 85, color: '#8b5cf6' },
  ];

  const upcomingAssignments = [
    { id: 1, title: 'Calculus Final Project', course: 'Advanced Mathematics', dueDate: 'Today, 11:59 PM', priority: 'high' },
    { id: 2, title: 'Newton Laws Essay', course: 'Physics Mechanics', dueDate: 'Tomorrow, 5:00 PM', priority: 'medium' },
    { id: 3, title: 'WWII Research Paper', course: 'World History', dueDate: 'Oct 25, 2026', priority: 'low' },
  ];

  const recentNotes = [
    { id: 1, title: 'Integration by Parts', course: 'Advanced Mathematics', date: 'Oct 15' },
    { id: 2, title: 'Kinematics Formulas', course: 'Physics Mechanics', date: 'Oct 14' },
    { id: 3, title: 'The Cold War Era', course: 'World History', date: 'Oct 12' },
  ];

  return (
    <div className="dashboard-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo-container-nav">
            <BookOpen size={28} className="logo-icon" color="#1A264A" />
            <span className="logo-text-nav">Relearn</span>
          </div>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search courses, notes, or assignments..." />
          </div>
        </div>
        <div className="nav-right">
          <button className="icon-btn">
            <Bell size={20} />
            <span className="badge">2</span>
          </button>
          <div className="user-profile">
            <div className="avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">Alex Johnson</span>
              <span className="user-role">Student</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <header className="page-header">
          <div>
            <h1 className="greeting">Welcome back, Alex! 👋</h1>
            <p className="date-text">Here is what's happening with your classes today.</p>
          </div>
        </header>

        {/* Stats Row */}
        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon-wrapper">{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </section>

        <div className="main-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* My Classes */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2>My Classes</h2>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="classes-grid">
                {classes.map(cls => (
                  <div key={cls.id} className="class-card">
                    <div className="class-card-header">
                      <div className="class-icon" style={{ backgroundColor: `${cls.color}20`, color: cls.color }}>
                        <BookOpen size={20} />
                      </div>
                      <button className="more-btn"><MoreVertical size={16} /></button>
                    </div>
                    <div className="class-card-body">
                      <span className="class-code">{cls.code}</span>
                      <h3 className="class-title">{cls.name}</h3>
                      <p className="class-teacher">{cls.teacher}</p>
                    </div>
                    <div className="class-card-footer">
                      <div className="progress-header">
                        <span>Progress</span>
                        <span>{cls.progress}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${cls.progress}%`, backgroundColor: cls.color }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Academic History (Simplified) */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Academic History</h2>
                <button className="view-all-btn">Full Transcript</button>
              </div>
              <div className="history-card">
                <div className="history-chart-placeholder">
                  <p>GPA Trend Graph Placeholder</p>
                  <div className="fake-chart">
                    <div className="bar" style={{height: '60%'}}><span>2024</span></div>
                    <div className="bar" style={{height: '75%'}}><span>2025</span></div>
                    <div className="bar" style={{height: '90%'}}><span>2026</span></div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Upcoming Assignments */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Upcoming Assignments</h2>
              </div>
              <div className="list-card">
                {upcomingAssignments.map(task => (
                  <div key={task.id} className="list-item">
                    <div className={`priority-indicator ${task.priority}`}></div>
                    <div className="list-item-content">
                      <h4 className="item-title">{task.title}</h4>
                      <p className="item-subtitle">{task.course}</p>
                    </div>
                    <div className="item-meta">
                      <Calendar size={14} />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                ))}
                <button className="full-width-btn">View All Assignments</button>
              </div>
            </section>

            {/* Recent Notes */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Recent Notes</h2>
              </div>
              <div className="list-card">
                {recentNotes.map(note => (
                  <div key={note.id} className="list-item note-item">
                    <div className="note-icon">
                      <FileText size={18} />
                    </div>
                    <div className="list-item-content">
                      <h4 className="item-title">{note.title}</h4>
                      <p className="item-subtitle">{note.course}</p>
                    </div>
                    <div className="item-meta">
                      <span>{note.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
