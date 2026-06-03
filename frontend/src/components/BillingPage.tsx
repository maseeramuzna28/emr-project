import { useEffect, useState } from "react";
import { api } from "../api";
import { Search, Plus, Edit2, Trash2, CreditCard, DollarSign, X, Check, Clock, AlertTriangle, RefreshCw } from "lucide-react";

export default function BillingPage() {
  const [billing, setBilling] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
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
    amount: "",
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [billingData, patientData] = await Promise.all([
        api.getBillingRecords(),
        api.getPatients(),
      ]);
      setBilling(billingData);
      setPatients(patientData);
    } catch (err) {
      setError("Failed to fetch billing data. Verify the backend is running.");
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
    if (!form.patientId || !form.amount || !form.description) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await api.createBillingRecord({
        patientId: Number(form.patientId),
        amount: Number(form.amount),
        status: form.status,
        date: form.date,
        description: form.description,
      });

      setSuccess("Billing invoice created successfully!");
      setIsAddOpen(false);
      resetForm();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to create billing record.");
    }
  };

  const handleEditClick = (record: any) => {
    setCurrentId(record.id);
    setForm({
      patientId: record.patientId.toString(),
      amount: record.amount.toString(),
      status: record.status,
      date: record.date || new Date().toISOString().split("T")[0],
      description: record.description,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentId) return;

    try {
      await api.updateBillingRecord(currentId, {
        patientId: Number(form.patientId),
        amount: Number(form.amount),
        status: form.status,
        date: form.date,
        description: form.description,
      });

      setSuccess("Invoice updated successfully!");
      setIsEditOpen(false);
      resetForm();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to update billing record.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this billing invoice?")) return;
    try {
      await api.deleteBillingRecord(id);
      setSuccess("Invoice deleted successfully.");
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to delete billing record.");
    }
  };

  const resetForm = () => {
    setForm({
      patientId: "",
      amount: "",
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setCurrentId(null);
  };

  const filteredBilling = billing.filter((b) => {
    const pName = getPatientName(b.patientId).toLowerCase();
    const desc = b.description.toLowerCase();
    const q = search.toLowerCase();
    return pName.includes(q) || desc.includes(q);
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Invoices</h1>
          <p className="text-gray-600">Track consultation fees, laboratory invoice status, and patient balances</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 text-gray-700 hover:bg-white/90 transition-all font-medium animate-none"
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
            New Invoice
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

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/30 shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Paid Invoices</p>
            <h3 className="text-2xl font-bold text-emerald-600">
              ${billing.filter((b) => b.status === "paid").reduce((sum, b) => sum + Number(b.amount), 0).toFixed(2)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Check className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/30 shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Outstanding Pending</p>
            <h3 className="text-2xl font-bold text-amber-600">
              ${billing.filter((b) => b.status === "pending").reduce((sum, b) => sum + Number(b.amount), 0).toFixed(2)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/30 shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Overdue Invoices</p>
            <h3 className="text-2xl font-bold text-red-600">
              ${billing.filter((b) => b.status === "overdue").reduce((sum, b) => sum + Number(b.amount), 0).toFixed(2)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white/30 shadow-md mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search billing records by patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 border-b border-gray-150">
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Patient Profile</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && billing.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 font-medium">
                    Loading invoices database...
                  </td>
                </tr>
              ) : filteredBilling.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No billing records found.
                  </td>
                </tr>
              ) : (
                filteredBilling.map((b) => (
                  <tr key={b.id} className="hover:bg-white/40 transition-all duration-150">
                    <td className="px-6 py-4 text-sm font-bold text-purple-600">
                      #INV-{1000 + b.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          {getInitials(getPatientName(b.patientId))}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{getPatientName(b.patientId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${Number(b.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{b.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          b.status === "paid"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : b.status === "pending"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.description}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(b)}
                          className="p-2 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
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

      {/* Add Invoice Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 rounded-2xl shadow-xl border border-white/20 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Create Billing Invoice</h3>
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
                  <option value="">-- Select Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 150.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Consultation Fee"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-95 transition-all shadow-md cursor-pointer"
                >
                  Create Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 rounded-2xl shadow-xl border border-white/20 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Modify Billing Invoice</h3>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Description</label>
                <input
                  type="text"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-95 transition-all shadow-md cursor-pointer"
                >
                  Save Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
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
