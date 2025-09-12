import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import FoodDB from "./pages/FoodDB";
import DietCharts from "./pages/DietCharts";
import NotFound from "./pages/NotFound";
import DietPlan from "./pages/DietPlan";
import PatientProfile from "./pages/PatientProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="food-db" element={<FoodDB />} />
            <Route path="diet-charts" element={<DietCharts />} />
          </Route>
          <Route path="/diet-plan" element={<DietPlan />} />
          <Route path="/patient-profile" element={<PatientProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
