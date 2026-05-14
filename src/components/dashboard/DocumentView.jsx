import React from 'react';
import { User, Calendar, Eye, Download } from 'lucide-react';
import './DocumentView.css';

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

  return (
    <div className="document-view">
      <header className="document-header">
        <h1>{doc.title}</h1>
        <div className="document-meta">
          <span className="meta-item"><User size={16} /> {doc.author}</span>
          <span className="meta-dot">•</span>
          <span className="meta-item"><Calendar size={16} /> {doc.date}</span>
          <span className="meta-dot">•</span>
          <span className="meta-item">{doc.subject}</span>
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
          <button className="btn-view-online">
            <Eye size={18} /> View Online
          </button>
          <button className="btn-download">
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
    </div>
  );
};

export default DocumentView;
