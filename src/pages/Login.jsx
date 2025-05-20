import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import logo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur('');
    console.log('Tentative de connexion avec:', { email, motDePasse });

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password: motDePasse,
      });

      const { utilisateur, token } = response.data;

      // Stockage dans le localStorage
      localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
      localStorage.setItem('token', token);

      // Redirection en fonction du rôle
      if (utilisateur.role === 'Fiduciaire') {
        navigate('/dashboard-fiduciaire');
      } else if (utilisateur.role === 'Client') {
        navigate('/dashboard-client');
      } else {
        setErreur("Rôle utilisateur inconnu.");
      }

    } catch (error) {
      console.error('Erreur de connexion:', error);
      setErreur("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div style={{ backgroundColor: '#EBF3FF', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <Container fluid className="d-flex justify-content-between align-items-center px-4" style={{ paddingTop: '1px', paddingBottom: '5px' }}>
        <div style={{ maxWidth: '160px' }}>
          <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div>
          <Button
            variant="outline-dark"
            className="me-2"
            onClick={() => navigate('/choix-inscription')}
          >
            S'inscrire
          </Button>
        </div>
      </Container>

      {/* Form Card */}
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '450px'
        }}>
          <h2 className="text-center mb-4" style={{ color: '#004085', fontWeight: 'bold' }}>
            Connexion
          </h2>

          {erreur && <Alert variant="danger">{erreur}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-center mt-4">
              <Button variant="dark" type="submit" style={{ borderRadius: '8px', padding: '10px 24px', width: '40%' }}>
                Se connecter
              </Button>
            </div>
          </Form>
        </div>
      </Container>

      {/* Footer */}
      <footer style={{
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

export default Login;
