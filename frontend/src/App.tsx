import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Login } from './components/login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import PatientsPage from './components/PatientsPage';
import AppointmentsPage from './components/AppointmentsPage';
import BillingPage from './components/BillingPage';
import AnalyticsPage from './components/AnalyticsPage';
import RecordsPage from './components/RecordsPage';
import { AIDisease } from './components/AIDisease';
import { EmergencyContact } from './components/EmergencyContact';
import SettingsPage from './components/SettingsPage';
import DoctorsPage from './components/DoctorsPage';

// Protected layout wrapper
function AuthenticatedLayout() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Scrollable Main Content */}
      <div className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLoginSuccess} />
            )
          }
        />

        {/* Authenticated Application Pages */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/ai-detection" element={<AIDisease />} />
          <Route path="/emergency" element={<EmergencyContact />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Standard redirection */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}