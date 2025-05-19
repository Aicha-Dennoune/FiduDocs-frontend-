import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './pages/Login';
import ChoixInscription from './pages/ChoixInscription';
import InscriptionEntreprise from './pages/InscriptionEntreprise';
import InscriptionParticulier from './pages/InscriptionParticulier';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/choix-inscription" element={<ChoixInscription />} />
        <Route path="/inscription-entreprise" element={<InscriptionEntreprise />} />
        <Route path="/inscription-particulier" element={<InscriptionParticulier />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
