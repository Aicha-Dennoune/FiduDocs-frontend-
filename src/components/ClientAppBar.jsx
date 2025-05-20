import React from 'react';
import { FaBell } from 'react-icons/fa';
import { RxDragHandleHorizontal } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';

const AppBar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('utilisateur');
    navigate('/login');
  };

  // Fermer le menu si on clique ailleurs
  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.appbar-menu')) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleProfileNav = () => {
    setMenuOpen(false);
    navigate('/profil');
  };

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
      <FaBell size={22} style={{ color: '#004085', marginRight: 28, cursor: 'pointer' }} />
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