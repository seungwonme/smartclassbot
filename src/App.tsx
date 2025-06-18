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
import BrandSettings from './pages/BrandSettings';

function App() {
  const { isLoggedIn, userRole } = useAuth();

  console.log('[App] 현재 인증 상태:', { isLoggedIn, userRole });

  // 인증 상태 안전성 검증
  const isValidAuthState = isLoggedIn && userRole && (userRole === 'brand' || userRole === 'admin');

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to={userRole === 'admin' ? "/admin" : "/brand"} />} />
        <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to={userRole === 'admin' ? "/admin" : "/brand"} />} />

        {/* Brand Routes */}
        <Route path="/brand" element={isValidAuthState && userRole === 'brand' ? <BrandDashboard /> : <Navigate to="/login" />} />
        <Route path="/brand/campaigns" element={isValidAuthState && userRole === 'brand' ? <BrandCampaigns /> : <Navigate to="/login" />} />
        <Route path="/brand/campaigns/create" element={isValidAuthState && userRole === 'brand' ? <CreateCampaign /> : <Navigate to="/login" />} />
        <Route path="/brand/campaigns/:id" element={isValidAuthState && userRole === 'brand' ? <CampaignDetail /> : <Navigate to="/login" />} />
        <Route path="/brand/products" element={isValidAuthState && userRole === 'brand' ? <BrandProducts /> : <Navigate to="/login" />} />
        <Route path="/brand/personas" element={isValidAuthState && userRole === 'brand' ? <BrandPersonaManagement /> : <Navigate to="/login" />} />
        <Route path="/brand/influencers" element={isValidAuthState && userRole === 'brand' ? <BrandInfluencers /> : <Navigate to="/login" />} />
        <Route path="/brand/analytics" element={isValidAuthState && userRole === 'brand' ? <BrandAnalytics /> : <Navigate to="/login" />} />
        <Route path="/brand/billing" element={isValidAuthState && userRole === 'brand' ? <BrandBilling /> : <Navigate to="/login" />} />
        <Route path="/brand/settings" element={isValidAuthState && userRole === 'brand' ? <BrandSettings /> : <Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route path="/admin" element={isValidAuthState && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/campaigns" element={isValidAuthState && userRole === 'admin' ? <AdminCampaigns /> : <Navigate to="/login" />} />
        <Route path="/admin/campaigns/:id" element={isValidAuthState && userRole === 'admin' ? <CampaignDetail /> : <Navigate to="/login" />} />
        <Route path="/admin/brands" element={isValidAuthState && userRole === 'admin' ? <AdminBrandManagement /> : <Navigate to="/login" />} />
        <Route path="/admin/influencers" element={isValidAuthState && userRole === 'admin' ? <AdminInfluencerManagement /> : <Navigate to="/login" />} />
        <Route path="/admin/analytics" element={isValidAuthState && userRole === 'admin' ? <AdminAnalytics /> : <Navigate to="/login" />} />
        <Route path="/admin/billing" element={isValidAuthState && userRole === 'admin' ? <AdminBilling /> : <Navigate to="/login" />} />
        <Route path="/admin/settings" element={isValidAuthState && userRole === 'admin' ? <AdminSettings /> : <Navigate to="/login" />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
