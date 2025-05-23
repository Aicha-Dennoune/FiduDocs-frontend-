import React from 'react';
import { FaHome, FaFileAlt, FaUsers, FaCalendarAlt, FaEnvelope, FaCog } from 'react-icons/fa';
import logo2 from '../assets/logo2.png';
import { useNavigate } from 'react-router-dom';

const ClientSidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('utilisateur'));

  const handleSidebarNav = (route) => {
    navigate(route);
  };

  const handleProfileNav = () => {
    navigate('/client/profil');
  };

  return (
    <aside style={{
      width: 260,
      background: '#004085',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '32px 0 24px 0',
      color: '#EBF3FF',
      height: '100vh',
      boxSizing: 'border-box',
      minHeight: 0
    }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={logo2} alt="Logo" style={{ width: 120, height: 120, marginTop: -43, marginLeft: -86, objectFit: 'contain' }} />
          <span style={{ display: 'block', fontWeight: 'bold', fontSize: 17, color: '#EBF3FF', letterSpacing: 1, marginTop: -77, marginLeft: 35 }}>FiduDocs</span>
        </div>

        <div style={{ height: 1, backgroundColor: '#EBF3FF', margin: '12px 24px' }} />

        <nav>
          <SidebarItem icon={<FaHome />} label="Dashboard" active={window.location.pathname === '/dashboard-client'} onClick={() => handleSidebarNav('/dashboard-client')} />
          <SidebarItem icon={<FaFileAlt />} label="Documents" active={window.location.pathname === '/client/documents'} onClick={() => handleSidebarNav('/client/documents')} />
          <SidebarItem icon={<FaUsers />} label="Mon fiduciaire" active={window.location.pathname === '/client/mon-fiduciaire'} onClick={() => handleSidebarNav('/client/mon-fiduciaire')} />
          <SidebarItem icon={<FaCalendarAlt />} label="Rendez-vous" active={window.location.pathname === '/client/rendez-vous'} onClick={() => handleSidebarNav('/client/rendez-vous')} />
          <SidebarItem icon={<FaEnvelope />} label="Messages" active={window.location.pathname === '/client/messages'} onClick={() => handleSidebarNav('/client/messages')} />
          <SidebarItem icon={<FaCog />} label="Paramètres" active={window.location.pathname === '/client/parametres'} onClick={() => handleSidebarNav('/client/parametres')} />
        </nav>
      </div>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.54)',
          borderRadius: 16,
          margin: '0 24px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          cursor: 'pointer',
          color: '#004085',
          width: '96%',
          alignSelf: 'center'
        }}
        onClick={handleProfileNav}
      >
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#EBF3FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#004085',
          fontSize: 22,
          flexShrink: 0
        }}>
          {user?.prenom?.[0] || ''}{user?.nom?.[0] || ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontWeight: 'bold', fontSize: 15 }}>{user?.prenom} {user?.nom}</div>
          <div style={{ fontSize: 13 }}>{user?.email}</div>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: '9px 32px',
      margin: '0 18px',
      background: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
      color: '#EBF3FF',
      fontWeight: active ? 'bold' : 'normal',
      fontSize: 17,
      borderRadius: 10,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
    onMouseOver={e => {
      if (!active) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
    }}
    onMouseOut={e => {
      if (!active) e.currentTarget.style.background = 'transparent';
    }}
    onClick={onClick}
  >
    <div style={{
      width: 4,
      height: '100%',
      background: active ? '#fff' : 'transparent',
      borderRadius: 2,
      position: 'absolute',
      left: 0,
      top: 0
    }} />
    <span style={{
      marginRight: 16,
      fontSize: 22,
      color: '#EBF3FF'
    }}>{icon}</span>
    {label}
  </div>
);

export default ClientSidebar;
