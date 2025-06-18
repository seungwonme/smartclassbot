import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BrandDashboard from './pages/BrandDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BrandSignup from './pages/BrandSignup';
import AdminSignup from './pages/AdminSignup';
import CampaignList from './pages/CampaignList';
import CampaignCreate from './pages/CampaignCreate';
import CampaignEdit from './pages/CampaignEdit';
import CampaignDetail from './pages/CampaignDetail';
import BrandList from './pages/BrandList';
import ProductList from './pages/ProductList';
import MarketReportList from './pages/MarketReportList';
import MarketReportDetail from './pages/MarketReportDetail';
import MarketReportCreate from './pages/MarketReportCreate';
import PersonaList from './pages/PersonaList';
import ContentPlanDetail from './pages/ContentPlanDetail';
import ContentSubmissionDetail from './pages/ContentSubmissionDetail';
import BrandBilling from './pages/BrandBilling';
import AdminBilling from './pages/AdminBilling';

function App() {
  const { isLoggedIn, userRole } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isLoggedIn ? <SignupPage /> : <Navigate to="/" />} />

        {/* Brand Routes */}
        <Route path="/brand/signup" element={!isLoggedIn ? <BrandSignup /> : <Navigate to="/" />} />
        <Route path="/brand" element={isLoggedIn && userRole === 'brand' ? <BrandDashboard /> : <Navigate to="/login" />} />
        <Route path="/brand/campaigns" element={isLoggedIn && userRole === 'brand' ? <CampaignList /> : <Navigate to="/login" />} />
        <Route path="/brand/campaigns/create" element={isLoggedIn && userRole === 'brand' ? <CampaignCreate /> : <Navigate to="/login" />} />
        <Route path="/brand/campaigns/edit/:id" element={isLoggedIn && userRole === 'brand' ? <CampaignEdit /> : <Navigate to="/login" />} />
        <Route path="/brand/campaigns/:id" element={isLoggedIn && userRole === 'brand' ? <CampaignDetail /> : <Navigate to="/login" />} />
        <Route path="/brand/market-reports" element={isLoggedIn && userRole === 'brand' ? <MarketReportList /> : <Navigate to="/login" />} />
        <Route path="/brand/market-reports/:id" element={isLoggedIn && userRole === 'brand' ? <MarketReportDetail /> : <Navigate to="/login" />} />
        <Route path="/brand/market-reports/create" element={isLoggedIn && userRole === 'brand' ? <MarketReportCreate /> : <Navigate to="/login" />} />
        <Route path="/brand/personas" element={isLoggedIn && userRole === 'brand' ? <PersonaList /> : <Navigate to="/login" />} />
        <Route path="/brand/content-plans/:id" element={isLoggedIn && userRole === 'brand' ? <ContentPlanDetail /> : <Navigate to="/login" />} />
        <Route path="/brand/content-submissions/:id" element={isLoggedIn && userRole === 'brand' ? <ContentSubmissionDetail /> : <Navigate to="/login" />} />
        <Route path="/brand/billing" element={isLoggedIn && userRole === 'brand' ? <BrandBilling /> : <Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={!isLoggedIn ? <AdminSignup /> : <Navigate to="/" />} />
        <Route path="/admin" element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/brands" element={isLoggedIn && userRole === 'admin' ? <BrandList /> : <Navigate to="/login" />} />
        <Route path="/admin/products" element={isLoggedIn && userRole === 'admin' ? <ProductList /> : <Navigate to="/login" />} />
        <Route path="/admin/campaigns/:id" element={isLoggedIn && userRole === 'admin' ? <CampaignDetail /> : <Navigate to="/login" />} />
        <Route path="/admin/billing" element={isLoggedIn && userRole === 'admin' ? <AdminBilling /> : <Navigate to="/login" />} />

        {/* Redirect to Dashboard if logged in, otherwise to Login */}
        <Route path="/" element={isLoggedIn ? (userRole === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/brand" />) : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
