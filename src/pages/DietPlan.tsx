import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GEMINI_API_KEY = "AIzaSyDvK2oYWRiVMvjfN_ZLbd1suijueeFOTyk";

// ✅ More robust table parser
function parseDietTable(text: string): { [day: string]: { [meal: string]: string } } {
  const table: { [day: string]: { [meal: string]: string } } = {};
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.startsWith("|") && l.endsWith("|"));
  if (lines.length < 2) return table;

  const headers = lines[0].split("|").map(c => c.trim()).filter(Boolean);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("---")) continue; // skip separator
    const cells = line.split("|").map(c => c.trim()).filter(Boolean);
    if (cells.length === headers.length) {
      const day = cells[0];
      table[day] = {};
      for (let j = 1; j < headers.length; j++) {
        table[day][headers[j]] = cells[j];
      }
    }
  }
  return table;
}

const DietPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;
  const doctorName = location.state?.doctorName || "Dr. Aditya Patil";
  const [dietPlan, setDietPlan] = useState<string>("");
  const [dietTable, setDietTable] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const patientKey = patient ? `dietplan_${patient.id}` : null;

  useEffect(() => {
    if (!patient) return;
    setSaved(false);

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
  const prompt = `
You are an expert Ayurvedic nutritionist. Create a weekly Ayurvedic diet plan.

**Important:**
Return ONLY a markdown table with the following exact columns (in this order):
| Day | Breakfast | Lunch | Dinner | Snacks | Calories |

Calories should be approximate total daily kilocalories (e.g. 1800 kcal). Do not include explanations or extra text outside the table.

Patient Data:
Name: ${patient.name}
Age: ${patient.age}
Gender: ${patient.gender}
Prakriti: ${patient.constitution}
Agni: ${patient.agni || ""}
Nidra: ${patient.nidra || ""}
Ahara Ruchi: ${patient.aharaRuchi || ""}
Pravritti: ${patient.pravritti || ""}
Condition: ${patient.condition || ""}
Diet Preference: ${patient.dietPreference || ""}
BMI: ${patient.bmi || ""}
Doctor: ${doctorName}
`;

        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
              safetySettings: [
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" }
              ]
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError((data.error && data.error.message) ? `Gemini error: ${data.error.message}` : "Failed to generate diet plan");
          return;
        }

        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text || text.trim() === "") {
          console.log("Gemini raw response:", data);
          setError("No response from Gemini. Please try again or check your API usage.");
          setDietPlan("");
          setDietTable(null);
          return;
        }

        console.log("Gemini diet plan raw:\n", text); // ✅ Debugging
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

  const handlePrint = () => { window.print(); };

  // ✅ New save function
  const saveDietPlan = () => {
    if (!patientKey || !dietPlan) return;

    // Save diet plan
    localStorage.setItem(patientKey, dietPlan);

    // Also save patient info so DietCharts.tsx can display details
    localStorage.setItem(`patient_${patient.id}`, JSON.stringify(patient));

    setSaved(true);

  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-wrap gap-2 mb-4 print:hidden">
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        <Button variant="default" onClick={handlePrint}>Print</Button>
        <Button
          variant={saved ? "secondary" : "default"}
          disabled={saved || !dietPlan}
          onClick={saveDietPlan}
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
            <table className="min-w-full border border-border rounded-xl bg-background shadow-md print:shadow-none print:border print:bg-white">
              <thead>
                <tr className="bg-primary text-primary-foreground uppercase text-sm print:bg-gray-200 print:text-black">
                  <th className="px-4 py-3 text-left rounded-tl-xl">Day</th>
                  {Object.keys(dietTable[Object.keys(dietTable)[0]]).map((meal) => (
                    <th
                      key={meal}
                      className={`px-4 py-3 ${meal.toLowerCase().includes('calor') ? 'text-right' : 'text-left'}`}
                    >
                      {meal}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(dietTable).map(([day, meals], i) => (
                  <tr
                    key={day}
                    className={
                      i % 2 === 0
                        ? "bg-muted/40 hover:bg-muted/60 transition-colors print:bg-white"
                        : "bg-background hover:bg-muted/40 transition-colors print:bg-white"
                    }
                  >
                    <td className="px-4 py-3 font-semibold text-primary">{day}</td>
                    {Object.entries(meals).map(([mealName, item], idx) => (
                      <td
                        key={idx}
                        className={`px-4 py-3 border-t border-border text-sm ${mealName.toLowerCase().includes('calor') ? 'text-right font-semibold' : ''}`}
                      >
                        {String(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && dietPlan && <pre>{dietPlan}</pre>
        )}
      </div>
    </div>
  );
};

export default DietPlan;

