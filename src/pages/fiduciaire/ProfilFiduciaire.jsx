import React, { useEffect, useState } from 'react';
import FiduciaireLayout from '../../components/FiduciaireLayout';
import { FaUserEdit, FaSave } from 'react-icons/fa';

const ProfilFiduciaire = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token non trouvé');
      return;
    }
    fetch('http://localhost:5000/api/user/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setUser(data);
        setForm(data);
      })
      .catch(error => {
        setUser(null);
      });
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess('');
    setError('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/user/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      const data = await res.json();
      setUser(data);
      setForm(data);
      setEditMode(false);
      setSuccess('Profil mis à jour avec succès.');
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <FiduciaireLayout><div style={{ padding: 40, color: '#d32f2f' }}>Chargement du profil...</div></FiduciaireLayout>;
  }

  // Avatar : image ou initiales
  const avatar = user.image
    ? <img src={user.image} alt="avatar" style={{
        width: 90, height: 90, borderRadius: '50%', objectFit: 'cover'
      }} />
    : <div style={{
        width: 90, height: 90, borderRadius: '50%', background: '#EBF3FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', color: '#004085', fontSize: 38
      }}>
        {user.prenom?.[0] || ''}{user.nom?.[0] || ''}
      </div>;

  return (
    <FiduciaireLayout>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: 'calc(100vh - 64px)'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 24px rgba(0,64,133,0.08)',
          padding: '32px 40px',
          minWidth: 600,
          maxWidth: 800,
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 32,
            justifyContent: 'center'
          }}>
            {avatar}
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ color: '#004085', fontWeight: 'bold', marginBottom: 4 }}>
                {user.nom} {user.prenom}
              </h2>
              <div style={{ color: '#1976d2', fontSize: 15 }}>
                {user.role}
              </div>
            </div>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '12px',
            margin: '0 auto',
            maxWidth: 600
          }}>
            <LabelValue label="Nom" name="nom" value={editMode ? form.nom : user.nom} editMode={editMode} onChange={handleChange} />
            <LabelValue label="Prénom" name="prenom" value={editMode ? form.prenom : user.prenom} editMode={editMode} onChange={handleChange} />
            <LabelValue label="E-mail" name="email" value={editMode ? form.email : user.email} editMode={editMode} onChange={handleChange} />
            <LabelValue label="Téléphone" name="tele" value={editMode ? form.tele : user.tele} editMode={editMode} onChange={handleChange} />
            <LabelValue label="Rôle" name="role" value={editMode ? form.role : user.role} editMode={editMode} onChange={handleChange} disabled />
            <LabelValue label="Adresse" name="adresse" value={editMode ? form.adresse : user.adresse} editMode={editMode} onChange={handleChange} />
          </div>
          {error && <div style={{ color: '#d32f2f', marginTop: 16 }}>{error}</div>}
          {success && <div style={{ color: '#388e3c', marginTop: 16 }}>{success}</div>}
          <button
            style={{
              marginTop: 32,
              background: 'linear-gradient(90deg, #004085 60%, #1976d2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 32px',
              fontWeight: 'bold',
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(0,64,133,0.10)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: '32px auto 0',
              opacity: loading ? 0.7 : 1
            }}
            onClick={editMode ? handleSave : handleEdit}
            disabled={loading}
          >
            {editMode ? <FaSave /> : <FaUserEdit />} {editMode ? 'Enregistrer' : 'Modifier'}
          </button>
        </div>
      </div>
    </FiduciaireLayout>
  );
};

const LabelValue = ({ label, name, value, editMode, onChange, disabled }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ 
      color: '#888', 
      fontSize: 13, 
      fontWeight: 600,
      marginBottom: 4,
      textAlign: 'left'
    }}>{label}</div>
    {editMode ? (
      <input
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        style={{
          background: '#F5F7FA',
          borderRadius: 7,
          padding: '6px 14px',
          fontSize: 15,
          color: '#004085',
          fontWeight: 500,
          height: 36,
          border: '1px solid #cfd8dc',
          width: '100%'
        }}
      />
    ) : (
      <div style={{
        background: '#F5F7FA',
        borderRadius: 7,
        padding: '6px 14px',
        fontSize: 15,
        color: '#004085',
        fontWeight: 500,
        height: 36,
        display: 'flex',
        alignItems: 'center'
      }}>{value || <span style={{ color: '#bbb' }}>Non renseigné</span>}</div>
    )}
  </div>
);

export default ProfilFiduciaire; 