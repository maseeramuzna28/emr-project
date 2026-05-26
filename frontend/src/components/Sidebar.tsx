import { Home, Users, Calendar, FileText, Activity, Settings, LogOut, Stethoscope, AlertTriangle, Brain } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard' },
  { icon: Users, label: 'Patients' },
  { icon: Calendar, label: 'Appointments' },
  { icon: Activity, label: 'Analytics' },
  { icon: Brain, label: 'AI Disease' },
  { icon: AlertTriangle, label: 'Emergency' },
  { icon: FileText, label: 'Records' },
  { icon: Settings, label: 'Settings' },
];

export function Sidebar({ active, setActive }: { active: string; setActive: (label: string) => void }) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/40 backdrop-blur-2xl border-r border-white/30 shadow-xl z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">MediCare</h2>
            <p className="text-xs text-gray-600">EMR System</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active === item.label
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50/50 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}