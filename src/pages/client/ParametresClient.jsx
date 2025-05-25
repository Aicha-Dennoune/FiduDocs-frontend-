// Page de paramètres pour le client : changement d'email et de mot de passe
import React, { useState } from 'react';
import ClientLayout from '../../components/ClientLayout';
import { useNavigate } from 'react-router-dom';

const ParametresClient = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [oldPasswordEmail, setOldPasswordEmail] = useState('');
  const [oldPasswordPwd, setOldPasswordPwd] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showDeactivateForm, setShowDeactivateForm] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const token = localStorage.getItem('token');

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await fetch('http://localhost:5000/api/user/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email, oldPassword: oldPasswordEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors du changement d\'email');
      setMessage('Email modifié avec succès');
      setEmail(''); setOldPasswordEmail('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: oldPasswordPwd, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors du changement de mot de passe');
      setMessage('Mot de passe modifié avec succès');
      setOldPasswordPwd(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeactivateAccount = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await fetch('http://localhost:5000/api/user/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: deactivatePassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la désactivation du compte');
      
      // Clear local storage and redirect to home page
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ClientLayout>
      <div style={{ maxWidth: 480, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e0e0', padding: 32 }}>
        <h2 style={{ color: '#004085', marginBottom: 24 }}>Paramètres du compte</h2>
        {message && <div style={{ background: '#e6f9e6', color: '#217a3b', padding: 10, borderRadius: 8, marginBottom: 16 }}>{message}</div>}
        {error && <div style={{ background: '#ffe6e6', color: '#b20000', padding: 10, borderRadius: 8, marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleEmailChange} style={{ marginBottom: 32 }}>
          <h4 style={{ marginBottom: 8 }}>Changer l'email</h4>
          <input type="email" placeholder="Nouvel email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Mot de passe actuel" value={oldPasswordEmail} onChange={e => setOldPasswordEmail(e.target.value)} required style={inputStyle} />
          <button type="submit" style={btnStyle}>Changer l'email</button>
        </form>
        <form onSubmit={handlePasswordChange}>
          <h4 style={{ marginBottom: 8 }}>Changer le mot de passe</h4>
          <input type="password" placeholder="Mot de passe actuel" value={oldPasswordPwd} onChange={e => setOldPasswordPwd(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Confirmer le nouveau mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={inputStyle} />
          <button type="submit" style={btnStyle}>Changer le mot de passe</button>
        </form>
        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 24 }}>
          <h4 style={{ color: '#dc3545', marginBottom: 16 }}>Zone dangereuse</h4>
          {!showDeactivateForm ? (
            <button 
              onClick={() => setShowDeactivateForm(true)} 
              style={{ ...btnStyle, background: '#dc3545' }}
            >
              Désactiver mon compte
            </button>
          ) : (
            <form onSubmit={handleDeactivateAccount}>
              <p style={{ color: '#666', marginBottom: 16 }}>
                Attention : Cette action est irréversible. Veuillez entrer votre mot de passe pour confirmer.
              </p>
              <input 
                type="password" 
                placeholder="Mot de passe" 
                value={deactivatePassword} 
                onChange={e => setDeactivatePassword(e.target.value)} 
                required 
                style={inputStyle} 
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" style={{ ...btnStyle, background: '#dc3545' }}>
                  Confirmer la désactivation
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowDeactivateForm(false)} 
                  style={{ ...btnStyle, background: '#6c757d' }}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

const inputStyle = { width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #cce0ff', fontSize: 15 };
const btnStyle = { background: '#004085', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 8 };

export default ParametresClient; 