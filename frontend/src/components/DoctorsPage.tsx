import { useEffect, useState } from "react";
import { Search, Stethoscope } from "lucide-react";
import { api } from "../api";
import { DoctorCard } from "./DoctorCard";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadDoctors = async () => {
    setLoading(true);

    try {
      const data = await api.getDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error("Failed to load doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredDoctors(filtered);
  }, [search, doctors]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-purple-600" />
            Doctors Management
          </h1>
          <p className="text-gray-600">
            View and manage all registered doctors
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-72 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Doctors Count */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 font-semibold">
          Total Doctors: {filteredDoctors.length}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/30">
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading doctors...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No doctors found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                name={doctor.name}
                specialty={doctor.specialty}
                status={doctor.status}
                patients={doctor.patients}
                nextAvailable={doctor.nextAvailable}
                avatar={doctor.avatar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}