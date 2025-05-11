
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyServices from "./pages/MyServices";
import Booking from "./pages/Booking";
import MyClients from "./pages/MyClients";
import NotFound from "./pages/NotFound";

// Components
import NotAuthenticated from "./components/NotAuthenticated";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <NotAuthenticated>
                    <Dashboard />
                  </NotAuthenticated>
                } 
              />
              <Route 
                path="/meus-servicos" 
                element={
                  <NotAuthenticated>
                    <MyServices />
                  </NotAuthenticated>
                } 
              />
              <Route 
                path="/agendar" 
                element={
                  <NotAuthenticated>
                    <Booking />
                  </NotAuthenticated>
                } 
              />
              <Route 
                path="/meus-clientes" 
                element={
                  <NotAuthenticated>
                    <MyClients />
                  </NotAuthenticated>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
