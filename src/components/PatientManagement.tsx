import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, User, Calendar, Activity, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientManagement = () => {
  const navigate = useNavigate();
  // Gemini API key
  const GEMINI_API_KEY = "AIzaSyByN5LDr6NbjiyI6F5ab_5SxSvnuvm2VcU";

  // Function to call Gemini Flash 1.5 API
  function handleGenerateDietChart(patient: any) {
    navigate("/diet-plan", { state: { patient } });
  }
  const [showAddForm, setShowAddForm] = useState(false);
  // Open add form if navigation state requests it
  useEffect(() => {
    if (window.history.state && window.history.state.usr && window.history.state.usr.showAddForm) {
      setShowAddForm(true);
      // Clean up state so it doesn't persist on further navigation
      window.history.replaceState({ ...window.history.state, usr: { ...window.history.state.usr, showAddForm: false } }, "");
    }
  }, []);
  // Helper to pick a random value from an array
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const agniOptions = [
    'Manda Agni (Weak digestion)',
    'Tikshna Agni (Sharp/strong digestion)',
    'Vishama Agni (Irregular digestion)',
    'Sama Agni (Balanced digestion)'
  ];
  const nidraOptions = [
    'Alpa Nidra (Less sleep)',
    'Ati Nidra (Excess sleep)',
    'Swapna Yukta (Dream-disturbed sleep)',
    'Normal Sleep'
  ];
  const aharaRuchiOptions = [
    'Madhura (Sweet)',
    'Amla (Sour)',
    'Lavana (Salty)',
    'Katu (Pungent/Spicy)',
    'Tikta (Bitter)',
    'Kashaya (Astringent)'
  ];
  const pravrittiOptions = [
    'Malbandh (Constipation)',
    'Atisara (Loose stool)',
    'Normal'
  ];
  const notesOptions = [
    '',
    'Patient reports mild seasonal allergies.',
    'Prefers warm foods and herbal teas.',
    'History of irregular sleep patterns.',
    'Enjoys yoga and meditation.'
  ];

  // Load patients from localStorage if available, else use demo patients
  const getInitialPatients = () => {
    const stored = localStorage.getItem('patients');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback to demo patients if corrupted
      }
    }
    return [
      {
        id: 1,
        name: "Priya Sharma",
        age: 34,
        gender: "Female",
        constitution: "Vata-Pitta",
        bmi: 22.5,
        lastVisit: "2024-01-15",
        condition: "Digestive Issues",
        dietPreference: "Vegetarian",
        agni: pick(agniOptions),
        nidra: pick(nidraOptions),
        aharaRuchi: pick(aharaRuchiOptions),
        pravritti: pick(pravrittiOptions),
        notes: pick(notesOptions)
      },
      {
        id: 2,
        name: "Rajesh Kumar",
        age: 45,
        gender: "Male",
        constitution: "Kapha",
        bmi: 27.2,
        lastVisit: "2024-01-14",
        condition: "Weight Management",
        dietPreference: "Non-Vegetarian",
        agni: pick(agniOptions),
        nidra: pick(nidraOptions),
        aharaRuchi: pick(aharaRuchiOptions),
        pravritti: pick(pravrittiOptions),
        notes: pick(notesOptions)
      },
      {
        id: 3,
        name: "Anita Patel",
        age: 28,
        gender: "Female",
        constitution: "Pitta",
        bmi: 21.8,
        lastVisit: "2024-01-13",
        condition: "Skin Issues",
        dietPreference: "Vegan",
        agni: pick(agniOptions),
        nidra: pick(nidraOptions),
        aharaRuchi: pick(aharaRuchiOptions),
        pravritti: pick(pravrittiOptions),
        notes: pick(notesOptions)
      }
    ];
  };

  const [patients, setPatients] = useState(getInitialPatients);

  // Save patients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  // Form state for new patient
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    constitution: '',
    agni: '',
    nidra: '',
    aharaRuchi: '',
    pravritti: '',
    condition: '',
    dietPreference: '',
    notes: ''
  });

  // Handle form field changes
  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submit
  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate BMI if height and weight are provided
    let bmi = 0;
    const heightM = parseFloat(form.height) / 100;
    const weightKg = parseFloat(form.weight);
    if (heightM > 0 && weightKg > 0) {
      bmi = +(weightKg / (heightM * heightM)).toFixed(1);
    }
    const newPatient = {
      id: Date.now(),
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      constitution: getConstitutionLabel(form.constitution),
      bmi,
      lastVisit: new Date().toISOString().slice(0, 10),
      condition: form.condition,
      dietPreference: getDietLabel(form.dietPreference),
      agni: getAgniLabel(form.agni),
      nidra: getNidraLabel(form.nidra),
      aharaRuchi: getAharaRuchiLabel(form.aharaRuchi),
      pravritti: getPravrittiLabel(form.pravritti),
      notes: form.notes
    };
    setPatients((prev) => [newPatient, ...prev]);
    setForm({
      name: '', age: '', gender: '', height: '', weight: '', constitution: '', agni: '', nidra: '', aharaRuchi: '', pravritti: '', condition: '', dietPreference: '', notes: ''
    });
    setShowAddForm(false);
  };

  // Helper label functions for display
  const getConstitutionLabel = (val: string) => {
    switch (val) {
      case 'vata': return 'Vata';
      case 'pitta': return 'Pitta';
      case 'kapha': return 'Kapha';
      case 'vata-pitta': return 'Vata-Pitta';
      case 'vata-kapha': return 'Vata-Kapha';
      case 'pitta-kapha': return 'Pitta-Kapha';
      default: return '';
    }
  };
  const getDietLabel = (val: string) => {
    switch (val) {
      case 'vegetarian': return 'Vegetarian';
      case 'non-vegetarian': return 'Non-Vegetarian';
      case 'vegan': return 'Vegan';
      case 'jain': return 'Jain';
      default: return '';
    }
  };
  const getAgniLabel = (val: string) => {
    switch (val) {
      case 'manda': return 'Manda Agni (Weak digestion)';
      case 'tikshna': return 'Tikshna Agni (Sharp/strong digestion)';
      case 'vishama': return 'Vishama Agni (Irregular digestion)';
      case 'sama': return 'Sama Agni (Balanced digestion)';
      default: return '';
    }
  };
  const getNidraLabel = (val: string) => {
    switch (val) {
      case 'alpa': return 'Alpa Nidra (Less sleep)';
      case 'ati': return 'Ati Nidra (Excess sleep)';
      case 'swapna': return 'Swapna Yukta (Dream-disturbed sleep)';
      case 'normal': return 'Normal Sleep';
      default: return '';
    }
  };
  const getAharaRuchiLabel = (val: string) => {
    switch (val) {
      case 'madhura': return 'Madhura (Sweet)';
      case 'amla': return 'Amla (Sour)';
      case 'lavana': return 'Lavana (Salty)';
      case 'katu': return 'Katu (Pungent/Spicy)';
      case 'tikta': return 'Tikta (Bitter)';
      case 'kashaya': return 'Kashaya (Astringent)';
      default: return '';
    }
  };
  const getPravrittiLabel = (val: string) => {
    switch (val) {
      case 'malbandh': return 'Malbandh (Constipation)';
      case 'atisara': return 'Atisara (Loose stool)';
      case 'normal': return 'Normal';
      default: return '';
    }
  };


  const getConstitutionColor = (constitution: string) => {
    if (constitution.includes("Vata")) return "border-ayurvedic-vata text-ayurvedic-vata";
    if (constitution.includes("Pitta")) return "border-ayurvedic-pitta text-ayurvedic-pitta";
    if (constitution.includes("Kapha")) return "border-ayurvedic-kapha text-ayurvedic-kapha";
    return "border-muted text-muted-foreground";
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: "Underweight", color: "text-warning" };
    if (bmi < 25) return { status: "Normal", color: "text-success" };
    if (bmi < 30) return { status: "Overweight", color: "text-warning" };
    return { status: "Obese", color: "text-destructive" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Patient Management</h2>
          <p className="text-muted-foreground">Comprehensive Ayurvedic patient profiles</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="shadow-soft">
          <Plus className="h-4 w-4 mr-2" />
          {showAddForm ? "Cancel" : "New Patient"}
        </Button>
      </div>

      {/* Add Patient Form */}
      {showAddForm && (
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              New Patient Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleCreatePatient}>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Basic Information</h3>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter patient name" value={form.name} onChange={e => handleFormChange('name', e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" placeholder="Age" value={form.age} onChange={e => handleFormChange('age', e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={form.gender} onValueChange={val => handleFormChange('gender', val)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input id="height" type="number" placeholder="Height" value={form.height} onChange={e => handleFormChange('height', e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" placeholder="Weight" value={form.weight} onChange={e => handleFormChange('weight', e.target.value)} required />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Ayurvedic Assessment</h3>
                <div>
                  <Label htmlFor="constitution">Prakriti (Constitution)</Label>
                  <Select value={form.constitution} onValueChange={val => handleFormChange('constitution', val)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select constitution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vata">Vata</SelectItem>
                      <SelectItem value="pitta">Pitta</SelectItem>
                      <SelectItem value="kapha">Kapha</SelectItem>
                      <SelectItem value="vata-pitta">Vata-Pitta</SelectItem>
                      <SelectItem value="vata-kapha">Vata-Kapha</SelectItem>
                      <SelectItem value="pitta-kapha">Pitta-Kapha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="agni">Agni (Digestive Fire)</Label>
                  <Select value={form.agni} onValueChange={val => handleFormChange('agni', val)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Agni type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manda">Manda Agni (Weak digestion)</SelectItem>
                      <SelectItem value="tikshna">Tikshna Agni (Sharp/strong digestion)</SelectItem>
                      <SelectItem value="vishama">Vishama Agni (Irregular digestion)</SelectItem>
                      <SelectItem value="sama">Sama Agni (Balanced digestion)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nidra">Nidra (Sleep)</Label>
                  <Select value={form.nidra} onValueChange={val => handleFormChange('nidra', val)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sleep pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alpa">Alpa Nidra (Less sleep)</SelectItem>
                      <SelectItem value="ati">Ati Nidra (Excess sleep)</SelectItem>
                      <SelectItem value="swapna">Swapna Yukta (Dream-disturbed sleep)</SelectItem>
                      <SelectItem value="normal">Normal Sleep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ahara-ruchi">Ahara Ruchi (Taste Preference)</Label>
                  <Select value={form.aharaRuchi} onValueChange={val => handleFormChange('aharaRuchi', val)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select taste preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="madhura">Madhura (Sweet)</SelectItem>
                      <SelectItem value="amla">Amla (Sour)</SelectItem>
                      <SelectItem value="lavana">Lavana (Salty)</SelectItem>
                      <SelectItem value="katu">Katu (Pungent/Spicy)</SelectItem>
                      <SelectItem value="tikta">Tikta (Bitter)</SelectItem>
                      <SelectItem value="kashaya">Kashaya (Astringent)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pravritti">Pravritti (Bowel Habit)</Label>
                  <Select value={form.pravritti} onValueChange={val => handleFormChange('pravritti', val)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bowel habit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="malbandh">Malbandh (Constipation)</SelectItem>
                      <SelectItem value="atisara">Atisara (Loose stool)</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition">Primary Condition</Label>
                  <Input id="condition" placeholder="e.g., Digestive issues, Weight management" value={form.condition} onChange={e => handleFormChange('condition', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="diet-preference">Diet Preference</Label>
                  <Select value={form.dietPreference} onValueChange={val => handleFormChange('dietPreference', val)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="jain">Jain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" placeholder="Any additional health information, allergies, or specific requirements..." value={form.notes} onChange={e => handleFormChange('notes', e.target.value)} />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button type="submit">Create Patient Profile</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patients..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by constitution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Constitutions</SelectItem>
                <SelectItem value="vata">Vata</SelectItem>
                <SelectItem value="pitta">Pitta</SelectItem>
                <SelectItem value="kapha">Kapha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recent Patients */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Recent Patients</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {patients.slice(0, 3).map((patient) => {
            const bmiInfo = getBMIStatus(patient.bmi);
            return (
              <Card key={patient.id} className="shadow-soft border border-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-ayurvedic rounded-full flex items-center justify-center text-white font-bold text-base">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold">{patient.name}</div>
                      <div className="text-xs text-muted-foreground">{patient.age} yrs • {patient.gender}</div>
                      <div className="text-xs text-muted-foreground">{patient.constitution}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <Button size="sm" variant="outline" onClick={() => navigate("/patient-profile", { state: { patient } })}>Profile</Button>
                    <Button size="sm" onClick={() => handleGenerateDietChart(patient)}>Diet Plan</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid gap-6">
        {patients.map((patient) => {
          const bmiInfo = getBMIStatus(patient.bmi);
          return (
            <Card key={patient.id} className="shadow-soft hover:shadow-strong transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-ayurvedic rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-xl font-semibold">{patient.name}</h3>
                        <p className="text-muted-foreground">{patient.age} years • {patient.gender}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className={getConstitutionColor(patient.constitution)}>
                          {patient.constitution}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Activity className="h-4 w-4 mr-1" />
                          BMI: {patient.bmi} 
                          <span className={`ml-1 font-medium ${bmiInfo.color}`}>
                            ({bmiInfo.status})
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Condition:</span>
                          <span className="ml-2 font-medium">{patient.condition}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Diet:</span>
                          <span className="ml-2 font-medium">{patient.dietPreference}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => navigate("/patient-profile", { state: { patient } })}>View Profile</Button>
                      <Button size="sm" onClick={() => handleGenerateDietChart(patient)}>Generate Diet Chart</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PatientManagement;