import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const GEMINI_API_KEY = "AIzaSyByN5LDr6NbjiyI6F5ab_5SxSvnuvm2VcU";

function parseDietTable(text: string): { [day: string]: { [meal: string]: string } } {
  // Try to parse a markdown or text table into a JS object
  // This is a simple parser for tables with days as rows and meals as columns
  const lines = text.split("\n").filter(l => l.trim());
  const table: { [day: string]: { [meal: string]: string } } = {};
  let headers: string[] = [];
  for (const line of lines) {
    if (line.startsWith("|")) {
      const cells = line.split("|").map(c => c.trim()).filter(Boolean);
      if (!headers.length) {
        headers = cells;
      } else if (!cells[0].toLowerCase().includes("---")) {
        const day = cells[0];
        table[day] = {};
        for (let i = 1; i < headers.length && i < cells.length; ++i) {
          table[day][headers[i]] = cells[i];
        }
      }
    }
  }
  return table;
}

const DietPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;
  const doctorName = location.state?.doctorName || "Dr. Anjali Mehra"; // fallback demo doctor
  const [dietPlan, setDietPlan] = useState<string>("");
  const [dietTable, setDietTable] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  // Unique key for saving diet plan per patient
  const patientKey = patient ? `dietplan_${patient.id}` : null;

  useEffect(() => {
    if (!patient) return;
    setSaved(false);
    // Check for saved plan first
    if (patientKey) {
      const savedPlan = localStorage.getItem(patientKey);
      if (savedPlan) {
        setDietPlan(savedPlan);
        setDietTable(parseDietTable(savedPlan));
        setSaved(true);
        return;
      }
    }
    async function fetchDiet() {
      setLoading(true);
      setError(null);
      setDietPlan("");
      setDietTable(null);
      try {
        const prompt = `You are an expert Ayurvedic nutritionist. Create a detailed weekly Ayurvedic diet plan for the following patient. Use classical Ayurvedic principles and tailor the plan to the patient's constitution (Prakriti), digestive fire (Agni), sleep (Nidra), taste preference (Ahara Ruchi), and bowel habit (Pravritti). Include breakfast, lunch, dinner, and snacks for each day. Format the result as a markdown table with columns: Day, Breakfast, Lunch, Dinner, Snacks.\n\nPatient Data:\nName: ${patient.name}\nAge: ${patient.age}\nGender: ${patient.gender}\nPrakriti: ${patient.constitution}\nAgni: ${patient.agni || ''}\nNidra: ${patient.nidra || ''}\nAhara Ruchi: ${patient.aharaRuchi || ''}\nPravritti: ${patient.pravritti || ''}\nCondition: ${patient.condition || ''}\nDiet Preference: ${patient.dietPreference || ''}\nBMI: ${patient.bmi || ''}\nDoctor: ${doctorName}`;
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
            })
          }
        );
        const data = await response.json();
        if (!response.ok) {
          setError((data.error && data.error.message) ? `Gemini error: ${data.error.message}` : "Failed to generate diet plan");
          return;
        }
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
        setDietPlan(text);
        setDietTable(parseDietTable(text));
      } catch (err: any) {
        setError(err.message || "Error generating diet plan");
      } finally {
        setLoading(false);
      }
    }
    fetchDiet();
  }, [patient]);

  if (!patient) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">No patient data found</h2>
        <p className="mb-6">Please select a patient from the patient list to generate a diet plan.</p>
        <Button variant="outline" onClick={() => navigate("/")}>Go to Patient List</Button>
      </div>
    );
  }

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-wrap gap-2 mb-4 print:hidden">
        <Button variant="outline" onClick={() => navigate(-1)} className="shadow-soft">Back</Button>
        <Button variant="default" onClick={handlePrint} className="shadow-soft">Print</Button>
        <Button
          variant={saved ? "secondary" : "default"}
          className="shadow-soft"
          disabled={saved || !dietPlan}
          onClick={() => {
            if (patientKey && dietPlan) {
              localStorage.setItem(patientKey, dietPlan);
              setSaved(true);
            }
          }}
        >
          {saved ? "Saved" : "Save"}
        </Button>
      </div>
      <div className="bg-card rounded-lg shadow-strong p-6 print:p-2 print:shadow-none print:bg-white">
        <h1 className="text-3xl font-bold mb-2 text-center text-primary print:text-2xl print:mb-1">Ayurvedic Diet Plan</h1>
        <div className="mb-4 text-muted-foreground text-center print:text-base print:mb-2">
          For: <b className="text-primary">{patient.name}</b> | Age: {patient.age} | Gender: {patient.gender} | Prakriti: {patient.constitution}
          <div className="mt-1 font-semibold text-primary print:text-black">Doctor: {doctorName}</div>
        </div>
        {loading && <div className="py-8 text-center">Generating diet plan...</div>}
        {error && <div className="text-red-500 py-4">{error}</div>}
        {dietTable ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-border rounded-lg bg-background shadow-sm print:shadow-none print:border print:bg-white">
              <thead>
                <tr className="bg-muted text-primary print:bg-gray-200 print:text-black">
                  {Object.keys(dietTable[Object.keys(dietTable)[0]] || {}).length > 0 && (
                    <>
                      <th className="py-3 px-6 border-b border-border font-semibold text-lg text-primary print:text-black print:text-base print:py-2 print:px-3">Day</th>
                      {Object.keys(dietTable[Object.keys(dietTable)[0]]).map((meal) => (
                        <th key={meal} className="py-3 px-6 border-b border-border font-semibold text-lg text-primary print:text-black print:text-base print:py-2 print:px-3">{meal}</th>
                      ))}
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {Object.entries(dietTable).map(([day, meals], i) => (
                  <tr key={day} className={i % 2 === 0 ? "bg-card/70 print:bg-white" : "bg-background print:bg-white"}>
                    <td className="py-2 px-4 border-b border-border font-semibold text-primary print:text-black print:border print:font-bold print:bg-white">{day}</td>
                    {Object.values(meals).map((item, idx) => (
                      <td key={idx} className="py-2 px-4 border-b border-border print:border print:bg-white print:text-black">{item}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && dietPlan && (
            <pre className="bg-muted p-4 rounded whitespace-pre-wrap mt-4">{dietPlan}</pre>
          )
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: #fff !important; }
          .print\:hidden { display: none !important; }
          .print\:text-2xl { font-size: 1.5rem !important; }
          .print\:mb-1 { margin-bottom: 0.25rem !important; }
          .print\:mb-2 { margin-bottom: 0.5rem !important; }
          .print\:text-base { font-size: 1rem !important; }
          .print\:py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .print\:px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
          .print\:shadow-none { box-shadow: none !important; }
          .print\:border { border: 1px solid #888 !important; }
          .print\:bg-white { background: #fff !important; }
          .print\:font-bold { font-weight: bold !important; }
          .print\:fit-page { width: 100vw !important; height: 100vh !important; overflow: hidden !important; }
          .print\:fit-table { font-size: 0.85rem !important; }
          @page { size: A4 portrait; margin: 0.5cm; }
          html, body, #root { height: 100% !important; }
        }
        @media print {
          .max-w-4xl, .p-4, .py-8, .px-4, .p-6, .print\:p-2 { max-width: 100vw !important; padding: 0.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default DietPlan;
