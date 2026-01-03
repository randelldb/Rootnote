import React from 'react';
import { LayoutDashboard, Sprout, Settings as SettingsIcon, Plus } from 'lucide-react';
import { Tab } from '../../types';
import LogoSvg from '../../assets/logo.svg';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onNewCropClick: () => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'crops', icon: Sprout, label: 'My Crops' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onNewCropClick }) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-12 h-12 bg-[#4E7C4F] rounded-2xl flex items-center justify-center p-2.5 shadow-lg shadow-[#4E7C4F]/20">
          <img src={LogoSvg} alt="RootNote Logo" className="w-full h-full" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#4E7C4F] leading-tight">RootNote</h1>
          <p className="text-[10px] text-[#966F33] font-bold uppercase tracking-[0.2em]">
            Crop tracker
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as Tab)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeTab === item.id
                ? 'bg-[#4E7C4F] text-white shadow-lg shadow-[#4E7C4F]/20 translate-x-1'
                : 'text-slate-500 hover:bg-slate-50 hover:text-[#4E7C4F]'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-100">
        <button
          onClick={onNewCropClick}
          className="w-full py-4 bg-[#4E7C4F] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#3d633e] transition-all shadow-md"
        >
          <Plus size={18} /> New Crop
        </button>
      </div>
    </aside>
  );
};
