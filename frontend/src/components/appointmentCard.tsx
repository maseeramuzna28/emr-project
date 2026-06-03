import React from 'react';

interface AppointmentCardProps {
  patientName: string;
  time: string;
  type: 'virtual' | 'in-person';
  reason: string;
  avatar: string;
}

export default function AppointmentCard({
  patientName,
  time,
  type,
  reason,
  avatar,
}: AppointmentCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-semibold">
          {avatar}
        </div>

        <div>
          <h3 className="font-bold text-lg">{patientName}</h3>
          <p className="text-gray-600">{reason}</p>
          <p className="text-gray-500 text-sm">{time}</p>
          <p className="text-purple-600 text-sm capitalize">{type}</p>
        </div>
      </div>
    </div>
  );
}