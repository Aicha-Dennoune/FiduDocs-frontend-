import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import logo from '../assets/logo.png'; // Assure-toi que le chemin est correct
import { useNavigate, useLocation } from 'react-router-dom';

const InscriptionParticulier = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const typeclient = location.state?.typeclient || 'particulier'; // valeur par défaut

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Inscription particulier soumise !');
  };

  return (
    <div style={{ backgroundColor: '#EBF3FF', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <Container fluid className="d-flex justify-content-between align-items-center px-4" style={{ paddingTop: '1px', paddingBottom: '5px' }}>
        <div style={{ maxWidth: '160px' }}>
          <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div>
          <Button variant="outline-dark" className="me-2" onClick={() => navigate('/login')}>
            Se connecter
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
          maxWidth: '600px'
        }}>
          <h4 className="text-center mb-4" style={{ fontWeight: 'bold' }}>
            Formulaire d'inscription - Particulier
          </h4>

          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group controlId="nom">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control type="text" placeholder="Entrez votre nom" required />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group controlId="prenom">
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control type="text" placeholder="Entrez votre prénom" required />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group controlId="telephone">
                  <Form.Label>Numéro de téléphone</Form.Label>
                  <Form.Control type="tel" placeholder="06XXXXXXXX" required />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="votre@email.com" required />
                </Form.Group>
              </div>
              <div className="col-12 mb-3">
                <Form.Group controlId="adresse">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control type="text" placeholder="Votre adresse" required />
                </Form.Group>
              </div>
              <div className="col-12 mb-3">
                <Form.Group controlId="motDePasse">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control type="password" required />
                </Form.Group>
              </div>

              {/* Champ caché pour typeclient */}
              <Form.Control type="hidden" name="typeclient" value={typeclient} />
            </div>

            <div className="d-flex justify-content-center mt-4">
              <Button type="submit" variant="dark" style={{ borderRadius: '8px', padding: '10px 24px' }}>
                S’inscrire
              </Button>
            </div>
          </Form>
        </div>
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

export default InscriptionParticulier;
