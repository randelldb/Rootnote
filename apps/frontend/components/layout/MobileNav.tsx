import React from 'react';
import { LayoutDashboard, Sprout, Settings as SettingsIcon } from 'lucide-react';
import { Tab } from '../../types';

interface MobileNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'crops', icon: Sprout, label: 'My Crops' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' },
];

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="lg:hidden h-20 bg-white border-t border-slate-100 px-6 flex items-center justify-between safe-bottom fixed bottom-0 left-0 right-0 z-30">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id as Tab)}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === item.id ? 'text-[#4E7C4F]' : 'text-slate-300'
          }`}
        >
          <item.icon size={22} className={activeTab === item.id ? 'scale-110' : ''} />
          <span className="text-[10px] font-black uppercase tracking-tighter mt-1">
            {item.label.split(' ')[0]}
          </span>
        </button>
      ))}
    </nav>
  );
};
