import { Phone, Mail, Clock } from 'lucide-react';

interface DoctorCardProps {
  name: string;
  specialty: string;
  status: 'available' | 'busy' | 'offline';
  patients: number;
  nextAvailable: string;
  avatar: string;
}

export function DoctorCard({ name, specialty, status, patients, nextAvailable, avatar }: DoctorCardProps) {
  const statusColors = {
    available: 'bg-emerald-500',
    busy: 'bg-amber-500',
    offline: 'bg-gray-400'
  };

  const statusLabels = {
    available: 'Available',
    busy: 'Busy',
    offline: 'Offline'
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-lg p-5 shadow-md border border-white/30 hover:shadow-lg transition-all duration-300 hover:bg-white/80">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl">
            {avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusColors[status]}`}></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{specialty}</p>
          
          <div className="flex items-center gap-4 mt-3">
            <span className={`text-xs px-2 py-1 rounded-full ${
              status === 'available' ? 'bg-emerald-100 text-emerald-700' :
              status === 'busy' ? 'bg-amber-100 text-amber-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {statusLabels[status]}
            </span>
            <span className="text-xs text-gray-600">{patients} patients today</span>
          </div>

          {status !== 'available' && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Next: {nextAvailable}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors">
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}