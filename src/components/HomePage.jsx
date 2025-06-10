import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import image1 from '../assets/image1.png';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#EBF3FF',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      marginTop: '-20px'
    }}>
      {/* Header */}
      <Container fluid className="d-flex justify-content-between align-items-center px-4 py-1">
        <div style={{ maxWidth: '160px' }}>
          <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div>
          <Button
            variant="outline-dark"
            className="me-2"
            onClick={() => navigate('/login')}
          >
            Se connecter
          </Button>
          <Button
            variant="dark"
            onClick={() => navigate('/choix-inscription')}
          >
            S’inscrire
          </Button>
        </div>
      </Container>

      {/* Main content */}
      <Container style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '40px 30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '-20px'
      }}>
        <Row className="align-items-center">
          {/* Text content */}
          <Col md={6} className="px-5">
            <h1 style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: '#004085'
            }}>
              Plateforme Fiduciaire
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#333',
              marginTop: '5px'
            }}>
              Votre fiduciaire à portée de clic :<br />
              échangez, organisez, communiquez.<br />
              Une gestion simple, rapide et 100% sécurisée.
            </p>

            {/* Contact */}
            <div className="mt-0">
              <h5 style={{ fontWeight: 'bold', color: '#004085' }}>Contact</h5>
              <p style={{ lineHeight: '1.7' }}>
                📍 17 immeuble G avenue Mly Idriss plateau ville nouvelle ,Safi<br />
                📧 Tarwijconsultant@gmail.com<br />
                📞 +212 604125038
              </p>
            </div>
          </Col>

          {/* Image */}
          <Col md={6} className="text-center">
            <img
              src={image1}
              alt="Escalier"
              style={{
                width: '80%',
                maxWidth: '500px',
                marginTop: '-70px'
              }}
            />
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        padding: '15px 0',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        © 2025 FiduDocs. Tous droits réservés.
      </footer>
    </div>
  );
};

export default HomePage;
