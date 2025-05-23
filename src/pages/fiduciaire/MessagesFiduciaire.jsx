import React, { useEffect, useState, useRef } from 'react';
import FiduciaireLayout from '../../components/FiduciaireLayout';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/messages';

const MessagesFiduciaire = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientsWithUnread, setClientsWithUnread] = useState(new Set());
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('utilisateur'));
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Charger la liste des clients du fiduciaire
  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await axios.get('http://localhost:5000/api/clients', { headers });
        console.log('Clients reçus:', res.data);
        setClients(res.data);
        // Vérifier les messages non lus pour chaque client
        const unreadClients = new Set();
        for (const client of res.data) {
          try {
            const unreadRes = await axios.get(`http://localhost:5000/api/messages/unread/client/${client.Id}`, { headers });
            if (unreadRes.data.unread > 0) {
              unreadClients.add(client.Id);
            }
          } catch (err) {
            console.error(`Erreur lors de la vérification des messages non lus pour le client ${client.Id}:`, err);
          }
        }
        setClientsWithUnread(unreadClients);
      } catch (err) {
        setClients([]);
      }
    }
    fetchClients();
    // eslint-disable-next-line
  }, []);

  // Charger les messages avec le client sélectionné
  useEffect(() => {
    if (!selectedClient) return;
    setLoading(true);
    async function fetchMessages() {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${selectedClient.Id}`, { headers });
        setMessages(res.data);
        // Marquer comme lus les messages de ce client
        await axios.post(`http://localhost:5000/api/messages/read/client/${selectedClient.Id}`, {}, { headers });
        // Mettre à jour l'état des messages non lus
        setClientsWithUnread(prev => {
          const next = new Set(prev);
          next.delete(selectedClient.Id);
          return next;
        });
        // Déclencher un event global pour rafraîchir la sidebar
        window.dispatchEvent(new Event('messagesRead'));
      } catch (err) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
    // eslint-disable-next-line
  }, [selectedClient]);

  // Scroll auto en bas UNIQUEMENT quand les messages changent ET un message a été ajouté (pas à l'ouverture de la page)
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Envoi d'un message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClient) return;
    try {
      await axios.post(
        'http://localhost:5000/api/messages',
        {
          contenu: newMessage,
          destinataire: selectedClient.Id
        },
        { headers }
      );
      setNewMessage('');
      // Recharge la discussion pour garantir la persistance et l'ordre
      const res = await axios.get(`http://localhost:5000/api/messages/${selectedClient.Id}`, { headers });
      setMessages(res.data);
    } catch (err) {
      // gestion d'erreur (optionnel)
    }
  };

  return (
    <FiduciaireLayout>
      <div style={{ padding: '32px 0 0 0', width: '100%', minHeight: '100vh', background: 'transparent' }}>
        <h1 style={{
          textAlign: 'left',
          color: '#004085',
          fontSize: 32,
          fontWeight: 700,
          margin: '0 0 24px 32px',
          letterSpacing: 1,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#F5F7FA'
        }}>Messages</h1>
        <div style={{
          display: 'flex',
          height: '75vh',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 16px #e0e0e0',
          overflow: 'hidden',
          margin: '0 32px',
          border: '1px solid #e0e0e0'
        }}>
          {/* Colonne clients */}
          <div style={{ width: 260, borderRight: '1px solid #e0e0e0', background: '#F5F7FA', padding: 0 }}>
            <div style={{ fontWeight: 'bold', fontSize: 22, padding: '18px 0 12px 24px', color: '#004085' }}>Clients</div>
            {clients.length === 0 ? (
              <div style={{ color: '#888', padding: 24 }}>Aucun client à afficher.</div>
            ) : (
              clients.map((client) => (
                <div
                  key={client.Id}
                  onClick={() => setSelectedClient(client)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 24px',
                    cursor: 'pointer',
                    background: selectedClient?.Id === client.Id ? '#e6f0ff' : 'transparent',
                    fontWeight: selectedClient?.Id === client.Id ? 'bold' : 'normal',
                    color: '#004085',
                    borderLeft: selectedClient?.Id === client.Id ? '4px solid #004085' : '4px solid transparent'
                  }}
                >
                  {client.PhotoProfil ? (
                    <img src={client.PhotoProfil} alt={client.Nom} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#cce0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18 }}>
                      {client.Prenom?.[0]}{client.Nom?.[0]}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <span>{client.Prenom} {client.Nom}</span>
                    {clientsWithUnread.has(client.Id) && (
                      <span style={{
                        width: 8,
                        height: 8,
                        background: '#d32f2f',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Zone de discussion */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              borderBottom: '1px solid #e0e0e0',
              padding: '18px 0 12px 32px',
              fontWeight: 'bold',
              fontSize: 22,
              color: '#004085',
              minHeight: 60,
              position: 'sticky',
              top: 0,
              zIndex: 5,
              background: '#fff'
            }}>
              {selectedClient ? `${selectedClient.Prenom} ${selectedClient.Nom}` : 'Sélectionnez un client'}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
              {loading ? <div>Chargement...</div> :
                selectedClient && messages.length === 0 ? <div style={{ color: '#888' }}>Aucun message.</div> :
                messages.map((msg, idx) => {
                  const expediteurId = msg.Expediteur ?? msg.expediteur;
                  const isMine = String(expediteurId) === String(user.id);
                  return (
                    <div key={msg.Id || idx} style={{
                      display: 'flex',
                      justifyContent: isMine ? 'flex-end' : 'flex-start',
                      marginBottom: 10
                    }}>
                      <div style={{
                        background: isMine ? '#1976d2' : '#e6e6e6',
                        color: isMine ? '#fff' : '#222',
                        borderRadius: 18,
                        padding: '12px 20px',
                        maxWidth: 350,
                        fontSize: 16,
                        boxShadow: isMine ? '0 2px 8px #b3d1f7' : '0 1px 4px #e0e0e0',
                        textAlign: isMine ? 'right' : 'left',
                        fontWeight: isMine ? 500 : 400
                      }}>
                        {msg.Contenu || msg.contenu}
                        <div style={{ fontSize: 12, color: isMine ? '#cce0ff' : '#888', marginTop: 4, textAlign: isMine ? 'right' : 'left' }}>{msg.heure || ''}</div>
                      </div>
                    </div>
                  );
                })
              }
              <div ref={messagesEndRef} />
            </div>
            {/* Champ d'écriture */}
            {selectedClient && (
              <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', padding: 18, borderTop: '1px solid #e0e0e0', background: '#fff' }}>
                <input
                  type="text"
                  placeholder="Écrire un message"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 17, padding: '12px 16px', borderRadius: 24, background: '#F5F7FA', marginRight: 12 }}
                />
                <button type="submit" style={{ background: '#004085', color: '#fff', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, cursor: 'pointer' }}>
                  ▶
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </FiduciaireLayout>
  );
};

export default MessagesFiduciaire; 