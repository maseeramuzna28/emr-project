import { useState } from 'react';
import { Phone, Mail, MessageCircle, AlertTriangle, Send } from 'lucide-react';

const contacts = [
  { id: 1, name: 'Dr. Sarah Anderson', role: 'Cardiologist', phone: '+91 98765 43210', email: 'sarah@medicare.com', online: true },
  { id: 2, name: 'Dr. Michael Roberts', role: 'Pediatrician', phone: '+91 98765 43211', email: 'michael@medicare.com', online: true },
  { id: 3, name: 'Dr. Emily Chen', role: 'General Practitioner', phone: '+91 98765 43212', email: 'emily@medicare.com', online: false },
  { id: 4, name: 'Ambulance Service', role: 'Emergency', phone: '108', email: 'emergency@medicare.com', online: true },
];

export function EmergencyContact() {
  const [selected, setSelected] = useState(contacts[0]);
  const [messages, setMessages] = useState<{id:number, from:string, text:string, emergency:boolean}[]>([]);
  const [text, setText] = useState('');
  const [emergency, setEmergency] = useState(false);

  const send = () => {
    if (!text.trim()) return;
    setMessages(p => [...p, { id: Date.now(), from: 'You', text, emergency }]);
    setText('');
    setTimeout(() => {
      setMessages(p => [...p, {
        id: Date.now(),
        from: selected.name,
        text: emergency ? '🚨 Emergency received! Help is on the way!' : 'Message received. Will respond shortly.',
        emergency: false
      }]);
    }, 1000);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
        <AlertTriangle className="w-8 h-8 text-red-500" />
        Emergency Contacts
      </h1>
      <p className="text-gray-600 mb-6">Connect with doctors and emergency services instantly</p>

      <div className="grid grid-cols-3 gap-6">
        {/* Contacts */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-4 shadow-lg border border-white/30 space-y-3">
          {contacts.map(c => (
            <div
              key={c.id}
              onClick={() => { setSelected(c); setMessages([]); }}
              className={`p-3 rounded-xl cursor-pointer border transition-all ${selected.id === c.id ? 'bg-purple-50 border-purple-200' : 'bg-white/60 border-white/40'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {c.name.slice(0, 2)}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${c.online ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.role}</p>
                  <p className={`text-xs ${c.online ? 'text-emerald-600' : 'text-gray-400'}`}>{c.online ? '● Online' : '○ Offline'}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <a href={`tel:${c.phone}`} className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-blue-100 text-blue-600 text-xs">
                  <Phone className="w-3 h-3" /> Call
                </a>
                <a href={`mailto:${c.email}`} className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-purple-100 text-purple-600 text-xs">
                  <Mail className="w-3 h-3" /> Email
                </a>
                <button onClick={() => { setSelected(c); setMessages([]); }} className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-emerald-100 text-emerald-600 text-xs">
                  <MessageCircle className="w-3 h-3" /> Chat
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div className="col-span-2 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg border border-white/30 flex flex-col">
          <div className="p-4 border-b border-white/30 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{selected.name}</h4>
              <p className="text-xs text-gray-500">{selected.role} • {selected.phone}</p>
            </div>
            <a href={`tel:${selected.phone}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm">
              <Phone className="w-4 h-4" /> Emergency Call
            </a>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-64">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Send a message to {selected.name}</p>
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${m.emergency ? 'bg-red-500 text-white' : m.from === 'You' ? 'bg-purple-600 text-white' : 'bg-white text-gray-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/30">
            <button
              onClick={() => setEmergency(!emergency)}
              className={`mb-2 px-3 py-1 rounded-full text-xs ${emergency ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              {emergency ? '🚨 Emergency Mode ON' : 'Mark as Emergency'}
            </button>
            <div className="flex gap-2">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button onClick={send} className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}