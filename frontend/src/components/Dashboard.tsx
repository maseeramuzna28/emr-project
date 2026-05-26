import { useState } from 'react';
import { Users, Calendar, Activity, TrendingUp, Search, Bell, ChevronDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from './StatCard';
import { PatientCard } from './PatientCard';
import { AppointmentCard } from './AppointmentCard';
import { DoctorCard } from './DoctorCard';
import { Sidebar } from './Sidebar';
import { AIDisease } from './AIDisease';
import { EmergencyContact } from './EmergencyContact';

const patientVisitsData = [
  { month: 'Jan', visits: 245 },
  { month: 'Feb', visits: 290 },
  { month: 'Mar', visits: 310 },
  { month: 'Apr', visits: 285 },
  { month: 'May', visits: 340 },
  { month: 'Jun', visits: 380 },
];

const demographicsData = [
  { name: '0-18', value: 120 },
  { name: '19-35', value: 340 },
  { name: '36-50', value: 280 },
  { name: '51-65', value: 190 },
  { name: '65+', value: 150 },
];

const appointmentTypesData = [
  { type: 'Check-up', count: 45 },
  { type: 'Follow-up', count: 35 },
  { type: 'Emergency', count: 15 },
  { type: 'Surgery', count: 8 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const recentPatients = [
  { name: 'Emma Wilson', age: 34, condition: 'Hypertension', status: 'stable' as const, lastVisit: '2 hours ago', avatar: 'EW' },
  { name: 'James Miller', age: 56, condition: 'Diabetes Type 2', status: 'monitoring' as const, lastVisit: '5 hours ago', avatar: 'JM' },
  { name: 'Sarah Johnson', age: 28, condition: 'Pregnancy Check', status: 'stable' as const, lastVisit: '1 day ago', avatar: 'SJ' },
  { name: 'Robert Brown', age: 72, condition: 'Cardiac Arrhythmia', status: 'critical' as const, lastVisit: '30 mins ago', avatar: 'RB' },
];

const todayAppointments = [
  { patientName: 'Michael Chen', time: '9:00 AM', type: 'in-person' as const, reason: 'Annual Physical', avatar: 'MC' },
  { patientName: 'Lisa Anderson', time: '10:30 AM', type: 'virtual' as const, reason: 'Follow-up Consultation', avatar: 'LA' },
  { patientName: 'David Kim', time: '2:00 PM', type: 'in-person' as const, reason: 'Lab Results Review', avatar: 'DK' },
  { patientName: 'Anna Martinez', time: '3:30 PM', type: 'virtual' as const, reason: 'Prescription Refill', avatar: 'AM' },
];

const doctorsData = [
  { name: 'Dr. Sarah Anderson', specialty: 'Cardiologist', status: 'available' as const, patients: 12, nextAvailable: '-', avatar: 'SA' },
  { name: 'Dr. Michael Roberts', specialty: 'Pediatrician', status: 'busy' as const, patients: 18, nextAvailable: '11:30 AM', avatar: 'MR' },
  { name: 'Dr. Emily Chen', specialty: 'General Practitioner', status: 'available' as const, patients: 8, nextAvailable: '-', avatar: 'EC' },
  { name: 'Dr. James Wilson', specialty: 'Orthopedic Surgeon', status: 'busy' as const, patients: 6, nextAvailable: '2:15 PM', avatar: 'JW' },
  { name: 'Dr. Lisa Martinez', specialty: 'Dermatologist', status: 'available' as const, patients: 10, nextAvailable: '-', avatar: 'LM' },
  { name: 'Dr. Robert Taylor', specialty: 'Neurologist', status: 'offline' as const, patients: 0, nextAvailable: 'Tomorrow 9:00 AM', avatar: 'RT' },
];

export function Dashboard() {
  const [active, setActive] = useState('Dashboard');

  const renderContent = () => {
    if (active === 'AI Disease') return <AIDisease />;
    if (active === 'Emergency') return <EmergencyContact />;

    if (active === 'Patients') return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Patients</h1>
        <div className="grid grid-cols-2 gap-4">
          {recentPatients.map((patient, index) => (
            <PatientCard key={index} {...patient} />
          ))}
        </div>
      </div>
    );

    if (active === 'Appointments') return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Today's Appointments</h1>
        <div className="space-y-4">
          {todayAppointments.map((appointment, index) => (
            <AppointmentCard key={index} {...appointment} />
          ))}
        </div>
      </div>
    );

    if (active === 'Analytics') return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
            <h3 className="font-semibold text-gray-900 mb-4">Patient Visits Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patientVisitsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
            <h3 className="font-semibold text-gray-900 mb-4">Age Demographics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={demographicsData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {demographicsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
          <h3 className="font-semibold text-gray-900 mb-4">Appointment Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={appointmentTypesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="type" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {appointmentTypesData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );

    if (active === 'Records') return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Medical Records</h1>
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-200">
                <th className="pb-3">Patient</th>
                <th className="pb-3">Age</th>
                <th className="pb-3">Condition</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((p, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-white/50">
                  <td className="py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="py-3 text-gray-600">{p.age}</td>
                  <td className="py-3 text-gray-600">{p.condition}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.status === 'stable' ? 'bg-emerald-100 text-emerald-700' :
                      p.status === 'critical' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{p.status}</span>
                  </td>
                  <td className="py-3 text-gray-500">{p.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    if (active === 'Settings') return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30 max-w-lg">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Hospital Name</label>
              <input defaultValue="MediCare EMR" className="w-full px-4 py-2 rounded-xl bg-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Admin Email</label>
              <input defaultValue="admin@medicare.com" className="w-full px-4 py-2 rounded-xl bg-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Timezone</label>
              <select className="w-full px-4 py-2 rounded-xl bg-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                <option>Asia/Kolkata (IST)</option>
                <option>America/New_York (EST)</option>
                <option>Europe/London (GMT)</option>
              </select>
            </div>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Dashboard</h1>
            <p className="text-gray-600">Overview of today's clinic operations and patient care</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search patients, doctors..." className="pl-10 pr-4 py-2 w-80 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
            </div>
            <button className="relative p-3 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 hover:bg-white/90 transition-all">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 hover:bg-white/90 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">AD</div>
              <span className="text-gray-700">Admin</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Patients" value="1,284" change="+12.5%" icon={Users} trend="up" color="from-blue-500 to-cyan-500" />
          <StatCard title="Appointments Today" value="24" change="+8.2%" icon={Calendar} trend="up" color="from-purple-500 to-pink-500" />
          <StatCard title="Critical Cases" value="8" change="-4.1%" icon={Activity} trend="down" color="from-red-500 to-orange-500" />
          <StatCard title="Success Rate" value="98.5%" change="+2.3%" icon={TrendingUp} trend="up" color="from-emerald-500 to-teal-500" />
        </div>

        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Doctors Availability</h3>
            <button className="text-sm text-purple-600 hover:text-purple-700">View All Staff</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {doctorsData.map((doctor, index) => (
              <DoctorCard key={index} {...doctor} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
            <h3 className="font-semibold text-gray-900 mb-4">Patient Visits Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={patientVisitsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
            <h3 className="font-semibold text-gray-900 mb-4">Age Demographics</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={demographicsData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {demographicsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Appointment Types This Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={appointmentTypesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="type" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {appointmentTypesData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recent Patients</h3>
              <button onClick={() => setActive('Patients')} className="text-sm text-purple-600 hover:text-purple-700">View All</button>
            </div>
            <div className="space-y-3">
              {recentPatients.map((patient, index) => (
                <PatientCard key={index} {...patient} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Today's Appointments</h3>
              <button onClick={() => setActive('Appointments')} className="text-sm text-purple-600 hover:text-purple-700">View Schedule</button>
            </div>
            <div className="space-y-3">
              {todayAppointments.map((appointment, index) => (
                <AppointmentCard key={index} {...appointment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Sidebar active={active} setActive={setActive} />
      <div className="ml-64">
        {renderContent()}
      </div>
    </div>
  );
}