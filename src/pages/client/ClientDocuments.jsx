import React, { useState, useEffect } from 'react';
import { FaDownload, FaFileAlt, FaPlus, FaTrash } from 'react-icons/fa';
import ClientLayout from '../../components/ClientLayout';
import axios from 'axios';

const ClientDocuments = () => {
  const [documentsPoses, setDocumentsPoses] = useState([]);
  const [documentsRecus, setDocumentsRecus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    type: '',
    fichier: null
  });

  const typesDocuments = [
    'Factures d\'achat et de vente',
    'Relevés bancaires',
    'Justificatifs de dépenses',
    'Bulletins de paie',
    'Contrats juridiques',
    'Pièces d\'identité'
  ];

  useEffect(() => {
    const fetchDocumentsRecus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/client-documents/recus', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDocumentsRecus(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des documents reçus:', error);
      }
    };

    fetchDocumentsRecus();
  }, []);

  const handleAddDocument = (e) => {
    e.preventDefault();
    // Ici, vous devrez implémenter l'appel API pour ajouter un document
    // Une fois que le backend sera prêt
    setShowModal(false);
  };

  const handleDownload = async (doc) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/client-documents/${doc.Id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.nomFichier);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const handleDelete = (document) => {
    // Ici, vous devrez implémenter l'appel API pour supprimer un document
    // Une fois que le backend sera prêt
  };

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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#EBF3FF' }}>
              <th style={thStyle}>Fiduciaire</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.Id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={tdStyle}>{doc.nomFiduciaire}</td>
                <td style={tdStyle}>{doc.description}</td>
                <td style={tdStyle}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8 
                  }}>
                    <FaFileAlt color="#004085" />
                    {doc.type}
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
                        onClick={() => handleDelete(doc)}
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
      </div>
    </div>
  );

  return (
    <ClientLayout>
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
              
              <form onSubmit={handleAddDocument}>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Fiduciaire</label>
                  <input
                    type="text"
                    value="Bamir Laila"
                    disabled
                    style={{...inputStyle, background: '#f5f5f5'}}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{...inputStyle, height: 100, resize: 'vertical'}}
                    required
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Type de document</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, fichier: e.target.files[0] })}
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
    </ClientLayout>
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

export default ClientDocuments; 