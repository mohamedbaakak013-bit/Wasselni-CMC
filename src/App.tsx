import React, { useState } from 'react';
import { AppMode, DriverRide, BoardingPassData } from './types';
import { UberMap } from './components/UberMap';
import { StudentModule } from './components/StudentModule';
import { NavetteModule } from './components/NavetteModule';
import { DriverModule } from './components/DriverModule';
import { UberReceiptModal } from './components/UberReceiptModal';
import { Wallet, Plus, ChevronRight, Check } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('etudiant');
  const [balance, setBalance] = useState<number>(25);
  const [selectedRideId, setSelectedRideId] = useState<string>('ride-1');
  const [activePass, setActivePass] = useState<BoardingPassData | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);

  // Available drivers on the Takadoum ➔ CMC corridor
  const [rides, setRides] = useState<DriverRide[]>([
    {
      id: 'ride-1',
      driverName: 'Amine Benchekroun',
      driverRole: 'Stagiaire CMC',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      carModel: 'Dacia Sandero Stepway',
      carColor: 'Gris',
      rating: 4.9,
      totalTrips: 84,
      originId: 'takadoum',
      originName: 'Takadoum',
      destinationName: 'CMC Mghila',
      departureTime: '08:15',
      seatsTotal: 4,
      seatsAvailable: 2,
      priceMad: 5,
      verifiedStudent: true,
    },
    {
      id: 'ride-2',
      driverName: 'Dr. Imane Laroussi',
      driverRole: 'Formatrice CMC',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      carModel: 'Peugeot 208',
      carColor: 'Blanc',
      rating: 5.0,
      totalTrips: 112,
      originId: 'takadoum',
      originName: 'Takadoum',
      destinationName: 'CMC Mghila',
      departureTime: '08:25',
      seatsTotal: 4,
      seatsAvailable: 3,
      priceMad: 5,
      verifiedStudent: true,
    },
    {
      id: 'ride-3',
      driverName: 'Othmane Radi',
      driverRole: 'Stagiaire CMC',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      carModel: 'Renault Clio 4',
      carColor: 'Bleu',
      rating: 4.8,
      totalTrips: 45,
      originId: 'takadoum',
      originName: 'Takadoum',
      destinationName: 'CMC Mghila',
      departureTime: '08:30',
      seatsTotal: 4,
      seatsAvailable: 1,
      priceMad: 5,
      verifiedStudent: true,
    },
  ]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleConfirmStudent = () => {
    const ride = rides.find((r) => r.id === selectedRideId) || rides[0];
    if (balance < 5) {
      triggerToast('Solde insuffisant (Rechargez votre solde)');
      setShowRechargeModal(true);
      return;
    }

    setBalance((prev) => prev - 5);
    setActivePass({
      ticketId: `CMC-${Math.floor(1000 + Math.random() * 9000)}`,
      passengerName: 'Étudiant CMC',
      serviceType: 'Covoiturage Étudiant',
      origin: 'Takadoum',
      destination: 'CMC Mghila',
      departureTime: ride.departureTime,
      seatInfo: 'Place Avant Droit',
      driverOrVehicle: `${ride.driverName} (${ride.carModel})`,
      priceMad: 5,
      qrMatrix: [],
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    });
    triggerToast('Course confirmée • 5 MAD déduits');
  };

  const handleConfirmNavette = (seatId: number) => {
    if (balance < 5) {
      triggerToast('Solde insuffisant (Rechargez votre solde)');
      setShowRechargeModal(true);
      return;
    }

    setBalance((prev) => prev - 5);
    setActivePass({
      ticketId: `NAV-${Math.floor(2000 + Math.random() * 8000)}`,
      passengerName: 'Étudiant CMC',
      serviceType: 'Smart Navette CMC',
      origin: 'Takadoum',
      destination: 'CMC Mghila',
      departureTime: 'Dans 4 min',
      seatInfo: `Siège #0${seatId}`,
      driverOrVehicle: 'Grand Taxi Express #03',
      priceMad: 5,
      qrMatrix: [],
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    });
    triggerToast(`Siège #0${seatId} réservé • 5 MAD déduits`);
  };

  const handlePublishDriver = (seats: number, time: string) => {
    const newRide: DriverRide = {
      id: `ride-${Date.now()}`,
      driverName: 'Vous (Conducteur CMC)',
      driverRole: 'Stagiaire Conducteur',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      carModel: 'Votre Véhicule',
      carColor: 'Noir',
      rating: 5.0,
      totalTrips: 1,
      originId: 'takadoum',
      originName: 'Takadoum',
      destinationName: 'CMC Mghila',
      departureTime: time,
      seatsTotal: seats,
      seatsAvailable: seats,
      priceMad: 5,
      verifiedStudent: true,
    };

    setRides((prev) => [newRide, ...prev]);
    triggerToast(`Trajet publié avec ${seats} places disponibles`);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-black flex items-center justify-center p-0 sm:p-4 selection:bg-black selection:text-white">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Centered Clean Mobile Viewport (iPhone / Uber style) */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] bg-white relative sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between border-0 sm:border border-gray-200">
        {/* Top Floating Header over Map */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
          {/* Logo / Brand Pill */}
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-gray-200/80 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black" />
            <span className="text-xs font-extrabold tracking-tight text-black">
              Wasselni CMC
            </span>
          </div>

          {/* Wallet Balance Pill */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowRechargeModal(true)}
              className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-gray-200/80 text-xs font-bold text-black flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer"
            >
              <span className="text-gray-500 font-medium">Solde:</span>
              <span>{balance} MAD</span>
              <Plus className="w-3.5 h-3.5 stroke-[2.5] ml-0.5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Top Half: Grayscale Minimalist Map */}
        <div className="w-full relative">
          <UberMap originName="Takadoum" destinationName="CMC Mghila" />
        </div>

        {/* Overlapping Pristine White "Bottom Sheet" with soft natural drop shadow */}
        <div className="flex-1 bg-white rounded-t-3xl shadow-[0_-12px_30px_rgba(0,0,0,0.07)] -mt-6 relative z-20 px-5 pt-3 pb-4 flex flex-col justify-between">
          <div>
            {/* Soft Pull Indicator */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />

            {/* Segmented Control (Role Switcher) */}
            <div className="bg-[#F3F4F6] p-1 rounded-full flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setCurrentMode('etudiant')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentMode === 'etudiant'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black font-medium'
                }`}
              >
                Étudiant
              </button>

              <button
                type="button"
                onClick={() => setCurrentMode('navette')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentMode === 'navette'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black font-medium'
                }`}
              >
                Navette
              </button>

              <button
                type="button"
                onClick={() => setCurrentMode('conducteur')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentMode === 'conducteur'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black font-medium'
                }`}
              >
                Conducteur
              </button>
            </div>

            {/* Dynamic View Switched by Mode */}
            {currentMode === 'etudiant' && (
              <StudentModule
                rides={rides}
                selectedRideId={selectedRideId}
                onSelectRide={(id) => setSelectedRideId(id)}
                onConfirm={handleConfirmStudent}
              />
            )}

            {currentMode === 'navette' && (
              <NavetteModule onConfirmSeat={handleConfirmNavette} />
            )}

            {currentMode === 'conducteur' && (
              <DriverModule onPublish={handlePublishDriver} />
            )}
          </div>

          {/* Ownership Branding: Subtle, tiny text label at very bottom */}
          <div className="pt-4 text-center">
            <p className="text-[11px] font-medium text-gray-400">
              Architected by Mohamed &amp; Doaa • CMC 2026
            </p>
          </div>
        </div>

        {/* Confirmation Receipt Modal */}
        <UberReceiptModal
          pass={activePass}
          onClose={() => setActivePass(null)}
        />

        {/* Simple Recharge Wallet Modal */}
        {showRechargeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-gray-100 space-y-4">
              <h4 className="text-sm font-bold text-black">
                Recharger le Solde
              </h4>
              <p className="text-xs text-gray-500">
                Solde actuel : <strong>{balance} MAD</strong>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 50].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setBalance((prev) => prev + amt);
                      setShowRechargeModal(false);
                      triggerToast(`+${amt} MAD ajoutés au solde`);
                    }}
                    className="py-2 rounded-lg bg-[#F3F4F6] hover:bg-gray-200 text-xs font-bold text-black border border-gray-200 cursor-pointer"
                  >
                    +{amt} MAD
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRechargeModal(false)}
                className="w-full py-2 text-xs font-medium text-gray-500 hover:text-black cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
