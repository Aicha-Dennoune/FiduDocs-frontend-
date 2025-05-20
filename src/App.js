import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './pages/Login';
import ChoixInscription from './pages/ChoixInscription';
import InscriptionEntreprise from './pages/InscriptionEntreprise';
import InscriptionParticulier from './pages/InscriptionParticulier';
import DashboardFiduciaire from './pages/DashboardFiduciaire';
import DashboardClient from './pages/DashboardClient';

import Profil from './pages/Profil';
import ListeClients from './pages/ListeClients';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/choix-inscription" element={<ChoixInscription />} />
        <Route path="/inscription-entreprise" element={<InscriptionEntreprise />} />
        <Route path="/inscription-particulier" element={<InscriptionParticulier />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard-fiduciaire" element={<DashboardFiduciaire />} />
        <Route path="/dashboard-client" element={<DashboardClient />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/liste-clients" element={<ListeClients />} />
      </Routes>
    </Router>
  );
}

export default App;
