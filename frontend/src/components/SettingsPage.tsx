import { useState } from "react";
import { User, Shield, Bell, Save, CheckCircle, Lock, RefreshCw, KeyRound } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Admin Administrator",
    email: "admin@medicare.com",
    role: "Chief Systems Administrator",
    division: "Core Medicare Operations"
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name || !profile.email) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSuccess("Admin profile updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setError("");
    setSuccess("Password changed successfully!");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clinic Settings</h1>
        <p className="text-gray-600">Modify administrator credentials and change system passwords</p>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-700 font-semibold text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 animate-bounce" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-650 font-semibold text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          <button
            onClick={() => { setActiveTab("profile"); setError(""); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-left transition-all ${
              activeTab === "profile"
                ? "bg-purple-50 text-purple-700 border border-purple-100 shadow-sm"
                : "text-gray-700 hover:bg-white/60"
            }`}
          >
            <User className="w-5 h-5" />
            Admin Profile
          </button>
          <button
            onClick={() => { setActiveTab("password"); setError(""); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-left transition-all ${
              activeTab === "password"
                ? "bg-purple-50 text-purple-700 border border-purple-100 shadow-sm"
                : "text-gray-700 hover:bg-white/60"
            }`}
          >
            <Lock className="w-5 h-5" />
            Security & Password
          </button>
        </div>

        {/* Content Box */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === "profile" && (
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/30 shadow-lg">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Update Admin Profile</h3>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Administrator Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-gray-250 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-gray-250 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">System Role</label>
                    <input
                      type="text"
                      disabled
                      value={profile.role}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                    <input
                      type="text"
                      value={profile.division}
                      onChange={(e) => setProfile({ ...profile, division: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-gray-250 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-purple-500/20 hover:opacity-95 transition-all text-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/30 shadow-lg">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-gray-250 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-gray-250 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-gray-250 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-purple-500/20 hover:opacity-95 transition-all text-sm cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
