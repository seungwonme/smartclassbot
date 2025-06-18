
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// 실제 존재하는 페이지들 import
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BrandDashboard from './pages/BrandDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BrandCampaigns from './pages/BrandCampaigns';
import AdminCampaigns from './pages/AdminCampaigns';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetail from './pages/CampaignDetail';
import BrandAnalytics from './pages/BrandAnalytics';
import AdminAnalytics from './pages/AdminAnalytics';
import BrandBilling from './pages/BrandBilling';
import AdminBilling from './pages/AdminBilling';
import BrandProducts from './pages/BrandProducts';
import BrandPersonaManagement from './pages/BrandPersonaManagement';
import BrandInfluencers from './pages/BrandInfluencers';
import AdminInfluencerManagement from './pages/AdminInfluencerManagement';
import AdminBrandManagement from './pages/AdminBrandManagement';
import AdminSettings from './pages/AdminSettings';
import NotFound from './pages/NotFound';

function App() {
  const { isLoggedIn, userRole } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to={userRole === 'admin' ? "/admin" : "/brand"} />} />
        <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to={userRole === 'admin' ? "/admin" : "/brand"} />} />

        {/* Brand Routes */}
        <Route path="/brand" element={isLoggedIn && userRole === 'brand' ? <BrandDashboard /> : <Navigate to="/login" />} />
        <Route path="/brand/campaigns" element={isLoggedIn && userRole === 'brand' ? <BrandCampaigns /> : <Navigate to="/login" />} />
        <Route path="/brand/campaigns/create" element={isLoggedIn && userRole === 'brand' ? <CreateCampaign /> : <Navigate to="/login" />} />
        <Route path="/brand/campaigns/:id" element={isLoggedIn && userRole === 'brand' ? <CampaignDetail /> : <Navigate to="/login" />} />
        <Route path="/brand/products" element={isLoggedIn && userRole === 'brand' ? <BrandProducts /> : <Navigate to="/login" />} />
        <Route path="/brand/personas" element={isLoggedIn && userRole === 'brand' ? <BrandPersonaManagement /> : <Navigate to="/login" />} />
        <Route path="/brand/influencers" element={isLoggedIn && userRole === 'brand' ? <BrandInfluencers /> : <Navigate to="/login" />} />
        <Route path="/brand/analytics" element={isLoggedIn && userRole === 'brand' ? <BrandAnalytics /> : <Navigate to="/login" />} />
        <Route path="/brand/billing" element={isLoggedIn && userRole === 'brand' ? <BrandBilling /> : <Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route path="/admin" element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/campaigns" element={isLoggedIn && userRole === 'admin' ? <AdminCampaigns /> : <Navigate to="/login" />} />
        <Route path="/admin/campaigns/:id" element={isLoggedIn && userRole === 'admin' ? <CampaignDetail /> : <Navigate to="/login" />} />
        <Route path="/admin/brands" element={isLoggedIn && userRole === 'admin' ? <AdminBrandManagement /> : <Navigate to="/login" />} />
        <Route path="/admin/influencers" element={isLoggedIn && userRole === 'admin' ? <AdminInfluencerManagement /> : <Navigate to="/login" />} />
        <Route path="/admin/analytics" element={isLoggedIn && userRole === 'admin' ? <AdminAnalytics /> : <Navigate to="/login" />} />
        <Route path="/admin/billing" element={isLoggedIn && userRole === 'admin' ? <AdminBilling /> : <Navigate to="/login" />} />
        <Route path="/admin/settings" element={isLoggedIn && userRole === 'admin' ? <AdminSettings /> : <Navigate to="/login" />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
