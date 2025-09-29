import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Database, TrendingUp, Leaf, Heart, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ayurvedaHero from "@/assets/ayurveda-hero.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = [
    { title: "Active Patients", value: "26", icon: Users, trend: "+12%" },
    { title: "Diet Charts Created", value: "30", icon: FileText, trend: "+5%" },
    { title: "Food Database Items", value: "3,042", icon: Database, trend: "Updated" },
    { title: "Ayurvedic Compliance", value: "94%", icon: Leaf, trend: "+2%" },
  ];

  // Load recent patients from localStorage (same as PatientManagement)
  let recentPatients = [];
  try {
    const stored = localStorage.getItem('patients');
    if (stored) {
      recentPatients = JSON.parse(stored).slice(0, 3);
    }
  } catch {
    recentPatients = [];
  }

  const getConstitutionColor = (constitution: string) => {
    if (constitution.includes("Vata")) return "ayurvedic-vata";
    if (constitution.includes("Pitta")) return "ayurvedic-pitta";
    if (constitution.includes("Kapha")) return "ayurvedic-kapha";
    return "muted";
  };

  return (
    <div className="min-h-screen bg-gradient-healing">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-ayurvedic bg-clip-text text-transparent">
                    Veda Verse
                  </h1>
                  <p className="text-sm text-muted-foreground">Holistic Diet Management System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-success text-success">
                <Heart className="h-3 w-3 mr-1" />
                Ayurveda Certified
              </Badge>
              <Button variant="outline">Dr. Arvind Mehta</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Dr. Mehta</h2>
          <p className="text-muted-foreground">
            Transform patient care with AI-powered Ayurvedic nutrition analysis
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-soft hover:shadow-strong transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-success mr-1" />
                      <span className="text-sm text-success">{stat.trend}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-1 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                size="lg"
                onClick={() => navigate("/patients", { state: { showAddForm: true } })}
              >
                <Users className="h-4 w-4 mr-2" />
                New Patient Assessment
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="lg"
                onClick={() => navigate("/patients")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Diet Chart
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="lg"
                onClick={() => navigate("/food-db")}
              >
                <Database className="h-4 w-4 mr-2" />
                Food Database
              </Button>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card className="lg:col-span-2 shadow-soft">
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full bg-${getConstitutionColor(patient.constitution)}/20 flex items-center justify-center`}>
                        <span className="text-sm font-medium">{patient.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="secondary" 
                        className={`mb-1 bg-${getConstitutionColor(patient.constitution)}/20 text-${getConstitutionColor(patient.constitution)}`}
                      >
                        {patient.constitution}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{patient.lastVisit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features Highlight */}
        <Card className="mt-8 shadow-strong relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{backgroundImage: `url(${ayurvedaHero})`}}
          />
          <div className="absolute inset-0 bg-gradient-ayurvedic opacity-90" />
          <CardContent className="relative p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Revolutionary Ayurvedic + Modern Nutrition</h3>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Leaf className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold mb-2">Dosha Analysis</h4>
                  <p className="text-sm opacity-90">AI-powered constitution assessment</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold mb-2">3,042+ Food Items</h4>
                  <p className="text-sm opacity-90">Complete nutritional + Ayurvedic properties</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold mb-2">Smart Charts</h4>
                  <p className="text-sm opacity-90">Auto-generated Ayurvedic diet plans</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
