import React, { useEffect, useState } from 'react';

export const SpatialBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 35 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized percentage (0 to 100)
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#050505]">
      {/* Dynamic Cursor-responsive Aurora Blobs */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full blur-[130px] opacity-40 transition-transform duration-700 ease-out will-change-transform aurora-emerald"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(5, 150, 105, 0.2) 50%, transparent 70%)',
          left: `${mousePos.x - 20}%`,
          top: `${mousePos.y - 25}%`,
        }}
      />

      <div
        className="absolute w-[580px] h-[580px] rounded-full blur-[140px] opacity-35 transition-transform duration-1000 ease-out will-change-transform aurora-cyan"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.55) 0%, rgba(14, 116, 144, 0.2) 50%, transparent 70%)',
          left: `${100 - mousePos.x - 15}%`,
          top: `${mousePos.y + 10}%`,
        }}
      />

      <div
        className="absolute -bottom-32 left-1/3 w-[700px] h-[400px] rounded-full blur-[150px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(6, 182, 212, 0.25) 50%, transparent 75%)',
        }}
      />

      {/* Cyber Subtle Grid Matrix overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Vignette border */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center,_transparent_40%,_rgba(5,5,5,0.85)_100%]" />
    </div>
  );
};
