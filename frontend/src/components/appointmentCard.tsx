import { Clock, MapPin, Video } from 'lucide-react';

interface AppointmentCardProps {
  patientName: string;
  time: string;
  type: 'in-person' | 'virtual';
  reason: string;
  avatar: string;
}

export function AppointmentCard({ patientName, time, type, reason, avatar }: AppointmentCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-md border border-white/40 hover:bg-white/70 transition-all duration-200">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white">
        {avatar}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{patientName}</h4>
        <p className="text-sm text-gray-600 truncate">{reason}</p>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
        {type === 'virtual' ? (
          <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            <Video className="w-3 h-3" />
            Virtual
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
            <MapPin className="w-3 h-3" />
            In-person
          </span>
        )}
      </div>
    </div>
  );
}