import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form } from 'react-bootstrap';
import logo from '../assets/logo.png'; // Assure-toi que le chemin est correct

const ChoixInscription = () => {
  const [type, setType] = useState('entreprise');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  if (type === 'entreprise') {
  navigate('/inscription-entreprise', { state: { typeclient: 'entreprise' } });
} else {
  navigate('/inscription-particulier', { state: { typeclient: 'particulier' } });
}

  };

  return (
    <div style={{ backgroundColor: '#EBF3FF', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
<Container fluid className="d-flex justify-content-between align-items-center px-4" style={{ paddingTop: '-27px', paddingBottom: '5px' }}>
        <div style={{ maxWidth: '160px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div>
          <Button
            variant="outline-dark"
            className="me-2"
            onClick={() => navigate('/login')}>
               Se connecter
            </Button>
        </div>
      </Container>

      {/* Main Card */}
<Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '65vh' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '480px'
        }}>
          <h4 className="text-center mb-4" style={{ fontWeight: 'bold' }}>
            Êtes-vous une entreprise ou un particulier ?
          </h4>

          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div
                className={`p-3 mb-3 border rounded ${type === 'entreprise' ? 'border-dark' : 'border-secondary'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setType('entreprise')}
              >
                <Form.Check
                  type="radio"
                  label="Je suis une entreprise"
                  name="type"
                  value="entreprise"
                  checked={type === 'entreprise'}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>

              <div
                className={`p-3 border rounded ${type === 'particulier' ? 'border-dark' : 'border-secondary'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setType('particulier')}
              >
                <Form.Check
                  type="radio"
                  label="Je suis un particulier"
                  name="type"
                  value="particulier"
                  checked={type === 'particulier'}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <Button type="submit" variant="dark" style={{ borderRadius: '8px', padding: '10px 24px' }}>
                S'inscrire
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

export default ChoixInscription;
