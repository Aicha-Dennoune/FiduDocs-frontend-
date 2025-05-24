import React, { useEffect, useState } from 'react';
import FiduciaireLayout from '../../components/FiduciaireLayout';
import { FaTrash } from 'react-icons/fa';

const ListeClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Non authentifié');
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/api/clients', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des clients');
        return res.json();
      })
      .then(data => {
        setClients(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement des clients');
        setLoading(false);
      });
  }, []);

  // Filtrage par nom (insensible à la casse)
  const filteredClients = clients.filter(client =>
    client.Nom.toLowerCase().includes(search.toLowerCase())
  );

  // Suppression d'un client
  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce client ? Cette action est définitive.')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setClients(prev => prev.filter(c => c.Id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression du client');
    }
  };

  return (
    <FiduciaireLayout>
      <div style={{ padding: 32 }}>
        <h2 style={{ color: '#004085', marginBottom: 24 }}>Liste des clients</h2>
        <div style={{ marginBottom: 18 }}>
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #cfd8dc',
              fontSize: 15,
              width: 260,
              marginRight: 12
            }}
          />
        </div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,64,133,0.07)', padding: 24, minHeight: 200 }}>
          {loading ? (
            <p style={{ color: '#888' }}>Chargement...</p>
          ) : error ? (
            <p style={{ color: '#d32f2f' }}>{error}</p>
          ) : filteredClients.length === 0 ? (
            <p style={{ color: '#888' }}>Aucun client à afficher pour le moment.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr style={{ background: '#EBF3FF', color: '#004085' }}>
                    <th style={thStyle}>Nom</th>
                    <th style={thStyle}>Prénom</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Téléphone</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Adresse</th>
                    <th style={thStyle}>Nom entreprise</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(client => (
                    <tr key={client.Id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={tdStyle}>{client.Nom}</td>
                      <td style={tdStyle}>{client.Prenom}</td>
                      <td style={tdStyle}>{client.Email}</td>
                      <td style={tdStyle}>{client.Tele}</td>
                      <td style={tdStyle}>{client.TypeClient}</td>
                      <td style={tdStyle}>
                        {client.TypeClient === 'Particulier' ? client.AdresseParticulier : client.AdresseEntreprise}
                      </td>
                      <td style={tdStyle}>{client.TypeClient === 'Entreprise' ? client.NomEntreprise : '-'}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <FaTrash style={{ color: '#d32f2f', cursor: 'pointer' }} title="Supprimer" onClick={() => handleDelete(client.Id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </FiduciaireLayout>
  );
};

const thStyle = {
  padding: '10px 12px',
  fontWeight: 700,
  fontSize: 15,
  borderBottom: '2px solid #cfd8dc',
  textAlign: 'left',
};

const tdStyle = {
  padding: '8px 12px',
  fontSize: 15,
  color: '#004085',
  background: 'none',
};

export default ListeClients; 