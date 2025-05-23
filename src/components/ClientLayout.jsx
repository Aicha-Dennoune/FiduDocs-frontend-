import React from 'react';
import Sidebar from './ClientSidebar';
import AppBar from './ClientAppBar';

const SIDEBAR_WIDTH = 260;
const APPBAR_HEIGHT = 64;

const ClientLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif', background: '#F5F7FA' }}>
    {/* Sidebar fixe */}
    <div style={{ position: 'fixed', top: 0, left: 0, width: SIDEBAR_WIDTH, height: '100vh', zIndex: 100 }}>
      <Sidebar />
    </div>
    {/* AppBar fixe */}
    <div style={{ position: 'fixed', top: 0, left: SIDEBAR_WIDTH, right: 0, height: APPBAR_HEIGHT, zIndex: 101 }}>
      <AppBar />
    </div>
    {/* Contenu principal scrollable */}
    <main style={{
      marginLeft: SIDEBAR_WIDTH,
      marginTop: APPBAR_HEIGHT,
      minHeight: `calc(100vh - ${APPBAR_HEIGHT}px)`,
      padding: 0,
      background: '#F5F7FA',
      overflow: 'auto',
      position: 'relative'
    }}>
      {children}
    </main>
  </div>
);

export default ClientLayout; 