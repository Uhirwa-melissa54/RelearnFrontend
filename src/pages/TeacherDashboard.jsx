import React, { useState } from 'react';
import TeacherSidebar from '../components/dashboard/TeacherSidebar';
import TeacherOverview from '../components/dashboard/TeacherOverview';
import TeacherClassView from '../components/dashboard/TeacherClassView';
import CreateAssignmentView from '../components/dashboard/CreateAssignmentView';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [selectedData, setSelectedData] = useState({
    class: null,
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
      case 'class':
        return <TeacherClassView onNavigate={handleNavigate} data={selectedData.class} />;
      case 'create-assignment':
        return <CreateAssignmentView onNavigate={handleNavigate} />;
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
