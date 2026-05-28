import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Users, BookOpen, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import './AdminManageClasses.css';
import { adminApi } from '../../api';

const CardDropdown = ({ onEdit, onDelete, onClose }) => {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  return (
    <div className="amc-dropdown" ref={ref}>
      <button className="amc-dropdown-item" onClick={onEdit}><Edit2 size={14} /> Edit</button>
      <button className="amc-dropdown-item danger" onClick={onDelete}><Trash2 size={14} /> Delete</button>
    </div>
  );
};

const AdminManageClasses = ({ onNavigate, onSelectData }) => {
  const [classes, setClasses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [yearFilter, setYearFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.getClasses();
        setClasses(data || []);
      } catch (err) {
        console.error('Failed to load classes:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Derive year from className (e.g. "Y1A" → year 1)
  const getYear = (className) => {
    const match = (className || '').match(/Y(\d)/);
    return match ? match[1] : '?';
  };

  const filtered = useMemo(() => {
    if (yearFilter === 'all') return classes;
    return classes.filter(c => getYear(c.className) === yearFilter);
  }, [classes, yearFilter]);

  const handleCreateClass = () => { onSelectData('class', null); onNavigate('add-class'); };

  const handleEdit = (cls) => {
    onSelectData('class', { ...cls, editMode: true });
    onNavigate('add-class');
    setOpenMenuId(null);
  };

  const handleDelete = (className) => {
    // Classes are derived from students — no hard delete endpoint
    // Just remove from local view
    setClasses(prev => prev.filter(c => c.className !== className));
    setOpenMenuId(null);
  };

  if (loading) return (
    <div className="admin-manage-classes">
      <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading classes...</div>
    </div>
  );

  return (
    <div className="admin-manage-classes">
      <div className="amc-header">
        <div className="amc-header-text">
          <h1>Class Management</h1>
          <p>View and manage academic classes</p>
        </div>
        <button className="btn-create-class" onClick={handleCreateClass}>
          <Plus size={18} /> Create Class
        </button>
      </div>

      <div className="amc-filter-bar card-box">
        <span className="amc-filter-label">Filter by Year:</span>
        <select className="amc-filter-select" value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}>
          <option value="all">All Years</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
        </select>
        {yearFilter !== 'all' && (
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Showing {filtered.length} class{filtered.length !== 1 ? 'es' : ''} in Year {yearFilter}
          </span>
        )}
      </div>

      <div className="amc-classes-grid">
        {filtered.length === 0 ? (
          <div className="amc-empty">
            <BookOpen size={40} color="#d1d5db" />
            <p>No classes found.</p>
          </div>
        ) : filtered.map(cls => (
          <div key={cls.className} className="amc-class-card">
            <div className="amc-card-top">
              <div>
                <div className="amc-card-id">{cls.className}</div>
                <div className="amc-card-year">Year {getYear(cls.className)}</div>
              </div>
              <div style={{ position: 'relative' }}>
                <button className="amc-card-menu-btn" onClick={() => setOpenMenuId(prev => prev === cls.className ? null : cls.className)}>
                  <MoreVertical size={18} />
                </button>
                {openMenuId === cls.className && (
                  <CardDropdown
                    onEdit={() => handleEdit(cls)}
                    onDelete={() => handleDelete(cls.className)}
                    onClose={() => setOpenMenuId(null)}
                  />
                )}
              </div>
            </div>

            <div className="amc-card-stats">
              <div className="amc-card-stat">
                <Users size={16} color="#6b7280" />
                <span>{cls.totalStudents || 0} Students</span>
              </div>
              <div className="amc-card-stat">
                <BookOpen size={16} color="#6b7280" />
                <span>{cls.totalNotes || 0} Notes</span>
              </div>
            </div>

            <div className="amc-card-actions">
              <button className="btn-view-details"
                onClick={() => { onSelectData('class', cls); onNavigate('add-class'); }}>
                View Details
              </button>
              <button className="btn-edit-class" onClick={() => handleEdit(cls)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminManageClasses;
