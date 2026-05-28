import React from 'react';
import { User, Calendar, Eye, Download } from 'lucide-react';
import './DocumentView.css';
import { studentApi } from '../../api';

const DocumentView = ({ data }) => {
  const doc = data || {
    title: 'Introduction to Calculus',
    author: 'Prof. Sarah Williams',
    date: 'May 1, 2026',
    subject: 'Mathematics',
    description: 'Comprehensive introduction to calculus covering basic concepts, limits, and fundamental theorems. This material will serve as the foundation for all future calculus topics.',
    format: 'PDF',
    size: '2.4 MB',
    pages: '24'
  };

  const handleDownload = () => {
    if (!doc?.fileUrl) return;
    window.open(studentApi.downloadNote(doc.fileUrl), '_blank');
  };

  return (
    <div className="document-view">
      <header className="document-header">
        <h1>{doc.title}</h1>
        <div className="document-meta">
          <span className="meta-item"><User size={16} /> {doc.author || `Teacher #${doc.teacherId || '-'}`}</span>
          <span className="meta-dot">•</span>
          <span className="meta-item"><Calendar size={16} /> {doc.date || (doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '—')}</span>
          <span className="meta-dot">•</span>
          <span className="meta-item">{doc.subject || doc.courseName || 'Course'}</span>
        </div>
      </header>

      <div className="document-card card-box">
        <div className="doc-section">
          <h3>Description</h3>
          <p className="doc-description">{doc.description}</p>
        </div>

        <div className="doc-details-grid">
          <div className="detail-col">
            <span className="detail-label">Format</span>
            <span className="detail-value">{doc.format}</span>
          </div>
          <div className="detail-col">
            <span className="detail-label">Size</span>
            <span className="detail-value">{doc.size}</span>
          </div>
          <div className="detail-col">
            <span className="detail-label">Pages</span>
            <span className="detail-value">{doc.pages}</span>
          </div>
        </div>

        <div className="doc-actions">
          <button className="btn-view-online" onClick={handleDownload} disabled={!doc.fileUrl}>
            <Eye size={18} /> View Online
          </button>
          <button className="btn-download" onClick={handleDownload} disabled={!doc.fileUrl}>
            <Download size={18} /> Download
          </button>
        </div>
      </div>

      <div className="document-preview-card card-box">
        <h3>Document Preview</h3>
        <div className="preview-placeholder">
          {/* A placeholder for the actual PDF/Document viewer */}
        </div>
      </div>

      <div className="related-notes-card card-box">
        <h3>Related Notes from {doc.subject}</h3>
        <div className="related-notes-list">
          <div className="related-note-item">
            <h4>Limits and Continuity</h4>
            <p>May 3, 2026</p>
          </div>
          <div className="related-note-item">
            <h4>Derivatives - Part 1</h4>
            <p>May 5, 2026</p>
          </div>
          <div className="related-note-item">
            <h4>Derivatives - Part 2</h4>
            <p>May 8, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentView;
