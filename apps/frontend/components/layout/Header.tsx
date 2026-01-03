import React from 'react';
import LogoSvg from '@/assets/logo.svg';

export const MobileHeader: React.FC = () => {
  return (
    <header className="lg:hidden px-6 pt-8 pb-4 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-[#4E7C4F] rounded-xl flex items-center justify-center p-2 text-[#4E7C4F] border border-slate-100">
          <img src={LogoSvg} alt="RootNote Logo" className="w-full h-full" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#4E7C4F] leading-none">RootNote</h1>
          <p className="text-[10px] text-[#966F33] font-bold uppercase tracking-widest mt-1">
            Crop tracker
          </p>
        </div>
      </div>
    </header>
  );
};

export const DesktopHeader: React.FC = () => {
  return (
    <header className="hidden lg:flex px-10 py-6 bg-white border-b border-slate-100 items-center justify-end">
      <div className="flex items-center gap-4"></div>
    </header>
  );
};
