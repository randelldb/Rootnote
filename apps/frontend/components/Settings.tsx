import React, { useState } from 'react';
import { Lock, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 lg:pb-10 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium">Manage your account preferences</p>
      </header>

      {/* Security Section */}
      <div className="bg-white rounded-[48px] p-8 md:p-10 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#4E7C4F] border border-slate-100">
            <Lock size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Security</h2>
            <p className="text-sm text-slate-500 font-medium">Change your password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4E7C4F] focus:border-transparent transition-all"
              placeholder="Enter your current password"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-bold text-slate-700 mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4E7C4F] focus:border-transparent transition-all"
              placeholder="Enter your new password (min 6 characters)"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4E7C4F] focus:border-transparent transition-all"
              placeholder="Confirm your new password"
              disabled={loading}
            />
          </div>

          {/* Password validation hints */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-600 mb-2">Password requirements:</p>
            <ul className="space-y-1">
              <li className="text-xs text-slate-500 flex items-center gap-2">
                {newPassword.length >= 6 ? (
                  <Check size={14} className="text-green-600" />
                ) : (
                  <X size={14} className="text-slate-300" />
                )}
                At least 6 characters
              </li>
              <li className="text-xs text-slate-500 flex items-center gap-2">
                {newPassword && confirmPassword && newPassword === confirmPassword ? (
                  <Check size={14} className="text-green-600" />
                ) : (
                  <X size={14} className="text-slate-300" />
                )}
                Passwords match
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#4E7C4F] text-white rounded-2xl font-bold text-sm hover:bg-[#3d633e] transition-all shadow-lg shadow-[#4E7C4F]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
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
