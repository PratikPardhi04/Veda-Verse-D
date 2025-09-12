import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import PatientManagement from "@/components/PatientManagement";
import FoodDatabase from "@/components/FoodDatabase";
import { Button } from "@/components/ui/button";
import { Users, Database, FileText, BarChart3 } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, component: Dashboard },
    { id: "patients", label: "Patients", icon: Users, component: PatientManagement },
    { id: "food-db", label: "Food Database", icon: Database, component: FoodDatabase },
    { id: "diet-charts", label: "Diet Charts", icon: FileText, component: () => <div className="p-8 text-center text-muted-foreground">Diet Charts feature coming soon...</div> }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

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
                  onClick={() => setActiveTab(tab.id)}
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
        <ActiveComponent />
      </main>
    </div>
  );
};

export default Index;
