import { useState } from 'react';
import { Brain, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const commonSymptoms = [
  'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea',
  'Chest Pain', 'Shortness of Breath', 'Dizziness',
  'Sore Throat', 'Body Aches', 'Vomiting', 'Diarrhea',
  'Loss of Appetite', 'Sweating', 'Chills'
];

interface Prediction {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendation: string;
}

export function AIDisease() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [customSymptom, setCustomSymptom] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom && !selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms(prev => [...prev, customSymptom]);
      setCustomSymptom('');
    }
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    setPrediction(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a medical AI assistant. Based on these symptoms: ${selectedSymptoms.join(', ')}, provide a JSON response with:
            {
              "disease": "most likely disease name",
              "confidence": confidence percentage as number,
              "severity": "Low" or "Medium" or "High" or "Critical",
              "recommendation": "brief medical recommendation"
            }
            Respond ONLY with the JSON, no other text.`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text;
      const parsed = JSON.parse(text);
      setPrediction(parsed);

      // Save to backend
      await fetch('http://127.0.0.1:3001/disease-predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms.join(', '),
          predicted_disease: parsed.disease,
          confidence: parsed.confidence,
          severity: parsed.severity,
          recommendation: parsed.recommendation
        })
      });
    } catch {
      setPrediction({
        disease: 'Analysis Error',
        confidence: 0,
        severity: 'Low',
        recommendation: 'Please consult a doctor directly.'
      });
    }
    setLoading(false);
  };

  const severityColors = {
    Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Critical: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          AI Disease Detection
        </h1>
        <p className="text-gray-600">Select symptoms to get an AI-powered diagnosis</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Symptoms Selection */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
          <h3 className="font-semibold text-gray-900 mb-4">Select Symptoms</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {commonSymptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedSymptoms.includes(symptom)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={customSymptom}
              onChange={e => setCustomSymptom(e.target.value)}
              placeholder="Add custom symptom..."
              className="flex-1 px-4 py-2 rounded-xl bg-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              onClick={addCustomSymptom}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
            >
              Add
            </button>
          </div>

          {selectedSymptoms.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Selected ({selectedSymptoms.length}):</p>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map(s => (
                  <span key={s} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                    {s}
                    <button onClick={() => toggleSymptom(s)} className="ml-1 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={analyzeSymptoms}
            disabled={selectedSymptoms.length === 0 || loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </span>
            ) : 'Analyze Symptoms'}
          </button>
        </div>

        {/* Results */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
          <h3 className="font-semibold text-gray-900 mb-4">AI Diagnosis Result</h3>

          {!prediction && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Brain className="w-16 h-16 mb-4 opacity-30" />
              <p>Select symptoms and click Analyze</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-purple-600">
              <Loader className="w-16 h-16 mb-4 animate-spin" />
              <p>AI is analyzing your symptoms...</p>
            </div>
          )}

          {prediction && !loading && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-100">
                <p className="text-sm text-gray-600 mb-1">Predicted Disease</p>
                <h2 className="text-2xl font-bold text-gray-900">{prediction.disease}</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-gray-100">
                  <p className="text-sm text-gray-600 mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                    <span className="font-bold text-gray-900">{prediction.confidence}%</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-100">
                  <p className="text-sm text-gray-600 mb-1">Severity</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${severityColors[prediction.severity]}`}>
                    {prediction.severity}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100">
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Recommendation
                </p>
                <p className="text-gray-800">{prediction.recommendation}</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-700">This is an AI prediction only. Always consult a qualified doctor for proper diagnosis.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}