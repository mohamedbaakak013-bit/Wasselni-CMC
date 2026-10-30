import React from 'react';
import { BoardingPassData } from '../types';
import { Check, X, Clock, MapPin, Car, Shield } from 'lucide-react';

interface UberReceiptModalProps {
  pass: BoardingPassData | null;
  onClose: () => void;
}

export const UberReceiptModal: React.FC<UberReceiptModalProps> = ({ pass, onClose }) => {
  if (!pass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-slide-up border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-black leading-tight">
                Trajet Confirmé
              </h4>
              <p className="text-xs text-gray-500">Ticket #{pass.ticketId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimalist QR Code Box */}
        <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center">
          {/* Black & White Clean SVG Matrix */}
          <div className="p-2 bg-white rounded-xl shadow-xs border border-gray-200">
            <svg className="w-28 h-28" viewBox="0 0 25 25">
              {/* Corner squares */}
              <rect x="0" y="0" width="7" height="7" fill="#000000" />
              <rect x="1" y="1" width="5" height="5" fill="#ffffff" />
              <rect x="2" y="2" width="3" height="3" fill="#000000" />

              <rect x="18" y="0" width="7" height="7" fill="#000000" />
              <rect x="19" y="1" width="5" height="5" fill="#ffffff" />
              <rect x="20" y="2" width="3" height="3" fill="#000000" />

              <rect x="0" y="18" width="7" height="7" fill="#000000" />
              <rect x="1" y="19" width="5" height="5" fill="#ffffff" />
              <rect x="2" y="20" width="3" height="3" fill="#000000" />

              {/* Data modules */}
              <rect x="9" y="2" width="2" height="2" fill="#000000" />
              <rect x="13" y="1" width="2" height="3" fill="#000000" />
              <rect x="10" y="6" width="3" height="2" fill="#000000" />
              <rect x="2" y="9" width="2" height="4" fill="#000000" />
              <rect x="9" y="10" width="4" height="4" fill="#000000" />
              <rect x="15" y="9" width="3" height="2" fill="#000000" />
              <rect x="19" y="10" width="4" height="2" fill="#000000" />
              <rect x="10" y="16" width="2" height="3" fill="#000000" />
              <rect x="14" y="14" width="3" height="3" fill="#000000" />
              <rect x="18" y="15" width="2" height="4" fill="#000000" />
              <rect x="9" y="21" width="3" height="3" fill="#000000" />
              <rect x="14" y="20" width="2" height="3" fill="#000000" />
              <rect x="18" y="21" width="4" height="2" fill="#000000" />
              <rect x="22" y="18" width="2" height="2" fill="#000000" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-500 mt-2">
            Présentez ce QR au départ
          </span>
        </div>

        {/* Details list */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Service</span>
            <span className="font-bold text-black">{pass.serviceType}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Itinéraire</span>
            <span className="font-bold text-black">{pass.origin} ➔ CMC</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Véhicule</span>
            <span className="font-bold text-black">{pass.driverOrVehicle}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Place assignée</span>
            <span className="font-bold text-black bg-gray-100 px-2 py-0.5 rounded">
              {pass.seatInfo}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-gray-500 font-medium">Montant payé</span>
            <span className="font-black text-sm text-black">{pass.priceMad} MAD</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-lg bg-black hover:bg-gray-900 active:scale-[0.99] text-white font-bold text-sm transition-transform cursor-pointer"
        >
          Terminé
        </button>
      </div>
    </div>
  );
};
