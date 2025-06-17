
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import BrandDashboard from "./pages/BrandDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BrandProducts from "./pages/BrandProducts";
import CreateBrand from "./pages/CreateBrand";
import BrandDetail from "./pages/BrandDetail";
import CreateProduct from "./pages/CreateProduct";
import ProductDetail from "./pages/ProductDetail";
import AdminBrandManagement from "./pages/AdminBrandManagement";
import AdminCreateBrand from "./pages/AdminCreateBrand";
import AdminCreateProduct from "./pages/AdminCreateProduct";
import AdminInfluencerManagement from "./pages/AdminInfluencerManagement";
import AdminInfluencerDetail from "./pages/AdminInfluencerDetail";
import AdminBrandDetail from "./pages/AdminBrandDetail";
import AdminProductDetail from "./pages/AdminProductDetail";
import BrandCampaigns from "./pages/BrandCampaigns";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignEdit from "./pages/CampaignEdit";
import CampaignDetail from "./pages/CampaignDetail";
import AdminCampaigns from "./pages/AdminCampaigns";
import AdminCampaignDetail from "./pages/AdminCampaignDetail";
import AdminContentPlanning from "./pages/AdminContentPlanning";
import BrandInfluencers from "./pages/BrandInfluencers";
import BrandAnalytics from "./pages/BrandAnalytics";
import AdminAnalytics from "./pages/AdminAnalytics";
import BrandPersonaManagement from "./pages/BrandPersonaManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/brand/dashboard" element={<BrandDashboard />} />
          <Route path="/brand/products" element={<BrandProducts />} />
          <Route path="/brand/products/create" element={<CreateBrand />} />
          <Route path="/brand/products/:id" element={<BrandDetail />} />
          <Route path="/brand/products/create-product" element={<CreateProduct />} />
          <Route path="/brand/products/product/:id" element={<ProductDetail />} />
          <Route path="/brand/campaigns" element={<BrandCampaigns />} />
          <Route path="/brand/campaigns/create" element={<CreateCampaign />} />
          <Route path="/brand/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/brand/campaigns/edit/:id" element={<CampaignEdit />} />
          <Route path="/brand/influencers" element={<BrandInfluencers />} />
          <Route path="/brand/analytics" element={<BrandAnalytics />} />
          <Route path="/brand/persona-management" element={<BrandPersonaManagement />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/brands" element={<AdminBrandManagement />} />
          <Route path="/admin/brands/create" element={<AdminCreateBrand />} />
          <Route path="/admin/brands/:id" element={<AdminBrandDetail />} />
          <Route path="/admin/brands/edit/:id" element={<AdminBrandDetail />} />
          <Route path="/admin/products/create" element={<AdminCreateProduct />} />
          <Route path="/admin/influencers" element={<AdminInfluencerManagement />} />
          <Route path="/admin/influencers/:id" element={<AdminInfluencerDetail />} />
          <Route path="/admin/products/:id" element={<AdminProductDetail />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductDetail />} />
          <Route path="/admin/campaigns" element={<AdminCampaigns />} />
          <Route path="/admin/campaigns/:id" element={<AdminCampaignDetail />} />
          <Route path="/admin/campaigns/:campaignId/content-planning" element={<AdminContentPlanning />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
