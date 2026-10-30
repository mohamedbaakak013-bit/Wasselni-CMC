import React, { useState } from 'react';
import { NavetteSeat } from '../types';
import { ArrowRight, Users, Clock } from 'lucide-react';

interface NavetteModuleProps {
  onConfirmSeat: (seatId: number) => void;
}

export const NavetteModule: React.FC<NavetteModuleProps> = ({ onConfirmSeat }) => {
  const [seats, setSeats] = useState<NavetteSeat[]>([
    { id: 1, label: 'Siège 01', status: 'occupied' },
    { id: 2, label: 'Siège 02', status: 'empty' },
    { id: 3, label: 'Siège 03', status: 'occupied' },
    { id: 4, label: 'Siège 04', status: 'selected' },
    { id: 5, label: 'Siège 05', status: 'occupied' },
    { id: 6, label: 'Siège 06', status: 'empty' },
    { id: 7, label: 'Siège 07', status: 'occupied' },
    { id: 8, label: 'Siège 08', status: 'empty' },
  ]);

  const selectedSeat = seats.find((s) => s.status === 'selected');
  const occupiedCount = seats.filter((s) => s.status === 'occupied').length + (selectedSeat ? 1 : 0);

  const toggleSeat = (id: number) => {
    const target = seats.find((s) => s.id === id);
    if (!target || target.status === 'occupied') return;

    setSeats((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return { ...s, status: s.status === 'selected' ? 'empty' : 'selected' };
        }
        if (s.status === 'selected') {
          return { ...s, status: 'empty' };
        }
        return s;
      })
    );
  };

  const selectedNumberFormatted = selectedSeat
    ? `#0${selectedSeat.id}`
    : '#--';

  return (
    <div className="space-y-4">
      {/* Route & Status Header */}
      <div className="bg-[#F3F4F6] p-3.5 rounded-xl border border-gray-100 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-black">
            Smart Navette CMC (Grand Taxi Express)
          </div>
          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
            <span>Départ dans 4 min</span>
            <span>·</span>
            <span>{occupiedCount}/8 Occupés</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-medium text-gray-500 uppercase">
            Prix
          </span>
          <div className="text-sm font-bold text-black">5 MAD</div>
        </div>
      </div>

      {/* Minimalist Top-down Seat Selection UI */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white">
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border border-black bg-white" />
            <span>Libre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-black text-white flex items-center justify-center text-[9px] font-bold">
              ✓
            </div>
            <span className="font-semibold text-black">Sélectionné</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200 text-gray-400 flex items-center justify-center text-[9px]">
              ✕
            </div>
            <span>Occupé</span>
          </div>
        </div>

        {/* Vehicle Top-down Outline */}
        <div className="max-w-[280px] mx-auto p-4 rounded-2xl border border-gray-200 bg-gray-50/50">
          {/* Front Row (Driver + Seat 01) */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
            {/* Driver */}
            <div className="w-14 h-11 rounded-lg bg-gray-200 flex flex-col items-center justify-center text-gray-600">
              <span className="text-[10px] font-bold">Chauffeur</span>
            </div>

            {/* Seat 1 */}
            <button
              type="button"
              onClick={() => toggleSeat(1)}
              disabled={seats[0].status === 'occupied'}
              className={`w-14 h-11 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                seats[0].status === 'selected'
                  ? 'bg-black text-white'
                  : seats[0].status === 'occupied'
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through'
                  : 'bg-white border border-black text-black hover:bg-gray-50'
              }`}
            >
              #01
            </button>
          </div>

          {/* Middle Row (Seats 02, 03, 04) */}
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            {[seats[1], seats[2], seats[3]].map((seat) => {
              const isSelected = seat.status === 'selected';
              const isOccupied = seat.status === 'occupied';
              return (
                <button
                  key={seat.id}
                  type="button"
                  onClick={() => toggleSeat(seat.id)}
                  disabled={isOccupied}
                  className={`h-11 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-black text-white'
                      : isOccupied
                      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : 'bg-white border border-black text-black hover:bg-gray-50'
                  }`}
                >
                  {isOccupied ? (
                    <span className="text-gray-400 text-xs">✕ #{seat.id}</span>
                  ) : (
                    <span>#0{seat.id}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Back Row (Seats 05, 06, 07, 08) */}
          <div className="grid grid-cols-4 gap-2">
            {[seats[4], seats[5], seats[6], seats[7]].map((seat) => {
              const isSelected = seat.status === 'selected';
              const isOccupied = seat.status === 'occupied';
              return (
                <button
                  key={seat.id}
                  type="button"
                  onClick={() => toggleSeat(seat.id)}
                  disabled={isOccupied}
                  className={`h-11 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-black text-white'
                      : isOccupied
                      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : 'bg-white border border-black text-black hover:bg-gray-50'
                  }`}
                >
                  {isOccupied ? (
                    <span className="text-gray-400 text-[10px]">✕ #{seat.id}</span>
                  ) : (
                    <span>#0{seat.id}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Black CTA Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (selectedSeat) onConfirmSeat(selectedSeat.id);
          }}
          disabled={!selectedSeat}
          className={`w-full py-4 px-6 rounded-lg font-bold text-base transition-transform flex items-center justify-center gap-2 ${
            selectedSeat
              ? 'bg-black hover:bg-gray-900 text-white cursor-pointer active:scale-[0.99]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>
            {selectedSeat
              ? `Réserver Siège ${selectedNumberFormatted} • 5 MAD`
              : 'Choisissez un siège'}
          </span>
          {selectedSeat && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
        </button>
      </div>
    </div>
  );
};
