import { useState } from "react";
import { Brain, AlertCircle, CheckCircle, Loader, RefreshCw, User } from "lucide-react";
import { api } from "../api";

interface Prediction {
  disease: string;
  severity: "mild" | "moderate" | "severe" | "critical";
  recommendation: string;
  matched_doctor: string;
}

export function AIDisease() {
  const [symptomsInput, setSymptomsInput] = useState("");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDetect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim()) {
      setError("Please enter some symptoms first.");
      return;
    }

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const data = await api.detectDisease(symptomsInput);
      setPrediction({
        disease: data.disease,
        severity: data.severity as any,
        recommendation: data.recommendation,
        matched_doctor: data.matched_doctor,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to analyze symptoms. Make sure the backend is active.");
    } finally {
      setLoading(false);
    }
  };

  const severityColors = {
    mild: "bg-emerald-100 text-emerald-700 border-emerald-200",
    moderate: "bg-amber-100 text-amber-700 border-amber-200",
    severe: "bg-orange-100 text-orange-700 border-orange-200",
    critical: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
          AI Disease Detection
        </h1>
        <p className="text-gray-600">Enter patient symptoms to query the clinical rule-based analysis engine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Symptoms Text Input Form */}
        <div className="bg-white/85 backdrop-blur-xl p-6 rounded-2xl border border-white/30 shadow-lg">
          <h3 className="font-bold text-gray-900 text-lg mb-3">Symptom Input</h3>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Type clinical symptoms separated by commas. Our rule-based matching engine handles fever, cough, chest pain, headache, fatigue, thirst, rash, itching, stomach pain, and vomiting.
          </p>

          <form onSubmit={handleDetect} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Describe Symptoms</label>
              <textarea
                required
                placeholder="e.g. fever, cough, fatigue..."
                rows={5}
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-650 text-xs rounded-xl font-medium flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4 text-red-500" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-purple-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Detect Disease
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="bg-white/85 backdrop-blur-xl p-6 rounded-2xl border border-white/30 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-4">Diagnosis Report</h3>

            {!prediction && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Brain className="w-14 h-14 mb-3 opacity-30 text-purple-600" />
                <p className="font-medium text-sm">Enter clinical symptoms and analyze to view diagnosis report.</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 text-purple-600">
                <Loader className="w-14 h-14 mb-3 animate-spin" />
                <p className="font-medium text-sm">Engine is processing clinical rules...</p>
              </div>
            )}

            {prediction && !loading && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 shadow-sm">
                  <span className="text-xxs text-purple-600 font-bold block uppercase tracking-wider mb-1">
                    Matched Condition
                  </span>
                  <h4 className="text-2xl font-extrabold text-indigo-950">{prediction.disease}</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-gray-150 flex flex-col justify-between">
                    <span className="text-xxs text-gray-400 font-bold block uppercase tracking-wider mb-1">
                      Clinical Severity
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border text-center uppercase ${
                        severityColors[prediction.severity] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {prediction.severity}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-gray-150 flex flex-col justify-between">
                    <span className="text-xxs text-gray-400 font-bold block uppercase tracking-wider mb-1">
                      Recommended Specialist
                    </span>
                    <div className="flex items-center gap-1.5 text-indigo-950 font-bold text-xs truncate">
                      <User className="w-4 h-4 text-purple-600" />
                      {prediction.matched_doctor}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-150">
                  <span className="text-xxs text-gray-400 font-bold block uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    Recommended Action Plans
                  </span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    {prediction.recommendation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {prediction && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 text-amber-600 mt-0.5" />
              <p className="text-xxs text-amber-850 leading-relaxed font-semibold">
                NOTICE: This is an AI clinical assistant tool based on preset hospital rules. Validate all medication plans with the attending specialist doctor directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}