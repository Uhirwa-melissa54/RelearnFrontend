import React from 'react';
import { Users, BookOpen, FileText, ChevronRight } from 'lucide-react';
import './AllClassesView.css';
import { teacherApi, getUser } from '../../api';

const TeacherAllClassesView = ({ onNavigate, onSelectData }) => {
  const [classes, setClasses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const user = getUser();

  React.useEffect(() => {
    const load = async () => {
      try {
        const profile = await teacherApi.getProfile();
        const teacherId = profile?.id || user?.id;
        if (!teacherId) {
          setClasses([]);
          return;
        }
        const dashboard = await teacherApi.getDashboard(teacherId);
        setClasses(dashboard?.classCards || []);
      } catch (err) {
        console.error('Failed to load teacher classes:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const handleClassClick = (classInfo) => {
    onSelectData('class', {
      id: classInfo.className,
      className: classInfo.className,
      subject: classInfo.courseName,
      courseName: classInfo.courseName,
      assignments: classInfo.totalAssignments || 0,
      notes: classInfo.totalNotes || 0,
      students: classInfo.studentCount || 0,
    });
    onNavigate('class');
  };

  if (loading) {
    return (
      <div className="all-classes-view">
        <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading classes...</div>
      </div>
    );
  }

  return (
    <div className="all-classes-view">
      <header className="classes-header">
        <h1>My Assigned Classes</h1>
        <p>Manage courses, notes, and assignments for your classes.</p>
      </header>

      <div className="classes-grid">
        {classes.length === 0 ? (
          <div className="card-box" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            No classes assigned yet.
          </div>
        ) : classes.map((cls, idx) => (
          <div key={`${cls.className}-${cls.courseName}-${idx}`} className="class-directory-card card-box" onClick={() => handleClassClick(cls)}>
            <div className="class-card-header">
              <div>
                <h2>{cls.className}</h2>
                <span className="class-full-name">{cls.courseName}</span>
              </div>
              <div className="class-subject-icon">
                <BookOpen size={20} color="#1A264A" />
              </div>
            </div>

            <div className="class-stats">
              <div className="class-stat">
                <Users size={15} color="#6b7280" />
                <span>{cls.studentCount || 0} Students</span>
              </div>
              <div className="class-stat">
                <FileText size={15} color="#6b7280" />
                <span>{cls.totalAssignments || 0} Assignments</span>
              </div>
              <div className="class-stat">
                <BookOpen size={15} color="#6b7280" />
                <span>{cls.totalPendingReviews || 0} Pending Reviews</span>
              </div>
            </div>

            <div className="class-card-footer">
              <span>Manage Class</span>
              <ChevronRight size={18} color="#1A264A" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherAllClassesView;
