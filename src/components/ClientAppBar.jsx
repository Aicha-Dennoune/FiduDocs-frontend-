import React from 'react';
import { FaBell } from 'react-icons/fa';
import { RxDragHandleHorizontal } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';

const AppBar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [unread, setUnread] = React.useState(0);
  const user = JSON.parse(localStorage.getItem('utilisateur'));
  const notifKey = user ? `notifLastCountClient_${user.id}` : 'notifLastCountClient';
  const [notifLastCount, setNotifLastCount] = React.useState(() => {
    return Number(localStorage.getItem(notifKey) || 0);
  });

  // Charger le nombre de messages non lus
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const fetchUnread = () => {
      fetch('http://localhost:5000/api/messages/unread/client', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUnread(data.unread || 0));
    };
    fetchUnread();
    // Rafraîchir toutes les 30s
    const interval = setInterval(fetchUnread, 30000);
    window.addEventListener('messagesRead', fetchUnread);
    return () => {
      clearInterval(interval);
      window.removeEventListener('messagesRead', fetchUnread);
    };
  }, []);

  // Correction automatique : si unread est 0, on force notifLastCount à 0
  React.useEffect(() => {
    if (unread === 0 && notifLastCount !== 0) {
      setNotifLastCount(0);
      localStorage.setItem(notifKey, '0');
    }
  }, [unread]);

  const handleLogout = () => {
    localStorage.removeItem('utilisateur');
    navigate('/login');
  };

  // Fermer le menu si on clique ailleurs
  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.appbar-menu')) setMenuOpen(false);
      if (!e.target.closest('.notif-popover') && !e.target.closest('.notif-bell')) setNotifOpen(false);
    };
    if (menuOpen || notifOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen, notifOpen]);

  const handleProfileNav = () => {
    setMenuOpen(false);
    navigate('/client/profil');
  };

  // Ouvrir la cloche : mettre à jour le compteur de notifications vues
  const handleNotifClick = () => {
    setNotifOpen((open) => !open);
    setNotifLastCount(unread);
    localStorage.setItem(notifKey, String(unread));
  };

  // Le point rouge s'affiche si unread > notifLastCount
  const hasNotif = unread > notifLastCount;

  return (
    <header style={{
      height: 64,
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 32px',
      position: 'relative'
    }}>
      <div style={{ position: 'relative', marginRight: 28 }}>
        <FaBell size={22} className="notif-bell" style={{ color: '#004085', cursor: 'pointer' }} onClick={handleNotifClick} />
        {hasNotif && (
          <span style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 10,
            height: 10,
            background: '#d32f2f',
            borderRadius: '50%',
            display: 'inline-block',
            zIndex: 2
          }} />
        )}
        {notifOpen && (
          <div className="notif-popover" style={{
            position: 'absolute',
            top: 34,
            right: -8,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            minWidth: 315,
            zIndex: 20,
            padding: '0 0 12px 0',
            color: '#004085',
            fontWeight: 500,
            fontSize: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid #e3e8f0'
          }}>
            {/* Flèche */}
            <div style={{
              position: 'absolute',
              top: -10,
              right: 18,
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '10px solid #fff',
              filter: 'drop-shadow(0 -2px 2px #e3e8f0)'
            }} />
            {/* Titre */}
            <div style={{
              width: '100%',
              padding: '16px 0 8px 0',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: 0.5,
              color: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}>
              <FaBell style={{ color: '#1976d2', fontSize: 20 }} />
              Notifications
            </div>
            <div style={{ width: '90%', height: 1, background: '#e3e8f0', margin: '0 auto 12px auto' }} />
            {/* Contenu notification */}
            {unread > 0 ? (
              <div style={{ textAlign: 'center', color: '#004085', fontSize: 15, padding: '8px 0' }}>
                Vous avez reçu un <b>nouveau message</b> de <b>Fiduciaire Laila Bamir</b>.
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#888', fontSize: 15, padding: '8px 0' }}>
                Aucune nouvelle notification.
              </div>
            )}
          </div>
        )}
      </div>
      <div className="appbar-menu" style={{ position: 'relative' }}>
        <RxDragHandleHorizontal
          size={28}
          style={{ color: '#004085', cursor: 'pointer' }}
          onClick={() => setMenuOpen((open) => !open)}
        />
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: 36,
            right: 0,
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
            minWidth: 150,
            zIndex: 10,
            padding: '8px 0'
          }}>
            <div
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                color: '#004085',
                fontWeight: 500,
                fontSize: 15
              }}
              onClick={handleProfileNav}
            >
              Profil
            </div>
            <div
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                color: '#d32f2f',
                fontWeight: 500,
                fontSize: 15
              }}
              onClick={handleLogout}
            >
              Déconnexion
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppBar; 