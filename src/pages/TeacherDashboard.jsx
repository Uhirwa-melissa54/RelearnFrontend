import React, { useState } from 'react';
import TeacherSidebar from '../components/dashboard/TeacherSidebar';
import TeacherOverview from '../components/dashboard/TeacherOverview';
import TeacherClassView from '../components/dashboard/TeacherClassView';
import TeacherAllClassesView from '../components/dashboard/TeacherAllClassesView';
import TeacherAssignmentsView from '../components/dashboard/TeacherAssignmentsView';
import TeacherAssignmentDetailsView from '../components/dashboard/TeacherAssignmentDetailsView';
import TeacherSubmissionReviewView from '../components/dashboard/TeacherSubmissionReviewView';
import TeacherUploadNotesView from '../components/dashboard/TeacherUploadNotesView';
import TeacherProfile from '../components/dashboard/TeacherProfile';
import CreateAssignmentView from '../components/dashboard/CreateAssignmentView';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [selectedData, setSelectedData] = useState({
    class: null,
    assignment: null,
    submission: null,
    note: null,
  });

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleSelectData = (type, data) => {
    setSelectedData(prev => ({
      ...prev,
      [type]: data
    }));
  };

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <TeacherOverview onNavigate={handleNavigate} onSelectData={handleSelectData} />;
      case 'all-classes':
        return <TeacherAllClassesView onNavigate={handleNavigate} onSelectData={handleSelectData} />;
      case 'class':
        return <TeacherClassView onNavigate={handleNavigate} onSelectData={handleSelectData} data={selectedData.class} />;
      case 'assignments':
        return <TeacherAssignmentsView onNavigate={handleNavigate} onSelectData={handleSelectData} />;
      case 'assignment-details':
        return <TeacherAssignmentDetailsView onNavigate={handleNavigate} onSelectData={handleSelectData} data={selectedData.assignment} />;
      case 'review-submission':
        return <TeacherSubmissionReviewView onNavigate={handleNavigate} data={selectedData.submission} />;
      case 'upload-notes':
        return <TeacherUploadNotesView onNavigate={handleNavigate} data={selectedData.note} />;
      case 'create-assignment':
        return <CreateAssignmentView onNavigate={handleNavigate} data={selectedData.class} />;
      case 'profile':
        return <TeacherProfile onNavigate={handleNavigate} />;
      default:
        return <TeacherOverview onNavigate={handleNavigate} onSelectData={handleSelectData} />;
    }
  };

  return (
    <div className="dashboard-layout teacher-dashboard-layout">
      <TeacherSidebar currentView={currentView} onNavigate={handleNavigate} />
      <main className="dashboard-main">
        {renderView()}
      </main>
    </div>
  );
};

export default TeacherDashboard;
