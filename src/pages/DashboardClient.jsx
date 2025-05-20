import React from 'react';
import ClientLayout from '../components/ClientLayout';

const DashboardClient = () => {
  return (
    <ClientLayout>
      <div style={{ padding: 32 }}>
        <h2 style={{ color: '#004085', marginBottom: 24 }}>Dashboard Client</h2>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,64,133,0.07)', padding: 24, minHeight: 200 }}>
          <p style={{ color: '#888' }}>Bienvenue sur votre espace client.</p>
        </div>
      </div>
    </ClientLayout>
  );
};

export default DashboardClient; 