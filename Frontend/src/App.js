import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import RoleSelection from './pages/RoleSelection';
import DonorDashboard from './pages/Dashboard/DonorDashboard';
import ReceiverDashboard from './pages/Dashboard/ReceiverDashboard';
import NewDonation from './pages/Donor/NewDonation';
import DonationHistory from './pages/Donor/DonationHistory';
import DonationStats from './pages/Donor/DonationStats';
import AvailableDonations from './pages/Receiver/AvailableDonations';
import AcceptedDonations from './pages/Receiver/AcceptedDonations';
import ImpactStats from './pages/Receiver/ImpactStats';
import ProtectedRoute from './components/ProtectedRoute';
import ActiveDonations from './pages/Donor/ActiveDonation';
import Statistics from './pages/Statistics';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/role-selection" />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/statistics" element={<Statistics />} />
        
        {/* Donor Routes */}
        <Route path="/donor" element={<ProtectedRoute role="donor" />}>
          <Route path="dashboard" element={<DonorDashboard />} />
          <Route path="new-donation" element={<NewDonation />} />
          <Route path="history" element={<DonationHistory />} />
          <Route path="stats" element={<DonationStats />} />
          <Route path="active" element={<ActiveDonations/>} />
        </Route>

        {/* Receiver Routes */}
        <Route path="/receiver" element={<ProtectedRoute role="receiver" />}>
          <Route path="dashboard" element={<ReceiverDashboard />} />
          <Route path="available" element={<AvailableDonations />} />
          <Route path="accepted" element={<AcceptedDonations />} />
          <Route path="stats" element={<ImpactStats />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
