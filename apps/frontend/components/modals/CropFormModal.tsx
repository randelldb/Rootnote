import React from 'react';
import { Crop } from '../../types';
import { InputField } from '../forms/InputField';
import { MonthSelectField } from '../forms/MonthSelectField';

interface CropFormData {
  name: string;
  species: string;
  plantingDate: string;
  expectedHarvestDate: string;
  pruneDate: string;
  cropType: 'annual' | 'permanent';
  cropYear: number;
}

interface CropFormModalProps {
  isOpen: boolean;
  editingCrop: Crop | null;
  formData: CropFormData;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (data: CropFormData) => void;
}

export const CropFormModal: React.FC<CropFormModalProps> = ({
  isOpen,
  editingCrop,
  formData,
  submitting,
  onClose,
  onSubmit,
  onFormDataChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[40px] p-8 md:p-10 animate-in zoom-in-95 duration-200 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-[#4E7C4F]">
            {editingCrop ? 'Edit Plant' : 'Register Plant'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Common Name"
              placeholder="e.g. Sweet Corn"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              required
            />
            <InputField
              label="Botanical Name"
              placeholder="e.g. Zea mays"
              value={formData.species}
              onChange={(e) => onFormDataChange({ ...formData, species: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <MonthSelectField
              label="Sowing Month"
              value={formData.plantingDate}
              onChange={(e) => onFormDataChange({ ...formData, plantingDate: e.target.value })}
              required
            />
            <MonthSelectField
              label="Expected Harvest"
              value={formData.expectedHarvestDate}
              onChange={(e) =>
                onFormDataChange({ ...formData, expectedHarvestDate: e.target.value })
              }
              required
            />
          </div>

          <div className="w-full">
            <MonthSelectField
              label="Prune Month (Optional)"
              value={formData.pruneDate}
              onChange={(e) => onFormDataChange({ ...formData, pruneDate: e.target.value })}
            />
            <p className="text-xs text-slate-400 mt-1 ml-1">
              For permanent crops that need pruning
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="w-full">
              <label className="block text-[10px] font-black text-[#966F33] uppercase tracking-widest mb-1 ml-1">
                Crop Type
              </label>
              <select
                value={formData.cropType}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    cropType: e.target.value as 'annual' | 'permanent',
                  })
                }
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[18px] outline-none focus:ring-2 focus:ring-[#4E7C4F] focus:bg-white transition-all text-xs font-bold appearance-none cursor-pointer"
              >
                <option value="annual">Annual</option>
                <option value="permanent">Permanent</option>
              </select>
              <p className="text-xs text-slate-400 mt-1 ml-1">Replanted yearly or perennial?</p>
            </div>

            <div className="w-full">
              <label className="block text-[10px] font-black text-[#966F33] uppercase tracking-widest mb-1 ml-1">
                Crop Year
              </label>
              <select
                value={formData.cropYear}
                onChange={(e) =>
                  onFormDataChange({ ...formData, cropYear: parseInt(e.target.value) })
                }
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[18px] outline-none focus:ring-2 focus:ring-[#4E7C4F] focus:bg-white transition-all text-xs font-bold appearance-none cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </select>
              <p className="text-xs text-slate-400 mt-1 ml-1">Year planted</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-md py-4 bg-[#4E7C4F] text-white font-bold rounded-[22px] hover:bg-[#3d633e] transition-all mt-4 shadow-xl shadow-[#4E7C4F]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {submitting ? 'Saving...' : editingCrop ? 'Update Plant' : 'Save to Garden'}
          </button>
        </form>
      </div>
    </div>
  );
};
