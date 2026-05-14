import React from 'react';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import './HistoricalContent.css';

const HistoricalContent = ({ type, onNavigate, onSelectData }) => {
  const isNotes = type === 'notes';
  
  const data = [
    {
      subject: 'Mathematics',
      items: [
        { id: 1, title: isNotes ? 'Limits and Continuity' : 'Calculus Problem Set 1', date: 'May 3, 2026', size: '1.2 MB' },
        { id: 2, title: isNotes ? 'Derivatives - Part 1' : 'Midterm Exam', date: 'May 5, 2026', size: '2.4 MB' }
      ]
    },
    {
      subject: 'Physics',
      items: [
        { id: 3, title: isNotes ? 'Kinematics Overview' : 'Lab Report 1', date: 'May 2, 2026', size: '3.1 MB' }
      ]
    }
  ];

  const handleItemClick = (item) => {
    if (isNotes) {
      onSelectData('document', { ...item, subject: data.find(d => d.items.includes(item)).subject });
      onNavigate('document');
    } else {
      // Navigate to a read-only assignment view or handle download directly
      // Since it's historical, we can just download or show a read-only preview
      alert('Downloading historical assignment: ' + item.title);
    }
  };

  return (
    <div className="historical-content">
      <header className="historical-header">
        <button className="back-btn" onClick={() => onNavigate('history')}>
          <ArrowLeft size={20} /> Back to History
        </button>
        <h1>Historical {isNotes ? 'Notes' : 'Assignments'}</h1>
        <p>Review and download materials from your past classes</p>
      </header>

      <div className="subjects-container">
        {data.map((group, idx) => (
          <div key={idx} className="subject-group card-box">
            <h2 className="subject-title">{group.subject}</h2>
            <div className="historical-items-list">
              {group.items.map(item => (
                <div key={item.id} className="historical-item" onClick={() => handleItemClick(item)}>
                  <div className="item-main">
                    <FileText size={20} color="#3b82f6" />
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>{item.date} • {item.size}</p>
                    </div>
                  </div>
                  <button className="download-btn" onClick={(e) => {
                    e.stopPropagation();
                    alert(`Downloading ${item.title}`);
                  }}>
                    <Download size={18} />
                  </button>
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
