import React, { useEffect, useState } from 'react';
import ClientLayout from '../../components/ClientLayout';
import { FaUserEdit, FaSave } from 'react-icons/fa';

const ProfilClient = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchClientData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token non trouvé');
        return;
      }

      try {
        // Récupérer les informations du client directement depuis l'API clients
        const response = await fetch('http://localhost:5000/api/clients/me', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const clientData = await response.json();
        console.log('Données client reçues:', clientData);

        setUser(clientData);
        setForm(clientData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setError('Erreur lors du chargement du profil: ' + error.message);
        setUser(null);
      }
    };

    fetchClientData();
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
    if (!user?.Id) {
      setError('ID utilisateur non trouvé');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/clients/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Nom: form.Nom,
          Prenom: form.Prenom,
          Email: form.Email,
          Tele: form.Tele,
          TypeClient: form.TypeClient,
          ...(form.TypeClient === 'Entreprise' 
            ? {
                NomEntreprise: form.NomEntreprise,
                AdresseEntreprise: form.AdresseEntreprise
              }
            : {
                Adresse: form.Adresse
              }
          )
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      const updatedData = await response.json();
      setUser(updatedData);
      setForm(updatedData);
      setEditMode(false);
      setSuccess('Profil mis à jour avec succès');
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour du profil: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <ClientLayout>
        <div style={{ padding: 40, color: '#d32f2f' }}>
          {error || 'Chargement du profil...'}
        </div>
      </ClientLayout>
    );
  }

  // Avatar : image ou initiales
  const avatar = user.PhotoProfil
    ? <img src={user.PhotoProfil} alt="avatar" style={{
        width: 90, height: 90, borderRadius: '50%', objectFit: 'cover'
      }} />
    : <div style={{
        width: 90, height: 90, borderRadius: '50%', background: '#EBF3FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', color: '#004085', fontSize: 38
      }}>
        {user.Prenom?.[0] || ''}{user.Nom?.[0] || ''}
      </div>;

  return (
    <ClientLayout>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: 'calc(100vh - 64px)'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 24px rgba(0,64,133,0.08)',
          padding: '29px 30px',
          minWidth: 600,
          maxWidth: 800,
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 16,
            justifyContent: 'center'
          }}>
            {avatar}
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ color: '#004085', fontWeight: 'bold', marginBottom: 4 }}>
                {user.Nom} {user.Prenom}
              </h2>
              <div style={{ color: '#1976d2', fontSize: 15 }}>
                {user.TypeClient}
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
            <LabelValue label="Nom" name="Nom" value={editMode ? form.Nom : user.Nom} editMode={editMode} onChange={handleChange} />
            <LabelValue label="Prénom" name="Prenom" value={editMode ? form.Prenom : user.Prenom} editMode={editMode} onChange={handleChange} />
            <LabelValue label="E-mail" name="Email" value={editMode ? form.Email : user.Email} editMode={editMode} onChange={handleChange} />
            <LabelValue label="Téléphone" name="Tele" value={editMode ? form.Tele : user.Tele} editMode={editMode} onChange={handleChange} />
            <LabelValue label="Type de client" name="TypeClient" value={editMode ? form.TypeClient : user.TypeClient} editMode={editMode} onChange={handleChange} disabled />
            
            {/* Champs spécifiques selon le type de client */}
            {user.TypeClient === 'Entreprise' ? (
              <>
                <LabelValue label="Nom de l'entreprise" name="NomEntreprise" value={editMode ? form.NomEntreprise : user.NomEntreprise} editMode={editMode} onChange={handleChange} />
                <LabelValue label="Adresse de l'entreprise" name="AdresseEntreprise" value={editMode ? form.AdresseEntreprise : user.AdresseEntreprise} editMode={editMode} onChange={handleChange} />
              </>
            ) : (
              <LabelValue label="Adresse" name="Adresse" value={editMode ? form.Adresse : user.Adresse} editMode={editMode} onChange={handleChange} />
            )}
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
              margin: '10px auto 0',
              opacity: loading ? 0.7 : 1
            }}
            onClick={editMode ? handleSave : handleEdit}
            disabled={loading}
          >
            {editMode ? <FaSave /> : <FaUserEdit />} {editMode ? 'Enregistrer' : 'Modifier'}
          </button>
        </div>
      </div>
    </ClientLayout>
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
          padding: '4px 10px',
          fontSize: 14,
          color: '#004085',
          fontWeight: 500,
          height: 30,
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

export default ProfilClient; 