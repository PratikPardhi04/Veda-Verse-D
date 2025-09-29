import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Patient {
id: string;
name: string;
age?: string;
gender?: string;
constitution?: string;
}

const DietCharts = () => {
const [patients, setPatients] = useState<Patient[]>([]);
const navigate = useNavigate();

useEffect(() => {
const loadedPatients: Patient[] = [];


// ✅ Read all patient_* keys from localStorage
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith("patient_")) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const patient: Patient = JSON.parse(data);
        loadedPatients.push(patient);
      } catch (err) {
        console.error("Error parsing patient data:", err);
      }
    }
  }
}

setPatients(loadedPatients);


}, []);

const viewChart = (patient: Patient) => {
const dietKey = `dietplan_${patient.id}`;
const dietPlan = localStorage.getItem(dietKey);


if (dietPlan) {
  navigate("/diet-plan", { state: { patient, dietPlan } });
} else {
  alert("No diet chart found for this patient.");
}


};

return ( <div className="max-w-3xl mx-auto py-10 px-4"> <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
Saved Diet Charts </h1>


  {patients.length === 0 ? (
    <div className="text-center text-muted-foreground py-20 border rounded-lg">
      No saved patients yet. Saved patient diet charts will appear here.
    </div>
  ) : (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div
          key={patient.id}
          className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
        >
          <div>
            <div className="font-bold text-green-700">{patient.name}</div>
            <div className="text-sm text-gray-500">
              Age: {patient.age || "N/A"} | Gender: {patient.gender || "N/A"} | Prakriti:{" "}
              {patient.constitution || "N/A"}
            </div>
          </div>
          <Button onClick={() => viewChart(patient)}>View Chart</Button>
        </div>
      ))}
    </div>
  )}
</div>


);
};

export default DietCharts;
