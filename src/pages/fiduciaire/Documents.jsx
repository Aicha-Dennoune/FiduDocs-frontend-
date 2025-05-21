import React, { useState, useEffect } from 'react';
import FiduciaireLayout from '../../components/FiduciaireLayout';
import { FaDownload, FaFileAlt, FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const Documents = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    description: '',
    type: '',
    fichier: null
  });
  const [documentsPoses, setDocumentsPoses] = useState([]);
  const [documentsRecus, setDocumentsRecus] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [posesRes, recusRes, clientsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/documents/poses', { headers }),
        axios.get('http://localhost:5000/api/documents/recus', { headers }),
        axios.get('http://localhost:5000/api/documents/clients', { headers })
      ]);

      setDocumentsPoses(posesRes.data);
      setDocumentsRecus(recusRes.data);
      setClients(clientsRes.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('clientId', formData.clientId);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      if (formData.fichier) {
        formDataToSend.append('fichier', formData.fichier);
      }

      await axios.post('http://localhost:5000/api/documents', formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowModal(false);
      setFormData({ clientId: '', description: '', type: '', fichier: null });
      fetchData();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du document:', err);
      setError('Erreur lors de l\'ajout du document');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/documents/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData(); // Rafraîchir les données
      } catch (err) {
        console.error('Erreur lors de la suppression du document:', err);
        setError('Erreur lors de la suppression du document');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDownload = async (doc) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      console.log('Début du téléchargement du document:', doc.Id);
      
      const response = await axios({
        url: `http://localhost:5000/api/documents/download/${doc.Id}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        },
        responseType: 'blob'
      });

      // Créer un blob à partir de la réponse
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Créer une URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un lien temporaire
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fichier;
      
      // Ajouter le lien au document
      document.body.appendChild(link);
      
      // Simuler un clic sur le lien
      link.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      console.log('Téléchargement terminé avec succès');
    } catch (err) {
      console.error('Erreur détaillée lors du téléchargement:', err);
      if (err.response) {
        console.error('Réponse d\'erreur:', {
          status: err.response.status,
          data: err.response.data
        });
      }
      setError('Erreur lors du téléchargement du document. Veuillez réessayer.');
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      fichier: e.target.files[0]
    });
  };

  const typesDocuments = [
    'Déclarations fiscales',
    'Bulletins de paie générés',
    'Attestations diverses',
    'Relevés de compte client',
    'Rapports (bilans)'
  ];

  const TableauDocuments = ({ documents, titre, showAddButton, showDelete }) => (
    <div style={{ marginBottom: 32 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16 
      }}>
        <h3 style={{ color: '#004085', margin: 0 }}>{titre}</h3>
        {showAddButton && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'linear-gradient(90deg, #004085 60%, #1976d2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500
            }}
          >
            <FaPlus size={14} />
            Poser un document
          </button>
        )}
      </div>
      <div style={{ 
        background: '#fff', 
        borderRadius: 12, 
        boxShadow: '0 2px 8px rgba(0,64,133,0.07)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center' }}>Chargement...</div>
        ) : error ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>{error}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#EBF3FF' }}>
                <th style={thStyle}>Client</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.Id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={tdStyle}>{doc.ClientNom}</td>
                  <td style={tdStyle}>{doc.description}</td>
                  <td style={tdStyle}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8 
                    }}>
                      <FaFileAlt color="#004085" />
                      {doc.Type}
                    </div>
                  </td>
                  <td style={tdStyle}>{new Date(doc.date).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleDownload(doc)}
                        style={buttonStyle}
                        title="Télécharger"
                      >
                        <FaDownload />
                      </button>
                      {showDelete && (
                        <button
                          onClick={() => handleDelete(doc.Id)}
                          style={{ ...buttonStyle, color: '#dc3545' }}
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <FiduciaireLayout>
      <div style={{ padding: 32 }}>
        <TableauDocuments 
          documents={documentsPoses} 
          titre="Documents Posés"
          showAddButton={true}
          showDelete={true}
        />
        
        <TableauDocuments 
          documents={documentsRecus} 
          titre="Documents Reçus"
          showDelete={false}
        />

        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              width: '100%',
              maxWidth: 500,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}>
              <h3 style={{ color: '#004085', marginBottom: 20 }}>Poser un document</h3>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Client</label>
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map(client => (
                      <option key={client.Id} value={client.Id}>
                        {client.Nom} {client.Prenom}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={{...inputStyle, height: 100, resize: 'vertical'}}
                    required
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Type de document</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    {typesDocuments.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Fichier</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{
                      ...inputStyle,
                      padding: '8px 0'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #cfd8dc',
                      borderRadius: 8,
                      background: '#fff',
                      color: '#004085',
                      cursor: 'pointer'
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: 8,
                      background: 'linear-gradient(90deg, #004085 60%, #1976d2 100%)',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    Poser
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </FiduciaireLayout>
  );
};

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  color: '#004085',
  fontWeight: 600,
  fontSize: 14,
  borderBottom: '2px solid #cfd8dc'
};

const tdStyle = {
  padding: '12px 16px',
  color: '#004085',
  fontSize: 14
};

const labelStyle = {
  display: 'block',
  marginBottom: 8,
  color: '#004085',
  fontSize: 14,
  fontWeight: 500
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #cfd8dc',
  fontSize: 14,
  color: '#004085',
  background: '#fff'
};

const buttonStyle = {
  background: 'none',
  border: 'none',
  color: '#004085',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 8px',
  borderRadius: 4,
  transition: 'background-color 0.2s'
};

export default Documents;