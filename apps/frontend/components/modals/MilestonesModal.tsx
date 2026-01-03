import React from 'react';
import { Crop, CropMilestones } from '../../types';
import { InputField } from '../forms/InputField';

interface MilestonesModalProps {
  isOpen: boolean;
  crop: Crop | null;
  milestonesData: CropMilestones;
  newHarvestDate: string;
  selectedMilestoneYear: number;
  submitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onMilestonesDataChange: (data: CropMilestones) => void;
  onNewHarvestDateChange: (date: string) => void;
  onAddHarvestDate: () => void;
  onRemoveHarvestDate: (date: string) => void;
  onMilestoneYearChange: (year: number) => void;
}

export const MilestonesModal: React.FC<MilestonesModalProps> = ({
  isOpen,
  crop,
  milestonesData,
  newHarvestDate,
  selectedMilestoneYear,
  submitting,
  onClose,
  onSubmit,
  onMilestonesDataChange,
  onNewHarvestDateChange,
  onAddHarvestDate,
  onRemoveHarvestDate,
  onMilestoneYearChange,
}) => {
  if (!isOpen || !crop) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[40px] p-8 md:p-10 animate-in zoom-in-95 duration-200 shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#4E7C4F]">Crop Milestones</h2>
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

        {/* Year selector for permanent crops */}
        {crop.cropType === 'permanent' && (
          <div className="mb-4">
            <label className="block text-[10px] font-black text-[#966F33] uppercase tracking-widest mb-1 ml-1">
              Milestone Year
            </label>
            <select
              value={selectedMilestoneYear}
              onChange={(e) => onMilestoneYearChange(parseInt(e.target.value))}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[18px] outline-none focus:ring-2 focus:ring-[#4E7C4F] focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer"
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
            <p className="text-xs text-slate-400 mt-1 ml-1">
              Select the year to view/edit milestones
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Seeded / Planted Date"
              type="date"
              value={milestonesData.seededDate || ''}
              onChange={(e) =>
                onMilestonesDataChange({ ...milestonesData, seededDate: e.target.value })
              }
            />
            <InputField
              label="Germination Date"
              type="date"
              value={milestonesData.germinationDate || ''}
              onChange={(e) =>
                onMilestonesDataChange({ ...milestonesData, germinationDate: e.target.value })
              }
            />
          </div>

          <div className="w-full">
            <label className="block text-[10px] font-black text-[#966F33] uppercase tracking-widest mb-1 ml-1">
              Germination Percentage
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={milestonesData.germinationPercentage || ''}
              onChange={(e) =>
                onMilestonesDataChange({
                  ...milestonesData,
                  germinationPercentage: parseInt(e.target.value) || undefined,
                })
              }
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[18px] outline-none focus:ring-2 focus:ring-[#4E7C4F] focus:bg-white transition-all text-sm font-bold placeholder:text-slate-300"
              placeholder="0-100%"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Transplanted Date"
              type="date"
              value={milestonesData.transplantedDate || ''}
              onChange={(e) =>
                onMilestonesDataChange({ ...milestonesData, transplantedDate: e.target.value })
              }
            />
            <InputField
              label="First True Leaves"
              type="date"
              value={milestonesData.firstTrueLeavesDate || ''}
              onChange={(e) =>
                onMilestonesDataChange({ ...milestonesData, firstTrueLeavesDate: e.target.value })
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="First Flower"
              type="date"
              value={milestonesData.firstFlowerDate || ''}
              onChange={(e) =>
                onMilestonesDataChange({ ...milestonesData, firstFlowerDate: e.target.value })
              }
            />
            <InputField
              label="Fruit Set"
              type="date"
              value={milestonesData.fruitSetDate || ''}
              onChange={(e) =>
                onMilestonesDataChange({ ...milestonesData, fruitSetDate: e.target.value })
              }
            />
          </div>

          <div className="w-full">
            <label className="block text-[10px] font-black text-[#966F33] uppercase tracking-widest mb-2 ml-1">
              Harvest Dates
            </label>
            <div className="space-y-2">
              {milestonesData.harvestDates && milestonesData.harvestDates.length > 0 && (
                <div className="space-y-2 mb-3">
                  {milestonesData.harvestDates.map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100"
                    >
                      <span className="flex-1 text-sm font-bold text-slate-800">
                        {new Date(date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={() => onRemoveHarvestDate(date)}
                        className="text-red-400 hover:text-red-600 font-bold text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newHarvestDate}
                  onChange={(e) => onNewHarvestDateChange(e.target.value)}
                  className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-[18px] outline-none focus:ring-2 focus:ring-[#4E7C4F] focus:bg-white transition-all text-sm font-bold"
                />
                <button
                  onClick={onAddHarvestDate}
                  disabled={!newHarvestDate}
                  className="px-6 py-3 bg-[#4E7C4F] text-white font-bold rounded-[18px] hover:bg-[#3d633e] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <InputField
            label="End of Life / Removed Date"
            type="date"
            value={milestonesData.endOfLifeDate || ''}
            onChange={(e) =>
              onMilestonesDataChange({ ...milestonesData, endOfLifeDate: e.target.value })
            }
          />
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="w-full py-4 bg-[#4E7C4F] text-white font-bold rounded-[22px] hover:bg-[#3d633e] transition-all shadow-xl shadow-[#4E7C4F]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {submitting ? 'Saving...' : 'Save Milestones'}
          </button>
        </div>
      </div>
    </div>
  );
};
