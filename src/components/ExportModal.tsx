import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { Download, Copy, Check, X, FileCode, Sparkles } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wasselni CMC — Transit Spatial Béni Mellal</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Space Grotesk & Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #050505; color: #f1f5f9; overflow-x: hidden; }
    h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; }
    .glass-panel { background: rgba(15, 17, 23, 0.7); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .hologram-card { background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(16,185,129,0.05), rgba(6,182,212,0.05)); backdrop-filter: blur(28px); border: 1px solid rgba(255,255,255,0.12); }
    @keyframes pulseAura { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 0.8; } }
    .aurora-glow { animation: pulseAura 10s ease-in-out infinite alternate; }
  </style>
</head>
<body class="min-h-screen relative pb-32">
  <!-- Interactive Aurora Backdrop -->
  <div class="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
    <div id="aurora1" class="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 bg-emerald-500/50 -top-32 -left-32 aurora-glow"></div>
    <div id="aurora2" class="absolute w-[500px] h-[500px] rounded-full blur-[130px] opacity-30 bg-cyan-500/40 top-1/2 -right-32 aurora-glow"></div>
  </div>

  <header class="max-w-5xl mx-auto px-4 pt-6 pb-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-black text-lg shadow-[0_0_20px_rgba(16,185,129,0.6)]">W</div>
      <div>
        <h1 class="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">WASSELNI <span class="text-emerald-400">CMC</span></h1>
        <p class="text-[11px] font-mono text-cyan-400">Transit Spatial · Béni Mellal ➔ Mghila</p>
      </div>
    </div>
    <div class="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-emerald-300">
      Solde: <strong id="headerBalance">25</strong> MAD
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 space-y-6">
    <!-- Map Section -->
    <div class="glass-panel p-4 rounded-3xl relative overflow-hidden">
      <div class="flex items-center justify-between mb-2 text-xs font-mono text-emerald-400">
        <span>BÉNI MELLAL (TAKADOUM) ➔ CMC (9.4 KM · 12 MIN)</span>
        <span>VIA CONTOURNEMENT</span>
      </div>
      <div class="h-64 rounded-2xl bg-[#080b12] relative overflow-hidden border border-white/5 flex items-center justify-center">
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <!-- Real Contournement de Béni Mellal Route to CMC -->
          <path d="M 80.5,33.5 L 74.5,28.5 L 67.5,25.5 L 60.5,31.5 L 55.5,48.0 L 49.0,56.5 L 44.0,63.5 L 42.5,59.5" stroke="#10b981" stroke-width="2.5" fill="none"/>
          <!-- N8 Highway -->
          <path d="M 88,17 L 80.5,33.5 L 69.0,44.0 L 65.5,50.0 L 59.5,60.5 L 48.5,77.0" stroke="rgba(59,130,246,0.5)" stroke-width="1.5" fill="none" stroke-dasharray="2,2"/>
        </svg>
        <button onclick="selectOrigin('Takadoum')" class="absolute left-[80.5%] top-[33.5%] -translate-x-1/2 -translate-y-1/2 px-2 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400 rounded-lg text-xs font-mono">Takadoum (Départ)</button>
        <div class="absolute left-[42.5%] top-[59.5%] -translate-x-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-black font-bold rounded-xl text-xs shadow-[0_0_20px_#10b981]">CMC : Cité des Compétences</div>
      </div>
    </div>

    <!-- Active Mode Container -->
    <div id="modeContent"></div>
  </main>

  <!-- Dynamic Island Nav -->
  <div class="fixed bottom-4 left-0 right-0 z-40 flex flex-col items-center">
    <div class="p-1.5 rounded-full bg-[#0a0d16]/90 backdrop-blur-3xl border border-white/15 flex items-center gap-2">
      <button onclick="switchMode('etudiant')" id="btn-etudiant" class="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-black">🎓 Étudiant</button>
      <button onclick="switchMode('navette')" id="btn-navette" class="px-4 py-2 rounded-full text-xs font-bold text-white/70">🚕 Navette</button>
      <button onclick="switchMode('conducteur')" id="btn-conducteur" class="px-4 py-2 rounded-full text-xs font-bold text-white/70">🚘 Conducteur</button>
    </div>
    <div class="mt-2 text-[11px] font-mono text-white/60">Architected by Baakak ✦ CMC 2026</div>
  </div>

  <script>
    let balance = 25;
    let currentMode = 'etudiant';
    let currentOrigin = 'Place Al Massira';

    function renderMode() {
      const c = document.getElementById('modeContent');
      if (currentMode === 'etudiant') {
        c.innerHTML = \`
          <div class="hologram-card p-6 rounded-3xl mb-4 flex justify-between items-center">
            <div>
              <div class="text-xs font-mono text-emerald-400">PORTEFEUILLE ÉTUDIANT</div>
              <div class="text-4xl font-extrabold text-white">\${balance} <span class="text-lg text-emerald-400">MAD</span></div>
            </div>
            <button onclick="topUp(20)" class="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-mono text-white">+20 MAD</button>
          </div>
          <button onclick="reserveRide()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold text-lg uppercase shadow-[0_0_30px_rgba(16,185,129,0.8)]">
            Réserver • 5 MAD
          </button>
        \`;
      } else if (currentMode === 'navette') {
        c.innerHTML = \`
          <div class="glass-panel p-6 rounded-3xl text-center">
            <h3 class="text-xl font-bold mb-2">Smart Navette Minivan Express</h3>
            <p class="text-xs text-slate-400 mb-4">Touchez un siège libre (vert)</p>
            <div class="w-64 mx-auto p-6 bg-black/60 rounded-3xl border border-cyan-500/40 grid grid-cols-3 gap-3 mb-4">
              <div class="p-3 bg-white/10 rounded-xl text-xs text-white/40">#01 Occupé</div>
              <div onclick="selectSeat(2)" class="p-3 bg-cyan-500/20 border border-cyan-400 rounded-xl text-xs cursor-pointer text-cyan-300">#02 Libre</div>
              <div onclick="selectSeat(3)" class="p-3 bg-emerald-500 text-black font-bold rounded-xl text-xs cursor-pointer">#03 Choisi</div>
            </div>
            <button onclick="reserveRide()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold uppercase">Confirmer Siège #03 • 5 MAD</button>
          </div>
        \`;
      } else {
        c.innerHTML = \`
          <div class="glass-panel p-6 rounded-3xl">
            <h3 class="text-xl font-bold mb-1">Amortissement Carburant</h3>
            <p class="text-xs text-slate-400 mb-4">90% Conducteur (18 MAD) · 10% CMC (2 MAD)</p>
            <button onclick="publishRide()" class="w-full py-4 rounded-2xl bg-emerald-500 text-black font-extrabold uppercase shadow-[0_0_30px_rgba(16,185,129,0.7)]">
              Publier le Trajet • 3 Places
            </button>
          </div>
        \`;
      }
    }

    function switchMode(m) {
      currentMode = m;
      ['etudiant', 'navette', 'conducteur'].forEach(id => {
        const btn = document.getElementById('btn-' + id);
        if (id === m) {
          btn.className = "px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-black";
        } else {
          btn.className = "px-4 py-2 rounded-full text-xs font-bold text-white/70";
        }
      });
      renderMode();
    }

    function reserveRide() {
      if (balance >= 5) {
        balance -= 5;
        document.getElementById('headerBalance').innerText = balance;
        alert("✨ Réservation confirmée ! Pass validé #CMC-2026. Bon trajet vers CMC Mghila !");
        renderMode();
      } else {
        alert("Solde insuffisant. Veuillez recharger votre portefeuille.");
      }
    }

    function publishRide() {
      alert("🚀 Trajet publié avec succès sur le réseau CMC !");
    }

    function topUp(amt) {
      balance += amt;
      document.getElementById('headerBalance').innerText = balance;
      renderMode();
    }

    renderMode();
  </script>
</body>
</html>`;

  const handleCopy = () => {
    soundManager.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(standaloneHtmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    soundManager.playSuccess();
    const blob = new Blob([standaloneHtmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wasselni-cmc-standalone.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl p-6 md:p-8 overflow-hidden border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.3)]">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
          <FileCode className="w-3.5 h-3.5" />
          <span>Fichier Unique Autonome · Production</span>
        </div>

        <h3 className="text-xl font-bold text-white font-heading">
          Export HTML + Tailwind CDN + Vanilla JS
        </h3>
        <p className="text-xs text-slate-300 mt-1">
          Téléchargez ou copiez le code source 100% autonome en un seul fichier exécutable instantanément dans n'importe quel navigateur sans build ni serveur.
        </p>

        {/* Code Preview box */}
        <div className="my-4 p-3 bg-black/70 rounded-2xl border border-white/10 font-mono text-[11px] text-emerald-300/90 h-44 overflow-y-auto">
          <pre>{standaloneHtmlCode.slice(0, 750)} ... (suite du code autonome)</pre>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Code Copié !' : 'Copier le Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger .html</span>
          </button>
        </div>
      </div>
    </div>
  );
};
