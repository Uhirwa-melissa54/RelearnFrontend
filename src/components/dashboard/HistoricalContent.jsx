import React from 'react';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import './HistoricalContent.css';
import { studentApi, getUser, downloadNoteFile, downloadSubmissionFile } from '../../api';

const HistoricalContent = ({ type, onNavigate, onSelectData }) => {
  const isNotes = type === 'notes';
  const user = getUser();
  const className = user?.className || 'Y1A';
  const [selectedYear, setSelectedYear] = React.useState(user?.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
  const [groups, setGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (isNotes) {
          const noteGroups = await studentApi.getNotesByYear(className, selectedYear);
          setGroups((noteGroups || []).map(g => ({ subject: g.courseName, items: g.notes || [] })));
        } else {
          const assignmentGroups = await studentApi.getAssignmentsByYear(className, selectedYear);
          setGroups((assignmentGroups || []).map(g => ({ subject: g.courseName, items: g.assignments || [] })));
        }
      } catch (err) {
        console.error('Failed to load historical content:', err);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isNotes, className, selectedYear]);

  const yearOptions = React.useMemo(() => {
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

  const handleItemClick = (item) => {
    if (isNotes) {
      onSelectData('document', { ...item, subject: item.courseName });
      onNavigate('document');
    } else {
      onSelectData('assignment', { ...item, readOnly: true });
      onNavigate('assignment');
    }
  };

  const downloadText = (filename, text) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="historical-content">
      <header className="historical-header">
        <button className="back-btn" onClick={() => onNavigate('history')}>
          <ArrowLeft size={20} /> Back to History
        </button>
        <h1>Historical {isNotes ? 'Notes' : 'Assignments'}</h1>
        <p>Review and download materials from your past classes</p>
        <div style={{ marginTop: '12px' }}>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="subjects-container">
        {loading ? (
          <div className="card-box" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            Loading historical content...
          </div>
        ) : groups.length === 0 ? (
          <div className="card-box" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            No historical {isNotes ? 'notes' : 'assignments'} found for {selectedYear}.
          </div>
        ) : groups.map((group, idx) => (
          <div key={idx} className="subject-group card-box">
            <h2 className="subject-title">{group.subject}</h2>
            <div className="historical-items-list">
              {group.items.map(item => (
                <div key={item.id} className="historical-item" onClick={() => handleItemClick(item)}>
                  <div className="item-main">
                    <FileText size={20} color="#00234b" />
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.deadline ? new Date(item.deadline).toLocaleDateString() : '—')}</p>
                    </div>
                  </div>
                  <div className="item-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {!isNotes && (
                      <button
                        className="download-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadText(`${item.title || 'assignment'}-description.txt`, item.description || 'No description available.');
                        }}
                        title="Download description"
                      >
                        <FileText size={16} />
                      </button>
                    )}
                    <button className="download-btn" onClick={(e) => {
                      e.stopPropagation();
                      if (isNotes && item.fileUrl) {
                        downloadNoteFile(item.fileUrl);
                      } else if (!isNotes && item.fileUrl) {
                        downloadSubmissionFile(item.fileUrl);
                      } else if (!isNotes) {
                        downloadText(`${item.title || 'assignment'}-description.txt`, item.description || 'No description available.');
                      }
                    }}>
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalContent;
