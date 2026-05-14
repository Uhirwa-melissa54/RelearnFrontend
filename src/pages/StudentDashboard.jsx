import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import ClassView from '../components/dashboard/ClassView';
import AssignmentSubmit from '../components/dashboard/AssignmentSubmit';
import DocumentView from '../components/dashboard/DocumentView';
import AcademicHistory from '../components/dashboard/AcademicHistory';
import HistoricalContent from '../components/dashboard/HistoricalContent';
import StudentProfile from '../components/dashboard/StudentProfile';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [selectedData, setSelectedData] = useState({
    assignment: null,
    document: null,
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
        return <DashboardOverview onNavigate={handleNavigate} onSelectData={handleSelectData} />;
      case 'class':
        return <ClassView onNavigate={handleNavigate} onSelectData={handleSelectData} />;
      case 'assignment':
        return <AssignmentSubmit onNavigate={handleNavigate} data={selectedData.assignment} />;
      case 'document':
        return <DocumentView data={selectedData.document} />;
      case 'history':
        return <AcademicHistory onNavigate={handleNavigate} />;
      case 'all-notes':
        return <HistoricalContent type="notes" onNavigate={handleNavigate} onSelectData={handleSelectData} />;
      case 'all-assignments':
        return <HistoricalContent type="assignments" onNavigate={handleNavigate} onSelectData={handleSelectData} />;
      case 'profile':
        return <StudentProfile />;
      default:
        return <DashboardOverview onNavigate={handleNavigate} onSelectData={handleSelectData} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <main className="dashboard-main">
        {renderView()}
      </main>
    </div>
  );
};

export default StudentDashboard;
