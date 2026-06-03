import { useEffect, useState } from "react";
import { Users, Calendar, Activity, TrendingUp, Search, Bell, ChevronDown } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatCard } from "./StatCard";
import { PatientCard } from "./PatientCard";
import AppointmentCard from "./AppointmentCard";
import { DoctorCard } from "./DoctorCard";
import { api } from "../api";
import DoctorsPage from "./DoctorsPage";

const patientVisitsData = [
  { month: "Jan", visits: 245 },
  { month: "Feb", visits: 290 },
  { month: "Mar", visits: 310 },
  { month: "Apr", visits: 285 },
  { month: "May", visits: 340 },
  { month: "Jun", visits: 380 },
];

const COLORS = ["#7C3AED", "#A78BFA", "#EC4899", "#F59E0B", "#10B981"];

export function Dashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [patientsData, apptsData, doctorsData] = await Promise.all([
        api.getPatients(),
        api.getAppointments(),
        api.getDoctors(),
      ]);
      setPatients(patientsData);
      setAppointments(apptsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute stat card values dynamically from API datasets
  const totalPatientsCount = patients.length;
  const criticalCount = patients.filter((p) => p.status === "critical").length;
  const appointmentsCount = appointments.length;

  // Chart data calculations
  const getDemographicsData = () => {
    let ageGroups = {
      "0-18": 0,
      "19-35": 0,
      "36-50": 0,
      "51-65": 0,
      "65+": 0,
    };

    patients.forEach((p) => {
      if (p.age <= 18) ageGroups["0-18"]++;
      else if (p.age <= 35) ageGroups["19-35"]++;
      else if (p.age <= 50) ageGroups["36-50"]++;
      else if (p.age <= 65) ageGroups["51-65"]++;
      else ageGroups["65+"]++;
    });

    return Object.keys(ageGroups).map((key) => ({
      name: key,
      value: ageGroups[key as keyof typeof ageGroups] || 1, // Visual fallback
    }));
  };

  const getAppointmentTypesData = () => {
    let methods = {
      "In-Person": 0,
      "Virtual": 0,
    };

    appointments.forEach((a) => {
      const typeLabel = a.type === "virtual" ? "Virtual" : "In-Person";
      methods[typeLabel]++;
    });

    return Object.keys(methods).map((key) => ({
      type: key,
      count: methods[key as keyof typeof methods] || 2, // Visual fallback
    }));
  };

  const demographicsData = getDemographicsData();
  const appointmentTypesData = getAppointmentTypesData();

  return (
    <div className="p-8">
      {/* Header Profile Info */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Dashboard</h1>
          <p className="text-gray-600">Overview of today's clinic operations and patient care</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, doctors..."
              className="pl-10 pr-4 py-2 w-80 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>
          <button className="relative p-3 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 hover:bg-white/95 transition-all">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </button>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 hover:bg-white/95 transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              AD
            </div>
            <span className="text-gray-750 font-semibold text-sm">Admin</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={loading ? "..." : totalPatientsCount}
          change="+12.5%"
          icon={Users}
          trend="up"
          color="from-purple-500 to-indigo-500"
        />
        <StatCard
          title="Appointments Today"
          value={loading ? "..." : appointmentsCount}
          change="+8.2%"
          icon={Calendar}
          trend="up"
          color="from-pink-500 to-rose-500"
        />
        <StatCard
          title="Critical Cases"
          value={loading ? "..." : criticalCount}
          change="-4.1%"
          icon={Activity}
          trend="down"
          color="from-red-500 to-orange-500"
        />
        <StatCard
          title="Success Rate"
          value="98.5%"
          change="+2.3%"
          icon={TrendingUp}
          trend="up"
          color="from-emerald-500 to-teal-500"
        />
      </div>

      {/* Doctors Grid */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Doctors Availability</h3>
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-xl">
            {doctors.filter((d) => d.status === "available").length} Online
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading && doctors.length === 0 ? (
            <div className="col-span-3 text-center py-6 text-gray-500 font-medium">
              Loading doctors list...
            </div>
          ) : (
            doctors.map((doctor, index) => (
              <DoctorCard key={doctor.id || index} {...doctor} />
            ))
          )}
        </div>
      </div>

      {/* Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
          <h3 className="font-bold text-gray-900 mb-4">Patient Visits Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={patientVisitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: "12px" }} />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
          <h3 className="font-bold text-gray-900 mb-4">Age Demographics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={demographicsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {demographicsData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Appointment Types This Month</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={appointmentTypesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="type" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: "12px" }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {appointmentTypesData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recents Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Patients</h3>
          </div>
          <div className="space-y-3">
            {loading && patients.length === 0 ? (
              <div className="text-center py-6 text-gray-500">Loading patients...</div>
            ) : patients.length === 0 ? (
              <div className="text-center py-6 text-gray-400">No patients registered.</div>
            ) : (
              patients.slice(0, 4).map((patient, index) => (
                <PatientCard key={patient.id || index} {...patient} />
              ))
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Today's Appointments</h3>
          </div>
          <div className="space-y-3">
            {loading && appointments.length === 0 ? (
              <div className="text-center py-6 text-gray-500">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-6 text-gray-400">No appointments scheduled.</div>
            ) : (
              appointments.slice(0, 4).map((appointment, index) => (
                <AppointmentCard key={appointment.id || index} {...appointment} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}