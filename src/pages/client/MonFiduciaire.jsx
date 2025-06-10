import React from 'react';
import ClientLayout from '../../components/ClientLayout';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const MonFiduciaire = () => {
  const fiduciaireInfo = {
    nom: 'Bamir',
    prenom: 'Laila',
    email: 'Tarwijconsultant@gmail.com',
    telephone: '0604125038',
    role: 'Fiduciaire',
    adresse: '17 immeuble G avenue Mly Idriss plateau ville nouvelle, Safi'
  };

  return (
    <ClientLayout>
      <div style={{ padding: 16 }}>
        <h2 style={{ color: '#004085', marginBottom: 24 }}>Mon Fiduciaire</h2>
        
        <div style={{ 
          background: '#fff', 
          borderRadius: 12, 
          boxShadow: '0 2px 8px rgba(0,64,133,0.07)', 
          padding: 24,
          maxWidth: 600,
          margin: '0 auto'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: 24,
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: 8
          }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              background: '#004085',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20
            }}>
              <FaUser size={40} color="#fff" />
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                color: '#004085',
                fontSize: 24
              }}>
                {fiduciaireInfo.prenom} {fiduciaireInfo.nom}
              </h3>
              <p style={{ 
                margin: '4px 0 0 0', 
                color: '#666',
                fontSize: 16
              }}>
                {fiduciaireInfo.role}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            <InfoItem 
              icon={<FaEnvelope />} 
              label="E-mail" 
              value={fiduciaireInfo.email} 
            />
            <InfoItem 
              icon={<FaPhone />} 
              label="Téléphone" 
              value={fiduciaireInfo.telephone} 
            />
            <InfoItem 
              icon={<FaMapMarkerAlt />} 
              label="Adresse" 
              value={fiduciaireInfo.adresse} 
            />
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center',
    padding: '12px 16px',
    background: '#f8f9fa',
    borderRadius: 8
  }}>
    <div style={{ 
      width: 40, 
      height: 40, 
      borderRadius: '50%', 
      background: '#e3f2fd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16
    }}>
      {React.cloneElement(icon, { color: '#004085', size: 20 })}
    </div>
    <div>
      <div style={{ 
        color: '#666',
        fontSize: 14,
        marginBottom: 2
      }}>
        {label}
      </div>
      <div style={{ 
        color: '#004085',
        fontSize: 16,
        fontWeight: 500
      }}>
        {value}
      </div>
    </div>
  </div>
);

export default MonFiduciaire; 