import React from 'react';
import { Droplets, Zap, ShieldCheck, Activity } from 'lucide-react';

export const Water3DSidebar = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between w-5/12 p-12 text-white relative overflow-hidden shadow-2xl z-10 group bg-[#0A1128]">
      
      {/* 3D Background Container */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ perspective: '1200px' }}>
        <div className="absolute inset-0 w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Background Glow */}
          <div 
            className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2" 
            style={{ background: 'radial-gradient(circle at center, rgba(14,165,233,0.3) 0%, transparent 70%)' }} 
          />

          {/* 3D Animated Organic Liquid Blobs */}
          <div className="absolute bottom-[-30%] left-[-50%] w-[200%] h-[120%] opacity-40 blur-[8px]" style={{
              background: 'linear-gradient(180deg, rgba(2, 132, 199, 0.8) 0%, rgba(14, 165, 233, 0.2) 100%)',
              borderRadius: '43% 57% 53% 47% / 51% 42% 58% 49%',
              animation: 'liquidSpin 25s infinite linear',
              transform: 'rotateX(50deg) translateZ(-80px)'
          }} />
          <div className="absolute bottom-[-20%] left-[-50%] w-[200%] h-[110%] opacity-60" style={{
              background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.9) 0%, rgba(2, 132, 199, 0.4) 100%)',
              borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
              animation: 'liquidSpin 30s infinite linear reverse',
              transform: 'rotateX(55deg) translateZ(-30px)'
          }} />
          <div className="absolute bottom-[-10%] left-[-50%] w-[200%] h-[100%] opacity-85" style={{
              background: 'linear-gradient(180deg, rgba(125, 211, 252, 1) 0%, rgba(14, 165, 233, 0.6) 100%)',
              borderRadius: '48% 52% 43% 57% / 51% 54% 46% 49%',
              animation: 'liquidSpin 20s infinite linear',
              transform: 'rotateX(60deg) translateZ(40px)',
              boxShadow: 'inset 0 10px 30px rgba(255,255,255,0.6), 0 -10px 40px rgba(56,189,248,0.4)'
          }} />

          {/* Floating Glass Bubbles */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute bottom-[-10%]" style={{
              left: `${5 + i * 8}%`,
              width: `${12 + (i % 4) * 8}px`,
              height: `${12 + (i % 4) * 8}px`,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.5)',
              animation: `floatUp ${6 + (i % 4) * 2}s infinite cubic-bezier(0.4, 0, 0.2, 1)`,
              animationDelay: `${i * 0.6}s`,
              transform: `translateZ(${30 + (i % 3) * 20}px)`,
            }} />
          ))}
        </div>
      </div>

      {/* Foreground Content - safely outside 3D context */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
            <Droplets className="w-7 h-7 text-[#38bdf8]" />
          </div>
          <div>
            <div className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">AquanovaX</div>
            <div className="text-[#38bdf8] text-xs uppercase tracking-[0.2em] font-bold mt-0.5">Intelligence Platform</div>
          </div>
        </div>

        {/* Content Box */}
        <div className="my-auto mt-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Status: Optimal & Secure
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.3)] relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight text-white drop-shadow-sm">
                Next-Generation <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-emerald-200 drop-shadow-md">Water Logistics</span>
              </h2>
              <p className="text-slate-200 text-base leading-relaxed mb-8 drop-shadow-sm font-medium">
                Unifying suppliers, drivers, and consumers through AI-driven routing, live quality tracking, and automated dispatch intelligence.
              </p>

              <div className="space-y-5">
                {[
                  { icon: Zap, title: 'Smart Demand Prediction', desc: 'AI anticipates water needs before they happen.' },
                  { icon: ShieldCheck, title: 'Verified Trust Layer', desc: 'Every drop tracked and quality verified.' },
                  { icon: Activity, title: 'Live Fleet Routing', desc: 'Real-time optimization saves time and fuel.' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center border border-white/10 shrink-0 shadow-inner">
                      <feature.icon className="w-5 h-5 text-[#38bdf8]" />
                    </div>
                    <div>
                      <div className="font-bold text-white tracking-wide">{feature.title}</div>
                      <div className="text-sm text-slate-300 mt-0.5">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes liquidSpin {
            0% { transform: rotateX(60deg) rotateZ(0deg) scale(1); }
            50% { transform: rotateX(60deg) rotateZ(180deg) scale(1.05); }
            100% { transform: rotateX(60deg) rotateZ(360deg) scale(1); }
          }
          @keyframes floatUp {
            0% { transform: translateY(0) scale(0.8) translateZ(20px); opacity: 0; }
            20% { opacity: 1; transform: translateY(-20px) scale(1) translateZ(40px); }
            80% { opacity: 0.8; }
            100% { transform: translateY(-300px) scale(1.2) translateZ(80px); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};
