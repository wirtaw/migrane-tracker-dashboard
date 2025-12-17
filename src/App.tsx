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
import ReportPage from './pages/ReportPage';
import DescriptionFeaturesPricing from './pages/DescriptionFeaturesPricing';
import { ProfileDataProvider } from './context/ProfileDataContext';
import CreateIncident from './pages/CreateIncident';
import DateInfo from './pages/DateInfo';
import MigraineManagementSuite from './pages/MigraineManagementSuite';
import IndicatorDetailsPage from './pages/IndicatorDetailsPage';
import HistoricalWeather from './pages/HistoricalWeather';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DescriptionFeaturesPricing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProfileDataProvider>
                  <Layout />
                </ProfileDataProvider>
              </ProtectedRoute>
            }
          >
            <Route index path="index" element={<Main />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="profile" element={<Profile />} />
            <Route path="legal" element={<Legal />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="docs" element={<Documentation />} />
            <Route path="data-management" element={<DataManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="report-page" element={<ReportPage />} />
            <Route path="create-incident" element={<CreateIncident />} />
            <Route path="date-info" element={<DateInfo />} />
            <Route path="migraine-management-suite" element={<MigraineManagementSuite />} />
            <Route path="indicator-details" element={<IndicatorDetailsPage />} />
            <Route path="historical-weather" element={<HistoricalWeather />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
