import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down';
  color: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
  color,
}: StatCardProps) {

  const handleClick = () => {
    if (title === 'Total Patients') {
      alert('Opening Patients Records...');
    } 
    
    else if (title === 'Appointments Today') {
      alert('Opening Appointments Page...');
    } 
    
    else if (title === 'Critical Cases') {
      alert('Opening Emergency Cases...');
    } 
    
    else if (title === 'Success Rate') {
      alert('Opening Analytics Dashboard...');
    } 
    
    else {
      alert(title);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full text-left"
    >
      <div className="flex items-start justify-between mb-4">

        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <span
          className={`text-sm px-2 py-1 rounded-full ${
            trend === 'up'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {change}
        </span>

      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">
          {title}
        </p>

        <h3 className="text-3xl font-semibold text-gray-900">
          {value}
        </h3>
      </div>
    </button>
  );
}