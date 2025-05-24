import React, { useEffect, useState } from 'react';
import ClientLayout from '../../components/ClientLayout';

const RendezVousClient = () => {
  const [rendezvous, setRendezvous] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: '', heure: '', type: 'Local', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // Charger la liste des rendez-vous depuis l'API
  useEffect(() => {
    const fetchRdv = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/rendezvous', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Erreur lors de la récupération des rendez-vous');
        }
        
        if (Array.isArray(data)) {
          setRendezvous(data);
          setError(null);
        } else {
          setRendezvous([]);
          setError('Format de données invalide');
        }
      } catch (err) {
        setRendezvous([]);
        setError(err.message || 'Erreur lors de la récupération des rendez-vous');
      }
    };
    fetchRdv();
  }, [token]);

  const handleOpenModal = () => {
    setForm({ date: '', heure: '', type: 'Local', description: '' });
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce rendez-vous ?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/rendezvous/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error('Erreur lors de la suppression');
      }
      
      setRendezvous(prev => prev.filter(rdv => rdv.Id !== id));
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression du rendez-vous');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:5000/api/rendezvous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: form.date,
          heure: form.heure,
          type: form.type,
          description: form.description
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création du rendez-vous');
      }
      
      setRendezvous(prev => [
        ...prev,
        {
          Id: data.id,
          Date: form.date,
          Heure: form.heure,
          Type: form.type,
          Description: form.description,
          Statut: 'En attente'
        }
      ]);
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const getStatutStyle = (statut) => {
    if (statut.toLowerCase() === 'confirmé') return { background: '#c8f7d8', color: '#217a3b', borderRadius: 8, padding: '2px 12px', fontWeight: 600 };
    if (statut.toLowerCase() === 'en attente') return { background: '#ffe6b3', color: '#b26a00', borderRadius: 8, padding: '2px 12px', fontWeight: 600 };
    if (statut.toLowerCase() === 'refusé') return { background: '#ffd6d6', color: '#b20000', borderRadius: 8, padding: '2px 12px', fontWeight: 600 };
    return {};
  };

  return (
    <ClientLayout>
      <div style={{ padding: '32px 0 0 0', width: '100%', minHeight: '100vh', background: 'transparent' }}>
        <h1 style={{ color: '#004085', fontSize: 32, fontWeight: 700, margin: '0 0 24px 32px', letterSpacing: 1 }}>Rendez-vous</h1>
        
        {error && (
          <div style={{ 
            margin: '0 32px 16px', 
            padding: '12px 16px', 
            background: '#ffebee', 
            color: '#c62828', 
            borderRadius: 8,
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}
        
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
              {rendezvous.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                    Aucun rendez-vous pour le moment
                  </td>
                </tr>
              ) : (
                rendezvous.map(rdv => (
                  <tr key={rdv.Id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Date ? rdv.Date.slice(0, 10) : ''}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Heure ? rdv.Heure.slice(0, 5) : ''}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Type}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Description}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={getStatutStyle(rdv.Statut)}>{rdv.Statut}</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <svg onClick={() => handleDelete(rdv.Id)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#d32f2f" style={{ cursor: 'pointer' }} title="Supprimer"><path d="M3 6h18v2H3V6zm2 3h14v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9zm3 3v7h2v-7H8zm4 0v7h2v-7h-2z"/></svg>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de prise de rendez-vous */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 340, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h2 style={{ color: '#004085', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Prendre un rendez-vous</h2>
              <label>Date
                <input type="date" name="date" value={form.date} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cce0ff', marginTop: 4 }} />
              </label>
              <label>Heure
                <input type="time" name="heure" value={form.heure} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cce0ff', marginTop: 4 }} />
              </label>
              <label>Type de rendez-vous
                <select name="type" value={form.type} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cce0ff', marginTop: 4 }}>
                  <option value="Local">Local</option>
                  <option value="Par téléphone">Par téléphone</option>
                </select>
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
    </ClientLayout>
  );
};

export default RendezVousClient; 