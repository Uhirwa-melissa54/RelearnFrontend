import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, UserPlus, Mail, MoreVertical, Edit2, Trash2, Users } from 'lucide-react';
import './AdminManageUsers.css';
import { adminApi } from '../../api';

const AVATAR_COLORS = ['#1A264A', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626', '#0284c7'];
const getColor    = (name) => AVATAR_COLORS[(name || '').charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name) => (name || '?').split(' ').map(n => n[0]).join('').toUpperCase();

const DropdownMenu = ({ onEdit, onDelete, onClose }) => {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  return (
    <div className="amu-dropdown" ref={ref}>
      <button className="amu-dropdown-item" onClick={onEdit}><Edit2 size={15} /> Edit</button>
      <button className="amu-dropdown-item danger" onClick={onDelete}><Trash2 size={15} /> Delete</button>
    </div>
  );
};

const AdminManageUsers = ({ onNavigate, onSelectData }) => {
  const [activeTab, setActiveTab]   = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents]     = useState([]);
  const [teachers, setTeachers]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Load users from backend
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sRes, tRes, allUsersRes] = await Promise.all([
          adminApi.getStudents({ size: 100 }),
          adminApi.getTeachers({ size: 100 }),
          adminApi.getUsers({ size: 200 }),
        ]);

        const normalizeUsers = (res) => {
          if (Array.isArray(res)) return res;
          if (Array.isArray(res?.content)) return res.content;
          if (Array.isArray(res?.data?.content)) return res.data.content;
          if (Array.isArray(res?.data)) return res.data;
          return [];
        };

        let studentList = normalizeUsers(sRes);
        let teacherList = normalizeUsers(tRes);

        // Fallback: derive lists from /admin/users response if role-specific endpoints return empty.
        const allUsers = normalizeUsers(allUsersRes);
        if (studentList.length === 0) {
          studentList = allUsers.filter(u => (u?.role || '').toUpperCase() === 'STUDENT');
        }
        if (teacherList.length === 0) {
          teacherList = allUsers.filter(u => (u?.role || '').toUpperCase() === 'TEACHER');
        }

        setStudents(studentList);
        setTeachers(teacherList);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredStudents = useMemo(() =>
    students.filter(s =>
      (s.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email    || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.className|| '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [students, searchTerm]);

  const filteredTeachers = useMemo(() =>
    teachers.filter(t =>
      (t.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.email    || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [teachers, searchTerm]);

  const handleAddUser = () => { onSelectData('user', null); onNavigate('add-user'); };

  const handleEdit = (user, type) => {
    onSelectData('user', { ...user, userType: type, editMode: true });
    onNavigate('add-user');
    setOpenMenuId(null);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await adminApi.deactivateUser(id);
      if (type === 'student') setStudents(prev => prev.filter(s => s.id !== id));
      else setTeachers(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to deactivate user: ' + err.message);
    }
    setOpenMenuId(null);
  };

  const toggleMenu = (id) => setOpenMenuId(prev => prev === id ? null : id);

  if (loading) return (
    <div className="admin-manage-users">
      <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading users...</div>
    </div>
  );

  return (
    <div className="admin-manage-users">
      <div className="amu-header">
        <div className="amu-header-text">
          <h1>User Management</h1>
          <p>Manage students and teachers</p>
        </div>
        <button className="btn-add-user" onClick={handleAddUser}>
          <UserPlus size={18} /> Add User
        </button>
      </div>

      <div className="amu-content-card">
        <div className="amu-tabs">
          <button className={`amu-tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => { setActiveTab('students'); setSearchTerm(''); }}>
            Students ({students.length})
          </button>
          <button className={`amu-tab ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('teachers'); setSearchTerm(''); }}>
            Teachers ({teachers.length})
          </button>
        </div>

        <div className="amu-search-wrap">
          <div className="amu-search-inner">
            <Search size={17} color="#9ca3af" />
            <input type="text" placeholder={`Search ${activeTab}...`}
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {activeTab === 'students' && (
          <div className="amu-user-list">
            {filteredStudents.length === 0 ? (
              <div className="amu-empty"><Users size={36} color="#d1d5db" /><p>No students found.</p></div>
            ) : filteredStudents.map(student => (
              <div key={student.id} className="amu-user-row">
                <div className="amu-avatar" style={{ backgroundColor: getColor(student.fullName) }}>
                  {getInitials(student.fullName)}
                </div>
                <div className="amu-user-info">
                  <div className="amu-user-name">{student.fullName}</div>
                  <div className="amu-user-meta">
                    <Mail size={13} /> {student.email}
                    <span className="amu-meta-dot">•</span>
                    Class: {student.className || '—'}
                  </div>
                </div>
                <span className={`amu-status ${student.active ? 'active' : 'inactive'}`}>
                  {student.active ? 'active' : 'inactive'}
                </span>
                <div style={{ position: 'relative' }}>
                  <button className="amu-actions-btn" onClick={() => toggleMenu(student.id)}>
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === student.id && (
                    <DropdownMenu
                      onEdit={() => handleEdit(student, 'student')}
                      onDelete={() => handleDelete(student.id, 'student')}
                      onClose={() => setOpenMenuId(null)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="amu-user-list">
            {filteredTeachers.length === 0 ? (
              <div className="amu-empty"><Users size={36} color="#d1d5db" /><p>No teachers found.</p></div>
            ) : filteredTeachers.map(teacher => (
              <div key={teacher.id} className="amu-user-row">
                <div className="amu-avatar" style={{ backgroundColor: getColor(teacher.fullName) }}>
                  {getInitials(teacher.fullName)}
                </div>
                <div className="amu-user-info">
                  <div className="amu-user-name">{teacher.fullName}</div>
                  <div className="amu-user-meta"><Mail size={13} /> {teacher.email}</div>
                </div>
                <span className={`amu-status ${teacher.active ? 'active' : 'inactive'}`}>
                  {teacher.active ? 'active' : 'inactive'}
                </span>
                <div style={{ position: 'relative' }}>
                  <button className="amu-actions-btn" onClick={() => toggleMenu(teacher.id)}>
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === teacher.id && (
                    <DropdownMenu
                      onEdit={() => handleEdit(teacher, 'teacher')}
                      onDelete={() => handleDelete(teacher.id, 'teacher')}
                      onClose={() => setOpenMenuId(null)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageUsers;
