import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Database, FileText, BarChart3 } from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/dashboard" },
  { id: "patients", label: "Patients", icon: Users, path: "/patients" },
  { id: "food-db", label: "Food Database", icon: Database, path: "/food-db" },
  { id: "diet-charts", label: "Diet Charts", icon: FileText, path: "/diet-charts" }
];

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = tabs.find(tab => location.pathname.startsWith(tab.path))?.id || "dashboard";

  return (
    <div className="min-h-screen bg-gradient-healing">
      {/* Navigation */}
      <nav className="bg-card border-b shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <div className="flex items-center space-x-1 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => navigate(tab.path)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
