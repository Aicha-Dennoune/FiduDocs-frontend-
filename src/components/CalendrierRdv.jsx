import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../calendar-custom.css';

const statutCouleur = {
  accepte: 'rdv-vert',
  confirmé: 'rdv-vert',
  'en attente': 'rdv-jaune',
  refusé: 'rdv-rouge',
  refuse: 'rdv-rouge',
  en_attente: 'rdv-jaune',
};

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const CalendrierRdv = () => {
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('utilisateur'));
    const token = localStorage.getItem('token');
    if (!user) return;
    setLoading(true);
    axios.get(`http://localhost:5000/api/user/statistiques/rendezvous/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setRdvs(res.data.map(r => ({ ...r, dateString: r.date })));
      })
      .catch(() => setRdvs([]))
      .finally(() => setLoading(false));
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = formatDate(date);
      const rdv = rdvs.find(r => r.dateString === dateStr);
      return rdv ? statutCouleur[rdv.statut] : null;
    }
    return null;
  };

  // Liste des rendez-vous du jour sélectionné
  const rdvsDuJour = selectedDate
    ? rdvs.filter(r => r.dateString === formatDate(selectedDate))
    : [];

  if (loading) return <div style={{textAlign:'center',padding:'40px'}}>Chargement…</div>;

  return (
    <div style={{ width: 320, margin: '0 auto' }}>
      <Calendar
        tileClassName={tileClassName}
        locale="fr-FR"
        prev2Label={null}
        next2Label={null}
        onClickDay={setSelectedDate}
      />
      {selectedDate && rdvsDuJour.length > 0 && (
        <div style={{ marginTop: 16, background: '#fff', borderRadius: 8, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <strong>Rendez-vous du {formatDate(selectedDate)} :</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {rdvsDuJour.map((r, i) => (
              <li key={i} style={{ margin: '8px 0' }}>
                <span style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: r.statut === 'accepte' || r.statut === 'confirmé' ? '#16c784' : r.statut === 'refuse' || r.statut === 'refusé' ? '#e74c3c' : '#ffd600',
                  marginRight: 8
                }} />
                {r.clientPrenom && r.clientNom ? `${r.clientPrenom} ${r.clientNom} — ` : ''}
                {r.statut.charAt(0).toUpperCase() + r.statut.slice(1)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendrierRdv; 