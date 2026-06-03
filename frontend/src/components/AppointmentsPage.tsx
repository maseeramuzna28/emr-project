import { useEffect, useState } from "react";
import { api } from "../api";
import { Calendar, Clock, Video, MapPin, Trash2, Edit2, Plus, Search, X, AlertCircle, RefreshCw } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
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
    patientName: "",
    time: "",
    type: "in-person",
    reason: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [apptData, patientData, doctorData] = await Promise.all([
        api.getAppointments(),
        api.getPatients(),
        api.getDoctors(),
      ]);
      setAppointments(apptData);
      setPatients(patientData);
      setDoctors(doctorData);
    } catch (err: any) {
      setError("Failed to load appointments. Verify the backend is active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    if (!form.patientName || !form.time || !form.reason) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const avatar = getInitials(form.patientName);
      await api.createAppointment({
        patientName: form.patientName,
        time: form.time,
        type: form.type,
        reason: form.reason,
        avatar,
      });

      setSuccess("Appointment booked successfully!");
      setIsAddOpen(false);
      resetForm();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to book appointment.");
    }
  };

  const handleEditClick = (appt: any) => {
    setCurrentId(appt.id);
    setForm({
      patientName: appt.patientName,
      time: appt.time,
      type: appt.type,
      reason: appt.reason,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentId) return;

    try {
      const avatar = getInitials(form.patientName);
      await api.updateAppointment(currentId, {
        patientName: form.patientName,
        time: form.time,
        type: form.type,
        reason: form.reason,
        avatar,
      });

      setSuccess("Appointment updated successfully!");
      setIsEditOpen(false);
      resetForm();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to modify appointment.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.deleteAppointment(id);
      setSuccess("Appointment cancelled successfully.");
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to delete appointment.");
    }
  };

  const resetForm = () => {
    setForm({
      patientName: "",
      time: "",
      type: "in-person",
      reason: "",
    });
    setCurrentId(null);
  };

  const filteredAppointments = appointments.filter(
    (appt) =>
      appt.patientName.toLowerCase().includes(search.toLowerCase()) ||
      appt.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clinical Consultations</h1>
          <p className="text-gray-600">Schedule appointments and organize patient consultation methods</p>
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
            Book Slot
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

      {/* Search panel */}
      <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white/30 shadow-md mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments by patient or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 border-b border-gray-150">
                <th className="px-6 py-4">Appointment ID</th>
                <th className="px-6 py-4">Patient Profile</th>
                <th className="px-6 py-4">Time Slot</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Consultation Reason</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500 font-medium">
                    Loading consultations list...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No consultations scheduled.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-white/40 transition-all duration-150">
                    <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                      #APT-{300 + appt.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          {appt.avatar || getInitials(appt.patientName)}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{appt.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        {appt.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          appt.type === "virtual"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-150"
                            : "bg-emerald-50 text-emerald-700 border-emerald-150"
                        }`}
                      >
                        {appt.type === "virtual" ? (
                          <>
                            <Video className="w-3 h-3 text-indigo-500" />
                            Virtual
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            In-Person
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appt.reason}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(appt)}
                          className="p-2 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(appt.id)}
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

      {/* Add Appointment Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 rounded-2xl shadow-xl border border-white/20 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Schedule Consultation</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-650 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                <select
                  required
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Time Slot</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10:30 AM or 2:00 PM"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                >
                  <option value="in-person">In-Person</option>
                  <option value="virtual">Virtual (Video Consultation)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                <textarea
                  required
                  placeholder="Clinical consultation reason..."
                  rows={3}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-95 transition-all shadow-md cursor-pointer text-sm"
                >
                  Confirm Slot
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

      {/* Edit Appointment Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 rounded-2xl shadow-xl border border-white/20 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Modify Appointment</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-650 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                <select
                  required
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Time Slot</label>
                <input
                  type="text"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                >
                  <option value="in-person">In-Person</option>
                  <option value="virtual">Virtual (Video Consultation)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                <textarea
                  required
                  rows={3}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
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
