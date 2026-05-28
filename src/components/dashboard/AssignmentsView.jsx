import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, RefreshCw, Send, Eye } from 'lucide-react';
import './AssignmentsView.css';
import { studentApi, getUser } from '../../api';

const AssignmentsView = ({ onNavigate, onSelectData }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCourse, setFilterCourse] = useState('ALL');
  const user = getUser();
  const className = user?.className || 'Y1A';

  const load = async () => {
    setLoading(true);
    try {
      const data = await studentApi.getAssignmentsByClass(className);
      // data is grouped by course — flatten
      const flat = (data || []).flatMap(group =>
        (group.assignments || []).map(a => ({ ...a, courseName: a.courseName || group.courseName }))
      );
      setAssignments(flat);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [className]);

  const courses = [...new Set(assignments.map(a => a.courseName).filter(Boolean))];

  const filtered = useMemo(() =>
    assignments.filter(a => {
      const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'ALL' || a.assignmentStatus === filterStatus;
      const matchCourse = filterCourse === 'ALL' || a.courseName === filterCourse;
      return matchSearch && matchStatus && matchCourse;
    }), [assignments, searchTerm, filterStatus, filterCourse]);

  const handleActionClick = (assignment) => {
    onSelectData('assignment', assignment);
    onNavigate('assignment');
  };

  if (loading) return (
    <div className="assignments-view">
      <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading assignments...</div>
    </div>
  );

  return (
    <div className="assignments-view">
      <header className="assignments-header">
        <div className="header-title-group">
          <h1>My Assignments</h1>
          <p>{filtered.length} assignments found</p>
        </div>
        <button className="btn-refresh" onClick={load}>
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      <div className="filters-bar card-box">
        <div className="search-wrapper">
          <Search size={18} color="#9ca3af" />
          <input type="text" placeholder="Search by title, course..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Filter size={18} color="#9ca3af" />
        </div>
        <select className="filter-select" value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="OVERDUE">Overdue</option>
        </select>
        <select className="filter-select" value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}>
          <option value="ALL">All Courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="assignments-list">
        {filtered.length === 0 ? (
          <div className="card-box" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            No assignments found.
          </div>
        ) : filtered.map(assignment => (
          <div key={assignment.id} className="assignment-list-card card-box">
            <div className="card-top-row">
              <div className="card-title">
                <h3>{assignment.title}</h3>
              </div>
              <div className={`status-badge status-${(assignment.assignmentStatus || 'active').toLowerCase()}`}>
                {assignment.assignmentStatus || 'ACTIVE'}
              </div>
            </div>

            {assignment.description && (
              <p className="assignment-desc">{assignment.description}</p>
            )}

            <div className="card-meta-row">
              <span className="course-badge">{assignment.courseName}</span>
              {assignment.submissionType && (
                <span className="priority-badge">{assignment.submissionType}</span>
              )}
            </div>

            <div className="card-bottom-row">
              <span className="deadline-text">
                DEADLINE: {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : '—'}
              </span>
              <button className="btn-action" onClick={() => handleActionClick(assignment)}>
                {assignment.assignmentStatus === 'ACTIVE'
                  ? <><Send size={16} /> Submit</>
                  : <><Eye size={16} /> View Details</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsView;
