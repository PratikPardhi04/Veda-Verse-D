import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PatientProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;

  if (!patient) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">No patient data found</h2>
        <Button variant="outline" onClick={() => navigate("/patients")}>Go to Patient List</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">Back</Button>
      <div className="bg-card rounded-lg shadow-strong p-6">
        <h1 className="text-3xl font-bold mb-2 text-primary">{patient.name}</h1>
        <div className="mb-4 text-muted-foreground">Age: {patient.age} | Gender: {patient.gender}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-1">Constitution (Prakriti)</h3>
            <div className="mb-2">{patient.constitution || "-"}</div>
            <h3 className="font-semibold mb-1">Digestive Fire (Agni)</h3>
            <div className="mb-2">{patient.agni || "-"}</div>
            <h3 className="font-semibold mb-1">Sleep (Nidra)</h3>
            <div className="mb-2">{patient.nidra || "-"}</div>
            <h3 className="font-semibold mb-1">Taste Preference (Ahara Ruchi)</h3>
            <div className="mb-2">{patient.aharaRuchi || "-"}</div>
            <h3 className="font-semibold mb-1">Bowel Habit (Pravritti)</h3>
            <div className="mb-2">{patient.pravritti || "-"}</div>
            <h3 className="font-semibold mb-1">Notes</h3>
            <div className="mb-2">{patient.notes || "-"}</div>
          </div>
          <div>
            <h3 className="font-semibold mb-1">BMI</h3>
            <div className="mb-2">{patient.bmi || "-"}</div>
            <h3 className="font-semibold mb-1">Condition</h3>
            <div className="mb-2">{patient.condition || "-"}</div>
            <h3 className="font-semibold mb-1">Diet Preference</h3>
            <div className="mb-2">{patient.dietPreference || "-"}</div>
            <h3 className="font-semibold mb-1">Last Visit</h3>
            <div className="mb-2">{patient.lastVisit || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
