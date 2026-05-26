import { Clock, Activity, AlertCircle } from 'lucide-react';

interface PatientCardProps {
  name: string;
  age: number;
  condition: string;
  status: 'stable' | 'critical' | 'monitoring';
  lastVisit: string;
  avatar: string;
}

export function PatientCard({ name, age, condition, status, lastVisit, avatar }: PatientCardProps) {
  const statusColors = {
    stable: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    critical: 'bg-red-100 text-red-700 border-red-200',
    monitoring: 'bg-amber-100 text-amber-700 border-amber-200'
  };

  const statusIcons = {
    stable: Activity,
    critical: AlertCircle,
    monitoring: Clock
  };

  const StatusIcon = statusIcons[status];

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-lg p-5 shadow-md border border-white/30 hover:shadow-lg transition-all duration-300 hover:bg-white/80">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg">
            {avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${statusColors[status]}`}>
            <StatusIcon className="w-3 h-3" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{name}</h4>
          <p className="text-sm text-gray-600">Age: {age}</p>
          <p className="text-sm text-gray-700 mt-1 truncate">{condition}</p>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{lastVisit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}