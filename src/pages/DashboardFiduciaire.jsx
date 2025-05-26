import React from 'react';
import FiduciaireLayout from '../components/FiduciaireLayout';
import StatistiquesCirculaires from '../components/StatistiquesCirculaires';
import CalendrierRdv from '../components/CalendrierRdv';
import '../calendar-custom.css';

const DashboardFiduciaire = () => {
  // Récupérer l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem('utilisateur'));

  React.useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  return (
    <FiduciaireLayout>
      <main style={{ flex: 1, padding: '40px 48px', background: '#F5F7FA' }}>
        <h2 style={{ color: '#004085', fontWeight: 'bold', marginBottom: 32 }}>Tableau de bord</h2>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 32, marginBottom: 32 }}>
            <h4 style={{ color: '#004085', fontWeight: 'bold' }}>Statistiques</h4>
            <StatistiquesCirculaires postes={22} recus={17} />
          </div>
          <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 32, marginBottom: 32 }}>
            <h4 style={{ color: '#004085', fontWeight: 'bold' }}>Calendrier des rendez-vous</h4>
            <CalendrierRdv />
          </div>
        </div>
      </main>
    </FiduciaireLayout>
  );
};

export default DashboardFiduciaire; 