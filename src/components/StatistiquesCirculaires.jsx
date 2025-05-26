import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const StatistiquesCirculaires = () => {
  const [stats, setStats] = useState({ postes: 0, recus: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('utilisateur'));
    const token = localStorage.getItem('token');
    if (!user) return;
    setLoading(true);
    axios.get(`http://localhost:5000/api/user/statistiques/documents/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStats(res.data))
      .catch(() => setStats({ postes: 0, recus: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const data = {
    labels: ['Documents posés', 'Documents reçus'],
    datasets: [
      {
        data: [stats.postes, stats.recus],
        backgroundColor: ['#23B7D3', '#2B5C8A'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };
  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#2B5C8A',
          font: { size: 15, weight: 'bold' },
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.label}: ${ctx.parsed}`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  if (loading) return <div style={{textAlign:'center',padding:'40px'}}>Chargement…</div>;
  return (
    <div style={{ width: 260, height: 220, margin: '0 auto' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default StatistiquesCirculaires; 