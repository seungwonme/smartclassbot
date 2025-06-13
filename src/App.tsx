
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
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/brands" element={<AdminBrandManagement />} />
          <Route path="/admin/brands/create" element={<AdminCreateBrand />} />
          <Route path="/admin/products/create" element={<AdminCreateProduct />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
