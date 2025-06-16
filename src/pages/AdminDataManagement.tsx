
import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import DataManagementPanel from '@/components/admin/DataManagementPanel';

const AdminDataManagement = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <DataManagementPanel />
      </div>
    </div>
  );
};

export default AdminDataManagement;
