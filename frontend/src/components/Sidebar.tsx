import { Home, Users, Calendar, FileText, Activity, Settings, LogOut, Stethoscope, AlertTriangle, Brain, CreditCard } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: Stethoscope, label: "Doctors", path: "/doctors" },
  { icon: Calendar, label: 'Appointments', path: '/appointments' },
  { icon: Activity, label: 'Analytics', path: '/analytics' },
  { icon: Brain, label: 'AI Disease', path: '/ai-detection' },
  { icon: AlertTriangle, label: 'Emergency', path: '/emergency' },
  { icon: FileText, label: 'Records', path: '/records' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/40 backdrop-blur-2xl border-r border-white/30 shadow-xl z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/20">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">MediCare</h2>
            <p className="text-xs text-purple-600 font-semibold tracking-wide uppercase">EMR System</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-700 hover:bg-white/50 hover:text-purple-600'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50/70 border border-transparent hover:border-red-100 transition-all duration-200 cursor-pointer font-semibold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}