import { useEffect, useState } from "react";
import { api } from "../api";
import { Search, Plus, Edit2, Trash2, FileText, User, UserCheck, Calendar, X, RefreshCw } from "lucide-react";

export default function RecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [form, setForm] = useState({
    patientId: "",
    diagnosis: "",
    prescription: "",
    notes: "",
    visitDate: new Date().toISOString().split("T")[0],
    doctor: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [recordsData, patientsData, doctorsData] = await Promise.all([
        api.getMedicalRecords(),
        api.getPatients(),
        api.getDoctors(),
      ]);
      setRecords(recordsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError("Failed to fetch medical records from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getPatientName = (patientId: number) => {
    const p = patients.find((pat) => pat.id === patientId);
    return p ? p.name : `Patient ID #${patientId}`;
  };

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "PT";
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || !form.diagnosis || !form.prescription || !form.doctor) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await api.createMedicalRecord({
        patientId: Number(form.patientId),
        diagnosis: form.diagnosis,
        prescription: form.prescription,
        notes: form.notes,
        visitDate: form.visitDate,
        doctor: form.doctor,
      });

      setSuccess("Medical chart entry saved!");
      setIsAddOpen(false);
      resetForm();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to write medical record.");
    }
  };

  const handleEditClick = (record: any) => {
    setCurrentId(record.id);
    setForm({
      patientId: record.patientId.toString(),
      diagnosis: record.diagnosis,
      prescription: record.prescription,
      notes: record.notes || "",
      visitDate: record.visitDate || new Date().toISOString().split("T")[0],
      doctor: record.doctor || "",
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentId) return;

    try {
      await api.updateMedicalRecord(currentId, {
        patientId: Number(form.patientId),
        diagnosis: form.diagnosis,
        prescription: form.prescription,
        notes: form.notes,
        visitDate: form.visitDate,
        doctor: form.doctor,
      });

      setSuccess("Medical record updated successfully.");
      setIsEditOpen(false);
      resetForm();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to update medical record.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this clinical record?")) return;
    try {
      await api.deleteMedicalRecord(id);
      setSuccess("Record removed successfully.");
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete medical record.");
    }
  };

  const resetForm = () => {
    setForm({
      patientId: "",
      diagnosis: "",
      prescription: "",
      notes: "",
      visitDate: new Date().toISOString().split("T")[0],
      doctor: "",
    });
    setCurrentId(null);
  };

  const filteredRecords = records.filter((r) => {
    const name = getPatientName(r.patientId).toLowerCase();
    const diag = r.diagnosis.toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || diag.includes(query);
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Charts & History</h1>
          <p className="text-gray-600">Access and modify clinical diagnoses, prescriptions, and session summaries</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 text-gray-700 hover:bg-white/90 transition-all font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsAddOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-purple-500/25 hover:opacity-95 transition-all text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-650 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 font-medium">
          {success}
        </div>
      )}

      {/* Search and Count */}
      <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white/30 shadow-md mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries by patient name or diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
          />
        </div>
      </div>

      {/* Table Records */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 border-b border-gray-150">
                <th className="px-6 py-4">Entry ID</th>
                <th className="px-6 py-4">Patient Profile</th>
                <th className="px-6 py-4">Treating Doctor</th>
                <th className="px-6 py-4">Primary Diagnosis</th>
                <th className="px-6 py-4">Active Prescription</th>
                <th className="px-6 py-4">Visit Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 font-medium">
                    Querying records logs...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No medical records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-white/40 transition-all duration-150">
                    <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                      #REC-{100 + r.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          {getInitials(getPatientName(r.patientId))}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{getPatientName(r.patientId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {r.doctor}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{r.diagnosis}</td>
                    <td className="px-6 py-4 text-sm text-purple-750 font-semibold">{r.prescription}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-semibold">
                      {r.visitDate || "Today"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(r)}
                          className="p-2 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 rounded-2xl shadow-xl border border-white/20 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Add Clinical History</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-650 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                <select
                  required
                  value={form.patientId}
                  onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treating Doctor</label>
                <select
                  required
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hypertension Stage 2"
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Active Prescription</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metformin 500mg daily"
                  value={form.prescription}
                  onChange={(e) => setForm({ ...form, prescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 hours ago or 2024-05-12"
                    value={form.visitDate}
                    onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Progress Notes</label>
                <textarea
                  placeholder="Patient reports minor symptoms..."
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-95 transition-all shadow-md cursor-pointer text-sm"
                >
                  Write Entry
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 rounded-2xl shadow-xl border border-white/20 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Modify Clinical History</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-650 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                <select
                  required
                  value={form.patientId}
                  onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treating Doctor</label>
                <select
                  required
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Diagnosis</label>
                <input
                  type="text"
                  required
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Active Prescription</label>
                <input
                  type="text"
                  required
                  value={form.prescription}
                  onChange={(e) => setForm({ ...form, prescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
                  <input
                    type="text"
                    value={form.visitDate}
                    onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Progress Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-95 transition-all shadow-md cursor-pointer text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
