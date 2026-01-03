import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Calendar } from 'lucide-react';
import { NotificationSettings } from '../types';
import { settingsService } from '../services/apiService';

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.get();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<NotificationSettings>) => {
    if (!settings) return;

    try {
      setSaving(true);
      const updated = await settingsService.update(updates);
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleNotifications = async () => {
    if (!settings) return;
    await updateSettings({ pushEnabled: !settings.pushEnabled });
  };

  const updateReminderDays = async (days: number) => {
    await updateSettings({ reminderDays: days });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E7C4F] mx-auto"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 lg:pb-10 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium">Manage your notification preferences</p>
      </header>

      {/* Notifications Section */}
      <div className="bg-white rounded-[48px] p-8 md:p-10 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#4E7C4F] border border-slate-100">
            <Bell size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
            <p className="text-sm text-slate-500 font-medium">Stay updated on your crops</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Push Notifications Toggle */}
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${settings?.pushEnabled ? 'bg-[#4E7C4F] text-white' : 'bg-white text-slate-400 border border-slate-200'}`}
              >
                {settings?.pushEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Push Notifications</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Get reminders for planting and harvesting
                </p>
              </div>
            </div>
            <button
              onClick={toggleNotifications}
              disabled={saving}
              className={`relative w-16 h-8 rounded-full transition-all ${
                settings?.pushEnabled ? 'bg-[#4E7C4F]' : 'bg-slate-300'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                  settings?.pushEnabled ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reminder Days Setting */}
          {settings?.pushEnabled && (
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#966F33]">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Reminder Timing</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Days before event to send reminder
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[3, 7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => updateReminderDays(days)}
                    disabled={saving}
                    className={`py-3 rounded-2xl font-bold text-sm transition-all ${
                      settings.reminderDays === days
                        ? 'bg-[#4E7C4F] text-white shadow-lg shadow-[#4E7C4F]/20'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-[#4E7C4F] hover:text-[#4E7C4F]'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {days}d
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-400 font-medium text-center mt-2">
                You'll be notified{' '}
                <span className="font-bold text-[#4E7C4F]">{settings.reminderDays} days</span>{' '}
                before sowing and harvesting
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-black">i</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 text-sm mb-1">How notifications work</h4>
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  RootNote will remind you when it's time to sow your planned crops and harvest your
                  growing crops based on the months you've set. Enable notifications above to stay
                  on schedule with your garden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version Tag */}
      <div className="text-center py-10">
        <p className="text-[9px] font-black text-slate-200 uppercase tracking-[8px]">
          RootNote Core Build 2.5.0
        </p>
      </div>
    </div>
  );
};

export default Settings;
