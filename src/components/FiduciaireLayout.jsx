import React from 'react';
import Sidebar from './Sidebar';
import AppBar from './AppBar';

const FiduciaireLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F7FA', fontFamily: 'Arial, sans-serif' }}>
    <Sidebar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AppBar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  </div>
);

export default FiduciaireLayout; 