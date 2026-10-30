import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface DriverModuleProps {
  onPublish: (seats: number, time: string) => void;
}

export const DriverModule: React.FC<DriverModuleProps> = ({ onPublish }) => {
  const [seats, setSeats] = useState(3);
  const [time, setTime] = useState('08:00');
  const [published, setPublished] = useState(false);

  // Financial calculations
  const pricePerSeat = 5;
  const gross = seats * pricePerSeat;
  const driverCut = gross * 0.90; // 90%
  const fuelCoverage = Math.min(100, Math.round((driverCut / 16) * 100)); // 16 MAD est. diesel A/R

  const handlePublish = () => {
    setPublished(true);
    onPublish(seats, time);
    setTimeout(() => setPublished(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Earnings Dashboard Box */}
      <div className="bg-[#F3F4F6] p-4 rounded-xl border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Gain Net Estimé
            </span>
            <div className="text-3xl font-black text-black tracking-tight mt-0.5">
              +{driverCut.toFixed(1)} <span className="text-base font-bold text-gray-600">MAD</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Takadoum ➔ CMC Mghila (Aller simple)
            </p>
          </div>

          <div className="text-right">
            <span className="px-2.5 py-1 rounded bg-black text-white text-xs font-bold">
              90% Net
            </span>
          </div>
        </div>

        {/* Minimal Progress Bar (Black on Gray track) */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-gray-700">Carburant Amorti</span>
            <span className="text-black font-bold">{fuelCoverage}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-300"
              style={{ width: `${fuelCoverage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Seat Selection Slider */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="uber-seats-slider" className="text-xs font-bold text-black">
            Places disponibles dans votre voiture
          </label>
          <span className="text-sm font-bold text-black bg-gray-100 px-2 py-0.5 rounded">
            {seats} {seats > 1 ? 'places' : 'place'}
          </span>
        </div>

        <input
          id="uber-seats-slider"
          type="range"
          min="1"
          max="4"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />

        <div className="flex justify-between text-[11px] text-gray-400 font-medium px-0.5">
          <span>1 (5 MAD)</span>
          <span>2 (10 MAD)</span>
          <span>3 (15 MAD)</span>
          <span>4 (20 MAD)</span>
        </div>
      </div>

      {/* Departure Time Slots */}
      <div className="border border-gray-200 rounded-xl p-3.5 bg-white">
        <span className="text-xs font-bold text-black block mb-2">
          Heure de départ
        </span>
        <div className="flex items-center gap-2">
          {['07:45', '08:00', '08:15', '12:30', '13:45'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTime(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                time === t
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          onClick={handlePublish}
          className="w-full py-4 px-6 rounded-lg bg-black hover:bg-gray-900 active:scale-[0.99] text-white font-bold text-base transition-transform cursor-pointer flex items-center justify-center gap-2"
        >
          {published ? (
            <>
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Trajet Publié avec Succès !</span>
            </>
          ) : (
            <>
              <span>Publier le Trajet • {seats} {seats > 1 ? 'Places' : 'Place'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
