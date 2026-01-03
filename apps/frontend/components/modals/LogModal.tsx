import React from 'react';
import { Crop, CropLog } from '../../types';
import { InputField } from '../forms/InputField';

interface AddLogModalProps {
  isOpen: boolean;
  crop: Crop | null;
  logDate: string;
  note: string;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onLogDateChange: (date: string) => void;
  onNoteChange: (note: string) => void;
}

export const AddLogModal: React.FC<AddLogModalProps> = ({
  isOpen,
  crop,
  logDate,
  note,
  submitting,
  onClose,
  onSubmit,
  onLogDateChange,
  onNoteChange,
}) => {
  if (!isOpen || !crop) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[40px] p-8 md:p-10 animate-in zoom-in-95 duration-200 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#4E7C4F]">Add Log Entry</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crop</p>
          <p className="text-lg font-bold text-slate-900">{crop.name}</p>
          <p className="text-xs text-[#966F33] italic">{crop.species}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <InputField
            label="Date"
            type="date"
            value={logDate}
            onChange={(e) => onLogDateChange(e.target.value)}
            required
          />

          <div className="w-full">
            <label className="block text-[10px] font-black text-[#966F33] uppercase tracking-widest mb-1 ml-1">
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              required
              rows={4}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[18px] outline-none focus:ring-2 focus:ring-[#4E7C4F] focus:bg-white transition-all text-sm font-bold placeholder:text-slate-300 resize-none"
              placeholder="e.g. Watered, First flower, Fertilized..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#4E7C4F] text-white font-bold rounded-[22px] hover:bg-[#3d633e] transition-all mt-4 shadow-xl shadow-[#4E7C4F]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {submitting ? 'Saving...' : 'Add Log Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

interface ShowLogsModalProps {
  isOpen: boolean;
  crop: Crop | null;
  logs: CropLog[];
  onClose: () => void;
}

export const ShowLogsModal: React.FC<ShowLogsModalProps> = ({ isOpen, crop, logs, onClose }) => {
  if (!isOpen || !crop) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[40px] p-8 md:p-10 animate-in zoom-in-95 duration-200 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#4E7C4F]">Crop Logs</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold transition-colors"
          >
            Close
          </button>
        </div>

        <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crop</p>
          <p className="text-lg font-bold text-slate-900">{crop.name}</p>
          <p className="text-xs text-[#966F33] italic">{crop.species}</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 font-bold">No logs yet for this crop</p>
              <p className="text-xs text-slate-300 mt-2">
                Add your first log entry to track growth!
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-black text-[#4E7C4F] uppercase tracking-widest">
                    {new Date(log.logDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold">
                    {new Date(log.createdAt).toLocaleDateString('en-US')}
                  </p>
                </div>
                <p className="text-sm text-slate-800 font-medium whitespace-pre-wrap">{log.note}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
