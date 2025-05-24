import React, { useEffect, useState } from 'react';

const RendezVousClient = () => {
  const [rendezvous, setRendezvous] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: '', heure: '', type: '', description: '' });
  const [loading, setLoading] = useState(false);

  // Charger la liste des rendez-vous (à connecter à l'API)
  useEffect(() => {
    // TODO: Remplacer par un appel API
    setRendezvous([
      { Id: 1, Date: '2025-05-25', Heure: '14:30', Type: 'Consultation fiscale', Description: 'Demande urgente', Statut: 'Confirmé' },
      { Id: 2, Date: '2025-05-28', Heure: '10:00', Type: 'Bilan annuel', Description: 'Préparation bilan', Statut: 'En attente' },
    ]);
  }, []);

  const handleOpenModal = () => {
    setForm({ date: '', heure: '', type: '', description: '' });
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Appel API pour ajouter le rendez-vous
    // Après succès :
    setRendezvous(prev => [
      ...prev,
      {
        Id: prev.length + 1,
        Date: form.date,
        Heure: form.heure,
        Type: form.type,
        Description: form.description,
        Statut: 'En attente'
      }
    ]);
    setShowModal(false);
    setLoading(false);
  };

  const getStatutStyle = (statut) => {
    if (statut.toLowerCase() === 'confirmé') return { background: '#c8f7d8', color: '#217a3b', borderRadius: 8, padding: '2px 12px', fontWeight: 600 };
    if (statut.toLowerCase() === 'en attente') return { background: '#ffe6b3', color: '#b26a00', borderRadius: 8, padding: '2px 12px', fontWeight: 600 };
    if (statut.toLowerCase() === 'refusé') return { background: '#ffd6d6', color: '#b20000', borderRadius: 8, padding: '2px 12px', fontWeight: 600 };
    return {};
  };

  return (
    <div style={{ padding: '32px 0 0 0', width: '100%', minHeight: '100vh', background: 'transparent' }}>
      <h1 style={{ color: '#004085', fontSize: 32, fontWeight: 700, margin: '0 0 24px 32px', letterSpacing: 1 }}>Rendez-vous</h1>
      <div style={{ margin: '0 32px', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e0e0', padding: 0, border: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 24 }}>
          <button onClick={handleOpenModal} style={{ background: '#004085', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #e0e0e0' }}>
            + Prendre un rendez-vous
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 16 }}>
          <thead>
            <tr style={{ background: '#eaf2fb', color: '#004085', fontWeight: 700 }}>
              <th style={{ padding: '12px 16px', borderTopLeftRadius: 12 }}>Date</th>
              <th style={{ padding: '12px 16px' }}>Heure</th>
              <th style={{ padding: '12px 16px' }}>Type de rendez-vous</th>
              <th style={{ padding: '12px 16px' }}>Description</th>
              <th style={{ padding: '12px 16px' }}>Statut</th>
              <th style={{ padding: '12px 16px', borderTopRightRadius: 12 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rendezvous.map(rdv => (
              <tr key={rdv.Id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Date}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Heure}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Type}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Description}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={getStatutStyle(rdv.Statut)}>{rdv.Statut}</span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ cursor: 'pointer', marginRight: 12, color: '#004085' }}>✏️</span>
                  <span style={{ cursor: 'pointer', color: '#d32f2f' }}>🗑️</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de prise de rendez-vous */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #b3c6e0', padding: 32, minWidth: 340, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 style={{ color: '#004085', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Prendre un rendez-vous</h2>
            <label>Date
              <input type="date" name="date" value={form.date} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cce0ff', marginTop: 4 }} />
            </label>
            <label>Heure
              <input type="time" name="heure" value={form.heure} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cce0ff', marginTop: 4 }} />
            </label>
            <label>Type de rendez-vous
              <input type="text" name="type" value={form.type} onChange={handleChange} required placeholder="Ex: Bilan annuel" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cce0ff', marginTop: 4 }} />
            </label>
            <label>Description
              <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Décrivez votre demande..." style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cce0ff', marginTop: 4, minHeight: 60 }} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={handleCloseModal} style={{ background: '#e0e0e0', color: '#004085', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Annuler</button>
              <button type="submit" disabled={loading} style={{ background: '#004085', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>{loading ? 'Envoi...' : 'Valider'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RendezVousClient; 