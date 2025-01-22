import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Profile from './pages/Profile';
import Main from './pages/Main';
import Legal from './pages/Legal';
import Privacy from './pages/Privacy';
import SignIn from './pages/SignIn';
import Documentation from './pages/Documentation';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import NotFound from './pages/NotFound';
import DataManagement from './pages/DataManagement';
import Settings from './pages/Settings';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Main />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="profile" element={<Profile />} />
            <Route path="legal" element={<Legal />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="docs" element={<Documentation />} />
            <Route path="data-management" element={<DataManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
