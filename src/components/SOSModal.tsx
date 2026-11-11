import React from 'react';
import { X, Phone, ShieldAlert, MapPin, AlertTriangle } from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCallSuccess: (service: string) => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  onCallSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs select-none animate-fade-in p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-5 z-10">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black tracking-tight">
                Centre de Sécurité & Urgence
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Campus CMC Béni Mellal · Assistance 24/7
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live GPS Telemetry Pill */}
        <div className="bg-[#F3F4F6] rounded-xl p-3 border border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-black font-semibold">
            <MapPin className="w-3.5 h-3.5 text-black" />
            <span>Position GPS Transmise :</span>
          </div>
          <span className="font-mono text-[11px] font-bold text-black">
            32.3394° N, 6.3608° W
          </span>
        </div>

        {/* Emergency Contacts List */}
        <div className="space-y-2.5">
          {/* Sécurité Campus CMC */}
          <button
            type="button"
            onClick={() => onCallSuccess('Sécurité Campus CMC')}
            className="w-full p-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-between text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-black">
                  Poste de Sécurité CMC Mghila
                </div>
                <div className="text-[11px] text-gray-500">
                  Intervention rapide sur le corridor
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-black px-2.5 py-1 rounded bg-gray-100">
              05 23 00 00 00
            </span>
          </button>

          {/* Police Secours */}
          <button
            type="button"
            onClick={() => onCallSuccess('Police Secours')}
            className="w-full p-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-between text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 text-black flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-black">
                  Police Secours (Béni Mellal)
                </div>
                <div className="text-[11px] text-gray-500">
                  Ligne directe nationale
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-black px-3 py-1 rounded bg-gray-100">
              19
            </span>
          </button>

          {/* Protection Civile */}
          <button
            type="button"
            onClick={() => onCallSuccess('Protection Civile')}
            className="w-full p-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-between text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 text-black flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-black">
                  Protection Civile (Ambulance)
                </div>
                <div className="text-[11px] text-gray-500">
                  Urgences médicales & secours
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-black px-3 py-1 rounded bg-gray-100">
              15
            </span>
          </button>
        </div>

        {/* Direct Emergency Dispatch Button */}
        <button
          type="button"
          onClick={() => onCallSuccess('Alerte Sécurité Déclenchée')}
          className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs tracking-normal transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Alerter Immédiatement le Campus CMC</span>
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          Votre trajet et identité OFPPT sont partagés avec le poste de commandement.
        </p>
      </div>
    </div>
  );
};
