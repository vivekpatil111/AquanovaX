import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Mail, Phone, MapPin } from 'lucide-react';

export const WaterFooter = () => {
  return (
    <footer className="relative bg-[#0A1128] text-slate-300 mt-20 border-t border-white/5 overflow-hidden">
      
      {/* 3D Animated Water Waves (SVG) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0 transform -translate-y-[99%]">
        <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use href="#gentle-wave" x="48" y="0" fill="rgba(14, 165, 233, 0.7)" className="animate-wave-slow" />
            <use href="#gentle-wave" x="48" y="3" fill="rgba(56, 189, 248, 0.5)" className="animate-wave-medium" />
            <use href="#gentle-wave" x="48" y="5" fill="rgba(2, 132, 199, 0.3)" className="animate-wave-fast" />
            <use href="#gentle-wave" x="48" y="7" fill="#0A1128" className="animate-wave-slowish" />
          </g>
        </svg>
      </div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Intro */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <Droplets className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <div>
                <div className="font-extrabold text-xl tracking-tight text-white">AquanovaX</div>
                <div className="text-[#38bdf8] text-[10px] uppercase tracking-[0.2em] font-bold">Platform</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The next-generation water logistics platform unifying suppliers, drivers, and consumers with AI-driven routing and real-time tracking.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#38bdf8] hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#38bdf8] hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#38bdf8] hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#38bdf8] hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm hover:text-[#38bdf8] transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-sm hover:text-[#38bdf8] transition-colors">Our Services</Link></li>
              <li><Link to="/pricing" className="text-sm hover:text-[#38bdf8] transition-colors">Pricing Plans</Link></li>
              <li><Link to="/careers" className="text-sm hover:text-[#38bdf8] transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="text-sm hover:text-[#38bdf8] transition-colors">Blog & News</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-sm hover:text-[#38bdf8] transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-[#38bdf8] transition-colors">FAQs</Link></li>
              <li><Link to="/safety" className="text-sm hover:text-[#38bdf8] transition-colors">Safety Guidelines</Link></li>
              <li><Link to="/terms" className="text-sm hover:text-[#38bdf8] transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-[#38bdf8] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#38bdf8] shrink-0" />
                <span className="text-sm">123 Aqua Tower, Innovation Park, Tech City, IN 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span className="text-sm">+91 1800 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span className="text-sm">support@aquanovax.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} AquanovaX. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>for a water-secure future.</span>
          </div>
        </div>
      </div>

      <style>
        {`
          .animate-wave-slow { animation: wave 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite; }
          .animate-wave-medium { animation: wave 20s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite; }
          .animate-wave-fast { animation: wave 15s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite; }
          .animate-wave-slowish { animation: wave 30s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite; }
          @keyframes wave {
            0% { transform: translate3d(-90px,0,0); }
            100% { transform: translate3d(85px,0,0); }
          }
        `}
      </style>
    </footer>
  );
};
