import React, { useState } from 'react';
import { DriverRide } from '../types';
import { ArrowRight, Star, Check } from 'lucide-react';

interface StudentModuleProps {
  rides: DriverRide[];
  selectedRideId: string;
  onSelectRide: (rideId: string) => void;
  onConfirm: () => void;
}

export const StudentModule: React.FC<StudentModuleProps> = ({
  rides,
  selectedRideId,
  onSelectRide,
  onConfirm,
}) => {
  const currentRide = rides.find((r) => r.id === selectedRideId) || rides[0];

  return (
    <div className="space-y-4">
      {/* Uber-style Pick-up / Drop-off Input Box */}
      <div className="bg-[#F3F4F6] p-3.5 rounded-xl border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex flex-col items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-black" />
            <div className="w-0.5 h-5 bg-gray-300 my-0.5" />
            <div className="w-2.5 h-2.5 rounded-sm bg-black" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="text-xs font-semibold text-black truncate">
              Takadoum, Béni Mellal
            </div>
            <div className="text-xs font-semibold text-black truncate">
              CMC : Cité des Métiers et des Compétences
            </div>
          </div>
        </div>

        <div className="text-right pl-2">
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
            Tarif Fixe
          </span>
          <div className="text-sm font-bold text-black">5 MAD</div>
        </div>
      </div>

      {/* Driver List Header */}
      <div className="flex items-center justify-between pt-1">
        <h3 className="text-sm font-bold text-black tracking-tight">
          Conducteurs Disponibles
        </h3>
        <span className="text-xs font-medium text-gray-500">
          {rides.length} en route
        </span>
      </div>

      {/* Vertical list of available drivers */}
      <div className="space-y-2 max-h-[220px] md:max-h-[300px] lg:max-h-[380px] overflow-y-auto pr-0.5">
        {rides.map((ride) => {
          const isSelected = ride.id === (currentRide?.id || '');
          return (
            <button
              key={ride.id}
              onClick={() => onSelectRide(ride.id)}
              type="button"
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between border cursor-pointer ${
                isSelected
                  ? 'bg-black text-white border-black'
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-black'
              }`}
            >
              {/* Left: Avatar + Details */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={ride.avatar}
                  alt={ride.driverName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm font-bold truncate ${
                        isSelected ? 'text-white' : 'text-black'
                      }`}
                    >
                      {ride.driverName}
                    </span>
                    <div className="flex items-center text-xs opacity-75">
                      <Star className="w-3 h-3 fill-current ml-0.5" />
                      <span className="text-[11px] ml-0.5 font-medium">
                        {ride.rating}
                      </span>
                    </div>
                  </div>

                  <p
                    className={`text-xs truncate ${
                      isSelected ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {ride.carModel} · Départ {ride.departureTime}
                  </p>
                </div>
              </div>

              {/* Right: Price */}
              <div className="text-right pl-3 flex-shrink-0">
                <div
                  className={`text-base font-bold ${
                    isSelected ? 'text-white' : 'text-black'
                  }`}
                >
                  {ride.priceMad} MAD
                </div>
                <div
                  className={`text-[10px] ${
                    isSelected ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {ride.seatsAvailable} {ride.seatsAvailable > 1 ? 'places' : 'place'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Massive Pitch-Black CTA Button */}
      <div className="pt-2">
        <button
          onClick={onConfirm}
          className="w-full py-4 px-6 rounded-lg bg-black hover:bg-gray-900 active:scale-[0.99] text-white font-bold text-base tracking-normal transition-transform cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Confirmer • 5 MAD</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
