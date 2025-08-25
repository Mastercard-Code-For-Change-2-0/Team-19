import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DonorLogin from "./pages/DonorLogin";
import DonorRegister from "./pages/DonorRegister";
import ReceiverLogin from "./pages/ReceiverLogin";
import ReceiverRegister from "./pages/ReceiverRegister";
import AdminLogin from "./pages/AdminLogin";
import DashboardDonor from "./pages/DashboardDonor";
import DashboardReceiver from "./pages/DashboardReceiver";
import DashboardAdmin from "./pages/DashboardAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Donor Routes */}
              <Route path="/donor/login" element={<DonorLogin />} />
              <Route path="/donor/register" element={<DonorRegister />} />
              <Route path="/donor/dashboard" element={<DashboardDonor />} />
              
              {/* Receiver Routes */}
              <Route path="/receiver/login" element={<ReceiverLogin />} />
              <Route path="/receiver/register" element={<ReceiverRegister />} />
              <Route path="/receiver/dashboard" element={<DashboardReceiver />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<DashboardAdmin />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
