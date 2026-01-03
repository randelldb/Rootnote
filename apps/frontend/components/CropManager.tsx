import React from 'react';
import { Trash2, Edit2, MapPin, Plus, FileText, Award } from 'lucide-react';
import { Crop } from '../types';

interface CropManagerProps {
  crops: Crop[];
  onDelete: (id: string) => void;
  onEdit: (crop: Crop) => void;
  onStatusChange: (id: string, status: 'Planned' | 'Growing' | 'Harvested') => void;
  onAdd: () => void;
  onAddLog: (crop: Crop) => void;
  onShowLogs: (crop: Crop) => void;
  onShowMilestones: (crop: Crop) => void;
}

// Helper function to format MM to "Month"
const formatMonth = (monthString: string): string => {
  if (!monthString) return 'N/A';
  const monthNum = parseInt(monthString);
  if (monthNum < 1 || monthNum > 12) return 'N/A';
  const date = new Date(2000, monthNum - 1); // Year doesn't matter
  return date.toLocaleDateString('en-US', { month: 'long' });
};

const CropManager: React.FC<CropManagerProps> = ({
  crops,
  onDelete,
  onEdit,
  onStatusChange,
  onAdd,
  onAddLog,
  onShowLogs,
  onShowMilestones,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 lg:pb-0">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
          Registered Entries ({crops.length})
        </h2>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="bg-white rounded-[40px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-3xl ${crop.color} flex-shrink-0 flex items-center justify-center text-white/40 shadow-inner`}
                >
                  <MapPin size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight truncate">
                    {crop.name} ({crop.cropYear})
                  </h3>
                  <p className="text-xs text-[#966F33] italic font-bold truncate">{crop.species}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Sown
                  </p>
                  <p className="text-xs font-bold text-slate-800">
                    {formatMonth(crop.plantingDate)}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Harvest
                  </p>
                  <p className="text-xs font-bold text-slate-800">
                    {formatMonth(crop.expectedHarvestDate)}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Prune
                  </p>
                  <p className="text-xs font-bold text-slate-800">{formatMonth(crop.pruneDate)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onShowMilestones(crop)}
                    className="px-3 py-2 text-xs font-bold text-[#966F33] bg-slate-50 rounded-xl shadow-sm hover:bg-slate-100 transition-colors border border-slate-100 flex items-center justify-center gap-2"
                  >
                    <Award size={14} />
                    Milestones
                  </button>
                  <button
                    onClick={() => onShowLogs(crop)}
                    className="px-3 py-2 text-xs font-bold text-[#4E7C4F] bg-slate-50 rounded-xl shadow-sm hover:bg-slate-100 transition-colors border border-slate-100 flex items-center justify-center gap-2"
                  >
                    <FileText size={14} />
                    Logs
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <select
                    value={crop.status}
                    onChange={(e) =>
                      onStatusChange(crop.id, e.target.value as 'Planned' | 'Growing' | 'Harvested')
                    }
                    className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm bg-slate-50 border border-slate-100 cursor-pointer appearance-none hover:bg-slate-100 transition-colors ${
                      crop.status === 'Growing'
                        ? 'text-[#4E7C4F]'
                        : crop.status === 'Harvested'
                          ? 'text-[#5DA9E9]'
                          : 'text-[#966F33]'
                    }`}
                  >
                    <option value="Planned">Planned</option>
                    <option value="Growing">Growing</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAddLog(crop)}
                      className="p-2.5 text-[#4E7C4F] bg-slate-50 rounded-xl shadow-sm hover:scale-105 transition-transform border border-slate-100"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(crop)}
                      className="p-2.5 text-[#4E7C4F] bg-slate-50 rounded-xl shadow-sm hover:scale-105 transition-transform border border-slate-100"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(crop.id)}
                      className="p-2.5 text-red-400 bg-slate-50 rounded-xl shadow-sm hover:scale-105 transition-transform border border-slate-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropManager;
