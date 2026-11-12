import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, ScanFace, Lock, CheckCircle2 } from 'lucide-react';

interface LoginSplashProps {
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

export const LoginSplash: React.FC<LoginSplashProps> = ({ onLoginSuccess }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStage, setAuthStage] = useState<'idle' | 'scanning' | 'verified'>('idle');
  const [emailInput, setEmailInput] = useState('mohamed.baakak@cmc.ac.ma');

  const handleStartLogin = () => {
    setIsAuthenticating(true);
    setAuthStage('scanning');

    // Simulate Apple FaceID / Secure Enclave biometric handshake
    setTimeout(() => {
      setAuthStage('verified');
      setTimeout(() => {
        onLoginSuccess({
          name: 'Mohamed Baakak',
          email: emailInput,
        });
      }, 700);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F3F4F6] flex flex-col items-center justify-between p-6 select-none overflow-hidden animate-fade-in">
      {/* Top Bar Branding */}
      <div className="w-full max-w-md pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-sm">
            W
          </div>
          <span className="text-sm font-extrabold tracking-tight text-black">
            Wasselni CMC
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[11px] font-semibold text-gray-700 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Campus CMC</span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="w-full max-w-md my-auto py-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200/80 space-y-6 relative overflow-hidden">
          {/* Subtle top indicator */}
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto" />

          {/* Logo & Headline */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-black text-white mx-auto flex items-center justify-center shadow-md">
              <span className="text-3xl font-black tracking-tighter">W</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-black pt-2">
              Wasselni CMC
            </h1>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Exclusivement pour la communauté CMC
            </p>
          </div>

          {/* FaceID / Biometric Scanner Simulation */}
          {isAuthenticating ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-20 h-20 rounded-2xl border-2 border-black flex items-center justify-center">
                {authStage === 'scanning' ? (
                  <>
                    <ScanFace className="w-10 h-10 text-black animate-pulse" />
                    <div className="absolute inset-x-2 top-0 h-0.5 bg-black animate-bounce" />
                  </>
                ) : (
                  <CheckCircle2 className="w-10 h-10 text-black stroke-[2.5]" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-black">
                  {authStage === 'scanning'
                    ? 'Authentification biométrique CMC...'
                    : 'Identité vérifiée'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Accès sécurisé SSO @cmc.ac.ma
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Campus Credentials Preview */}
              <div className="bg-[#F3F4F6] rounded-xl p-3.5 border border-gray-100 space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Compte Académique Détecté
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-black truncate">
                    {emailInput}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white">
                    OFPPT CMC
                  </span>
                </div>
              </div>

              {/* Security Specs */}
              <div className="space-y-2 text-xs text-gray-500 px-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-black stroke-[2]" />
                  <span>Réservé aux étudiants & formateurs CMC</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-black stroke-[2]" />
                  <span>Authentification chiffrée SSO OFPPT</span>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="button"
                onClick={handleStartLogin}
                className="w-full py-4 px-6 rounded-xl bg-black hover:bg-gray-900 active:scale-[0.98] text-white font-bold text-sm tracking-normal transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Se connecter avec @cmc.ac.ma</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Signature */}
      <footer className="w-full text-center pb-2">
        <p className="text-[11px] font-medium text-gray-400">
          Architected by Baakak Lking Himself • Campus CMC 2027
        </p>
      </footer>
    </div>
  );
};
