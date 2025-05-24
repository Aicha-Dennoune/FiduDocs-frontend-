import React, { useEffect, useState } from 'react';
import FiduciaireLayout from '../../components/FiduciaireLayout';
// import ProfilFiduciaire from './ProfilFiduciaire';

const RendezVousFiduciaire = () => {
  const [rendezvous, setRendezvous] = useState([]);
  const [clients, setClients] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRdv = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/rendezvous/fiduciaire', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur lors de la récupération des rendez-vous');
        setRendezvous(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setRendezvous([]);
        setError(err.message || 'Erreur lors de la récupération des rendez-vous');
      } finally {
        setLoading(false);
      }
    };
    const fetchClients = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/clients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(c => { map[c.Id] = c; });
          setClients(map);
        }
      } catch {}
    };
    fetchRdv();
    fetchClients();
  }, [token]);

  const handleStatut = async (id, statut) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/rendezvous/${id}/statut`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ statut })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la mise à jour du statut');
      setRendezvous(prev => prev.map(rdv => rdv.Id === id ? { ...rdv, Statut: statut } : rdv));
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setLoading(false);
    }
  };

  const getStatutStyle = (statut) => {
    if (!statut) return {};
    if (statut.toLowerCase() === 'confirmé') return { background: '#c8f7d8', color: '#217a3b', borderRadius: 8, padding: '2px 12px', fontWeight: 600, whiteSpace: 'nowrap' };
    if (statut.toLowerCase() === 'en attente') return { background: '#ffe6b3', color: '#b26a00', borderRadius: 8, padding: '2px 12px', fontWeight: 600, whiteSpace: 'nowrap' };
    if (statut.toLowerCase() === 'refusé') return { background: '#ffd6d6', color: '#b20000', borderRadius: 8, padding: '2px 12px', fontWeight: 600, whiteSpace: 'nowrap' };
    return {};
  };

  return (
    <FiduciaireLayout>
      <div style={{ padding: '32px 0 0 0', width: '100%', minHeight: '100vh', background: 'transparent' }}>
        <h1 style={{ color: '#004085', fontSize: 32, fontWeight: 700, margin: '0 0 24px 32px', letterSpacing: 1 }}>Rendez-vous</h1>
        {error && (
          <div style={{ margin: '0 32px 16px', padding: '12px 16px', background: '#ffebee', color: '#c62828', borderRadius: 8, border: '1px solid #ffcdd2' }}>{error}</div>
        )}
        <div style={{ margin: '0 32px', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e0e0', padding: 0, border: '1px solid #e0e0e0' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 16 }}>
            <thead>
              <tr style={{ background: '#eaf2fb', color: '#004085', fontWeight: 700 }}>
                <th style={{ padding: '12px 16px', borderTopLeftRadius: 12 }}>Client</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Heure</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Description</th>
                <th style={{ padding: '12px 16px' }}>Statut</th>
                <th style={{ padding: '12px 16px', borderTopRightRadius: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: '#666' }}>Chargement...</td></tr>
              ) : rendezvous.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: '#666' }}>Aucun rendez-vous</td></tr>
              ) : (
                rendezvous.map(rdv => (
                  <tr key={rdv.Id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{clients[rdv.ClientId] ? clients[rdv.ClientId].Nom + ' ' + clients[rdv.ClientId].Prenom : rdv.ClientId}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Date ? rdv.Date.slice(0, 10) : ''}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Heure ? rdv.Heure.slice(0, 5) : ''}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Type}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{rdv.Description}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}><span style={getStatutStyle(rdv.Statut)}>{rdv.Statut}</span></td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', display: 'flex', gap: 8, justifyContent: 'center' }}>
                      {rdv.Statut === 'En attente' || rdv.Statut === 'en attente' ? (
                        <>
                          <button onClick={() => handleStatut(rdv.Id, 'confirmé')} style={{ background: '#217a3b', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Accepter</button>
                          <button onClick={() => handleStatut(rdv.Id, 'refusé')} style={{ background: '#b20000', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Refuser</button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </FiduciaireLayout>
  );
};

export default RendezVousFiduciaire; 