import React from 'react';
import { User, Calendar, Eye, Download, FileText } from 'lucide-react';
import './DocumentView.css';
import { studentApi, downloadNoteFile, authenticatedFetchBlob, normalizeStoredFilename } from '../../api';

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

  const downloadPath = doc?.fileUrl ? studentApi.downloadNote(doc.fileUrl) : null;
  const downloadName = normalizeStoredFilename(doc?.fileUrl);

  const handleDownload = () => {
    if (!doc?.fileUrl) return;
    downloadNoteFile(doc.fileUrl);
  };

  const handleViewOnline = async () => {
    if (!downloadPath) return;
    try {
      const blob = await authenticatedFetchBlob(downloadPath);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      alert('Failed to open file: ' + err.message);
    }
  };

  const handleDownloadDescription = () => {
    const blob = new Blob([doc?.description || 'No description available.'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(doc?.title || 'note').replace(/[^\w\-]+/g, '_')}-description.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [previewError, setPreviewError] = React.useState(null);
  const canInlinePreview = !!downloadName && /\.(pdf|txt)$/i.test(downloadName);

  React.useEffect(() => {
    let blobUrl = null;
    const loadPreview = async () => {
      if (!canInlinePreview || !downloadPath) {
        setPreviewUrl(null);
        setPreviewError(null);
        return;
      }
      try {
        const blob = await authenticatedFetchBlob(downloadPath);
        blobUrl = URL.createObjectURL(blob);
        setPreviewUrl(blobUrl);
        setPreviewError(null);
      } catch (err) {
        setPreviewUrl(null);
        setPreviewError(err.message || 'Failed to load preview.');
      }
    };
    loadPreview();
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [downloadPath, canInlinePreview]);

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
          <button className="btn-view-online" onClick={handleViewOnline} disabled={!doc.fileUrl}>
            <Eye size={18} /> View Online
          </button>
          <button className="btn-download" onClick={handleDownload} disabled={!doc.fileUrl}>
            <Download size={18} /> Download
          </button>
          <button className="btn-view-online" onClick={handleDownloadDescription} disabled={!doc.description}>
            <FileText size={18} /> Description
          </button>
        </div>
      </div>

      <div className="document-preview-card card-box">
        <h3>Document Preview</h3>
        {canInlinePreview ? (
          previewUrl ? (
            <iframe
              src={previewUrl}
              title="Note Preview"
              className="preview-placeholder"
              style={{ width: '100%', minHeight: '500px', border: 'none', borderRadius: '8px' }}
            />
          ) : (
            <div className="preview-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              {previewError || 'Loading preview...'}
            </div>
          )
        ) : (
          <div className="preview-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
            {doc?.fileUrl ? 'Preview not supported for this file type. Use Download.' : 'No file attached for preview.'}
          </div>
        )}
      </div>

      {/* Related notes removed: now database-driven only */}
    </div>
  );
};

export default DocumentView;
