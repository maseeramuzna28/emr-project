import { useEffect, useState } from "react";
import { Phone, Mail, MessageCircle, AlertTriangle, Send, CheckCircle, RefreshCw } from "lucide-react";
import { api } from "../api";

export function EmergencyContact() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertForm, setAlertForm] = useState({
    senderName: "",
    phone: "",
    message: "",
  });
  const [alertSuccess, setAlertSuccess] = useState("");
  const [error, setError] = useState("");

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getEmergencyContacts();
      setContacts(data);
    } catch (err) {
      setError("Failed to fetch emergency contacts from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertForm.senderName || !alertForm.phone || !alertForm.message) {
      alert("Please fill in all alert details");
      return;
    }

    try {
      await api.sendEmergencyAlert({
        senderName: alertForm.senderName,
        phone: alertForm.phone,
        message: alertForm.message,
        isCritical: true,
      });

      setAlertSuccess("🚨 Emergency Alert Dispatched! Responders are notified.");
      setAlertForm({
        senderName: "",
        phone: "",
        message: "",
      });
      setTimeout(() => setAlertSuccess(""), 5000);
    } catch (err) {
      alert("Failed to dispatch emergency alert.");
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
            Emergency Operations Center
          </h1>
          <p className="text-gray-600">Connect with emergency doctors, ambulance dispatchers, and send quick alerts</p>
        </div>
        <button
          onClick={loadContacts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 text-gray-700 hover:bg-white/90 transition-all font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-650 text-sm font-medium">
          {error}
        </div>
      )}

      {alertSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-red-500 text-white font-bold flex items-center gap-3 shadow-lg shadow-red-500/20 border border-red-650 animate-bounce">
          <AlertTriangle className="w-6 h-6 text-white" />
          <span>{alertSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contacts Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2">Active Emergency Staff</h3>
          
          {loading && contacts.length === 0 ? (
            <div className="p-12 text-center text-gray-500 bg-white/75 backdrop-blur-md border border-white/30 shadow rounded-2xl">
              Loading emergency lines...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-md border border-white/30 flex flex-col justify-between hover:shadow-lg transition-all hover:bg-white/90"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-purple-600 flex items-center justify-center text-white text-md font-bold">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            c.online ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-base text-gray-900 leading-tight">{c.name}</p>
                        <p className="text-xs text-purple-600 font-medium mt-0.5">{c.role}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-4 text-xs font-medium text-gray-600">
                      <p>📞 Phone: {c.phone}</p>
                      <p>✉️ Email: {c.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-gray-100 pt-3.5 mt-2">
                    <a
                      href={`tel:${c.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-semibold border border-blue-100"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    <a
                      href={`mailto:${c.email}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors text-xs font-semibold border border-purple-100"
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                    <a
                      href={`https://wa.me/${c.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors text-xs font-semibold border border-emerald-100"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send Emergency Alert Form */}
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/30 h-fit">
          <div className="flex items-center gap-2 text-red-650 font-bold mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg text-gray-900">Broadcast Alert</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Dispatch an immediate warning to all on-call hospital units, nurses, and coordinators.
          </p>

          <form onSubmit={handleSendAlert} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="Staff name or Patient name"
                value={alertForm.senderName}
                onChange={(e) => setAlertForm({ ...alertForm, senderName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Callback Phone</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={alertForm.phone}
                onChange={(e) => setAlertForm({ ...alertForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Description</label>
              <textarea
                required
                placeholder="State symptoms, patient details, or location/ward..."
                rows={4}
                value={alertForm.message}
                onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-lg shadow-red-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer text-sm"
            >
              <Send className="w-4 h-4 animate-pulse" />
              DISPATCH MED-ALERT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}