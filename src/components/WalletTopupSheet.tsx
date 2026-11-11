import React from 'react';
import { X, CreditCard, Store, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';

interface WalletTopupSheetProps {
  isOpen: boolean;
  balance: number;
  onClose: () => void;
  onTopup: (amount: number, method: string) => void;
}

export const WalletTopupSheet: React.FC<WalletTopupSheetProps> = ({
  isOpen,
  balance,
  onClose,
  onTopup,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs select-none animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up Bottom Sheet Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-6 z-10 transform transition-transform duration-300 ease-out translate-y-0">
        {/* Drag handle pill */}
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h3 className="text-lg font-bold text-black tracking-tight">
              Recharger le Portefeuille
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Alimentez votre compte étudiant sans frais
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Massive Balance Display */}
        <div className="bg-[#F3F4F6] rounded-2xl p-5 border border-gray-100 text-center space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-gray-600" />
            Solde Actuel Disponible
          </span>
          <div className="text-4xl sm:text-5xl font-black text-black tracking-tight">
            {balance} <span className="text-xl sm:text-2xl font-bold text-gray-600">MAD</span>
          </div>
          <p className="text-[11px] text-gray-400">
            Valable pour covoiturage & navettes Grand Taxi
          </p>
        </div>

        {/* 3 Rounded-Square Quick-Add Buttons */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-black uppercase tracking-wider">
            Recharge Rapide
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[20, 50, 100].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onTopup(amt, 'Recharge Rapide')}
                className="py-4 px-3 rounded-2xl bg-white hover:bg-black hover:text-white border-2 border-gray-200 hover:border-black transition-all cursor-pointer text-center group active:scale-[0.97]"
              >
                <div className="text-lg font-black text-black group-hover:text-white transition-colors">
                  +{amt}
                </div>
                <div className="text-[11px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors">
                  MAD
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Integration Rows */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-black uppercase tracking-wider">
            Moyens de Paiement Marocains
          </div>

          {/* Row 1: CashPlus / Wafacash */}
          <button
            type="button"
            onClick={() => onTopup(50, 'CashPlus / Wafacash')}
            className="w-full p-3.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-left flex items-center justify-between cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                <Store className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-xs font-bold text-black">
                  CashPlus / Wafacash
                </div>
                <p className="text-[11px] text-gray-500">
                  Dépôt d'espèces sans carte en agence
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Row 2: Carte Bancaire (CIH, Attijari) */}
          <button
            type="button"
            onClick={() => onTopup(50, 'Carte Bancaire')}
            className="w-full p-3.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-left flex items-center justify-between cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                <CreditCard className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-xs font-bold text-black">
                  Carte Bancaire (CIH, Attijari)
                </div>
                <p className="text-[11px] text-gray-500">
                  Recharge instantanée 3D-Secure
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-black" />
          <span>Transactions certifiées CMI Maroc · 0% de frais</span>
        </div>
      </div>
    </div>
  );
};
