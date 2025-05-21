import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './pages/Login';
import ChoixInscription from './pages/ChoixInscription';
import InscriptionEntreprise from './pages/InscriptionEntreprise';
import InscriptionParticulier from './pages/InscriptionParticulier';
import DashboardFiduciaire from './pages/DashboardFiduciaire';
import DashboardClient from './pages/DashboardClient';
import ProfilClient from './pages/client/ProfilClient';
import MonFiduciaire from './pages/client/MonFiduciaire';
import ClientDocuments from './pages/client/ClientDocuments';

// Pages Fiduciaire
import ProfilFiduciaire from './pages/fiduciaire/ProfilFiduciaire';
import ListeClients from './pages/fiduciaire/ListeClients';
import FiduciaireDocuments from './pages/fiduciaire/Documents';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/choix-inscription" element={<ChoixInscription />} />
        <Route path="/inscription-entreprise" element={<InscriptionEntreprise />} />
        <Route path="/inscription-particulier" element={<InscriptionParticulier />} />
        <Route path="/login" element={<Login />} />

        {/* Routes Fiduciaire */}
        <Route path="/dashboard-fiduciaire" element={<DashboardFiduciaire />} />
        <Route path="/fiduciaire/profil" element={<ProfilFiduciaire />} />
        <Route path="/fiduciaire/liste-clients" element={<ListeClients />} />
        <Route path="/fiduciaire/documents" element={<FiduciaireDocuments />} />

        {/* Routes Client */}
        <Route path="/dashboard-client" element={<DashboardClient />} />
        <Route path="/client/profil" element={<ProfilClient/>} />
        <Route path="/client/mon-fiduciaire" element={<MonFiduciaire />} />
        <Route path="/client/documents" element={<ClientDocuments />} />
      </Routes>
    </Router>
  );
}

export default App;
