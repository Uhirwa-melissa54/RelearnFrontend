import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminOverview from '../components/admin/AdminOverview';
import AdminManageUsers from '../components/admin/AdminManageUsers';
import AdminAddUser from '../components/admin/AdminAddUser';
import AdminManageClasses from '../components/admin/AdminManageClasses';
import AdminAddClass from '../components/admin/AdminAddClass';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [selectedData, setSelectedData] = useState({
    user: null,
    class: null,
  });

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleSelectData = (type, data) => {
    setSelectedData(prev => ({ ...prev, [type]: data }));
  };

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <AdminOverview onNavigate={handleNavigate} />;
      case 'manage-users':
        return <AdminManageUsers onNavigate={handleNavigate} onSelectData={handleSelectData} />;
      case 'add-user':
        return <AdminAddUser onNavigate={handleNavigate} data={selectedData.user} />;
      case 'manage-classes':
        return <AdminManageClasses onNavigate={handleNavigate} onSelectData={handleSelectData} />;
      case 'add-class':
        return <AdminAddClass onNavigate={handleNavigate} data={selectedData.class} />;
      default:
        return <AdminOverview onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="dashboard-layout admin-dashboard-layout">
      <AdminSidebar currentView={currentView} onNavigate={handleNavigate} />
      <main className="dashboard-main">
        {renderView()}
      </main>
    </div>
  );
};

export default AdminDashboard;
