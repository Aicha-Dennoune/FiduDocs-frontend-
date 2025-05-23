import React, { useEffect, useState, useRef } from 'react';
import ClientLayout from '../../components/ClientLayout';
import axios from 'axios';

const MessagesClient = () => {
  const [fiduciaire, setFiduciaire] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('utilisateur'));
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Charger les messages avec le fiduciaire (id 2 en dur)
  useEffect(() => {
    setLoading(true);
    async function fetchMessages() {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/2`, { headers });
        setMessages(res.data);
        // Marquer comme lus après chargement
        await axios.post('http://localhost:5000/api/messages/read/client', {}, { headers });
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
  }, []);

  // Scroll auto en bas UNIQUEMENT après le premier chargement
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Envoi d'un message (destinataire id 2)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await axios.post(
        'http://localhost:5000/api/messages',
        {
          contenu: newMessage,
          destinataire: 2
        },
        { headers }
      );
      setNewMessage('');
      // Recharge la discussion
      const res = await axios.get(`http://localhost:5000/api/messages/2`, { headers });
      setMessages(res.data);
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err?.response?.data || err.message || err);
    }
  };

  // Log pour debug alignement messages
  console.log('messages', messages, 'user.id', user.id);

  return (
    <ClientLayout>
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
          justifyContent: 'center',
          height: '75vh',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 16px #e0e0e0',
          overflow: 'hidden',
          margin: '0 100px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 600, margin: '0 auto' }}>
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
              background: '#fff',
              textAlign: 'center'
            }}>
              {'Fiduciaire - Bamir Laila'}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
              {loading ? <div>Chargement...</div> :
                messages.length === 0 ? <div style={{ color: '#888' }}>Aucun message.</div> :
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
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default MessagesClient; 