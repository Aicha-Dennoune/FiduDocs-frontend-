import React from 'react';
import Sidebar from './ClientSidebar';
import AppBar from './ClientAppBar';

const ClientLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F7FA' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
};

export default ClientLayout; 