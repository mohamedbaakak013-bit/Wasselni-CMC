import React, { useState, useEffect } from 'react';
import { Share2, AlertTriangle, CheckCircle, Navigation, Shield, ArrowLeft } from 'lucide-react';
import { BoardingPassData } from '../types';

interface ActiveRideViewProps {
  rideData: BoardingPassData;
  onFinishRide: () => void;
  onOpenSOS: () => void;
  onShareRoute: () => void;
}

export const ActiveRideView: React.FC<ActiveRideViewProps> = ({
  rideData,
  onFinishRide,
  onOpenSOS,
  onShareRoute,
}) => {
  const [etaMinutes, setEtaMinutes] = useState(3);
  const [etaSeconds, setEtaSeconds] = useState(48);

  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev > 0) return prev - 1;
        setEtaMinutes((m) => (m > 1 ? m - 1 : 1));
        return 59;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#F3F4F6] flex flex-col justify-between overflow-y-auto animate-fade-in select-none">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onFinishRide}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-black cursor-pointer transition-colors"
            title="Retour"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                Course En Cours
              </h2>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              Direction {rideData.destination}
            </p>
          </div>
        </div>

        {/* ETA Pill */}
        <div className="bg-black text-white px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-sm text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Arrive dans {etaMinutes} min{' '}
            <span className="opacity-70 font-normal">
              ({etaSeconds < 10 ? `0${etaSeconds}` : etaSeconds}s)
            </span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto px-4 py-6 space-y-5 flex-1 flex flex-col justify-center">
        {/* Crisp High-Contrast QR Code Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/80 flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-between w-full pb-2 border-b border-gray-100 text-xs">
            <span className="font-semibold text-gray-500">Ticket Boarding Pass</span>
            <span className="font-mono font-bold text-black">{rideData.ticketId}</span>
          </div>

          {/* Crisp QR Code Vector */}
          <div className="p-4 bg-white rounded-2xl border-2 border-black/10 shadow-sm">
            <svg
              className="w-44 h-44 sm:w-48 sm:h-48"
              viewBox="0 0 29 29"
              shapeRendering="crispEdges"
            >
              {/* Outer corner position markers */}
              <rect x="0" y="0" width="7" height="7" fill="#000000" />
              <rect x="1" y="1" width="5" height="5" fill="#ffffff" />
              <rect x="2" y="2" width="3" height="3" fill="#000000" />

              <rect x="22" y="0" width="7" height="7" fill="#000000" />
              <rect x="23" y="1" width="5" height="5" fill="#ffffff" />
              <rect x="24" y="2" width="3" height="3" fill="#000000" />

              <rect x="0" y="22" width="7" height="7" fill="#000000" />
              <rect x="1" y="23" width="5" height="5" fill="#ffffff" />
              <rect x="2" y="24" width="3" height="3" fill="#000000" />

              {/* Data blocks */}
              <rect x="9" y="1" width="2" height="2" fill="#000000" />
              <rect x="13" y="0" width="3" height="2" fill="#000000" />
              <rect x="18" y="1" width="2" height="2" fill="#000000" />
              <rect x="9" y="4" width="1" height="3" fill="#000000" />
              <rect x="12" y="5" width="2" height="2" fill="#000000" />
              <rect x="16" y="4" width="3" height="2" fill="#000000" />

              <rect x="0" y="9" width="3" height="2" fill="#000000" />
              <rect x="5" y="10" width="2" height="3" fill="#000000" />
              <rect x="9" y="9" width="3" height="3" fill="#000000" />
              <rect x="14" y="9" width="2" height="2" fill="#000000" />
              <rect x="18" y="8" width="2" height="4" fill="#000000" />
              <rect x="22" y="10" width="3" height="2" fill="#000000" />
              <rect x="26" y="9" width="3" height="3" fill="#000000" />

              <rect x="2" y="14" width="2" height="2" fill="#000000" />
              <rect x="6" y="15" width="2" height="2" fill="#000000" />
              <rect x="10" y="14" width="4" height="4" fill="#000000" />
              <rect x="16" y="13" width="3" height="2" fill="#000000" />
              <rect x="21" y="14" width="3" height="3" fill="#000000" />
              <rect x="25" y="15" width="2" height="3" fill="#000000" />

              <rect x="0" y="18" width="2" height="2" fill="#000000" />
              <rect x="4" y="19" width="3" height="2" fill="#000000" />
              <rect x="9" y="20" width="2" height="3" fill="#000000" />
              <rect x="13" y="19" width="4" height="2" fill="#000000" />
              <rect x="19" y="19" width="3" height="2" fill="#000000" />
              <rect x="24" y="20" width="2" height="2" fill="#000000" />

              <rect x="9" y="24" width="3" height="3" fill="#000000" />
              <rect x="14" y="23" width="2" height="4" fill="#000000" />
              <rect x="18" y="25" width="4" height="2" fill="#000000" />
              <rect x="24" y="24" width="3" height="3" fill="#000000" />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-black uppercase tracking-wider">
              Présentez ce QR au Conducteur
            </p>
            <p className="text-[11px] text-gray-500">
              Validation automatique de la montée par scan
            </p>
          </div>
        </div>

        {/* Driver & Vehicle Information Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                {rideData.driverOrVehicle.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-black leading-tight">
                  {rideData.driverOrVehicle}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {rideData.seatInfo} · {rideData.serviceType}
                </p>
              </div>
            </div>

            {/* Price Badge */}
            <div className="text-right">
              <span className="text-base font-black text-black">
                {rideData.priceMad} MAD
              </span>
              <div className="text-[10px] text-gray-400 font-medium">
                Solde Déduit
              </div>
            </div>
          </div>

          {/* Moroccan License Plate Automotive Card */}
          <div className="bg-[#F3F4F6] rounded-xl p-2.5 flex items-center justify-between border border-gray-200/80">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Matricule Véhicule
            </span>
            <div className="bg-white px-3 py-1 rounded-md border border-gray-300 font-mono font-bold text-xs tracking-wider text-black shadow-2xs">
              12345 | A | 1
            </div>
          </div>

          {/* Route Micro-Timeline */}
          <div className="pt-1 flex items-center justify-between text-xs text-gray-600 font-medium">
            <span>Départ : {rideData.origin}</span>
            <span className="text-gray-300">➔</span>
            <span className="font-bold text-black">{rideData.destination}</span>
          </div>
        </div>

        {/* FLOW 4: Safety Center Floating Bottom Row */}
        <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-200 flex items-center justify-between gap-3">
          {/* Share Route */}
          <button
            type="button"
            onClick={onShareRoute}
            className="flex-1 py-3 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-black text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Share2 className="w-4 h-4 text-black stroke-[2]" />
            <span>Partager ma route</span>
          </button>

          {/* SOS: The ONLY subtle red accent in the whole app */}
          <button
            type="button"
            onClick={onOpenSOS}
            className="py-3 px-5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-red-600 stroke-[2.5]" />
            <span>SOS</span>
          </button>
        </div>

        {/* Finish Ride Action */}
        <div>
          <button
            type="button"
            onClick={onFinishRide}
            className="w-full py-4 px-6 rounded-xl bg-black hover:bg-gray-900 active:scale-[0.99] text-white font-bold text-sm tracking-normal transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <CheckCircle className="w-4 h-4 stroke-[2]" />
            <span>Terminer la course</span>
          </button>
        </div>
      </div>

      {/* Floating Signature */}
      <footer className="w-full text-center pb-4 pt-2">
        <p className="text-[11px] font-medium text-gray-400">
          Architected by Mohamed & Doaa • CMC 2026
        </p>
      </footer>
    </div>
  );
};
