import React from 'react';

interface MonthSelectFieldProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export const MonthSelectField: React.FC<MonthSelectFieldProps> = ({
  label,
  value,
  onChange,
  required,
}) => {
  return (
    <div className="w-full">
      <label className="block text-[10px] font-black text-[#966F33] uppercase tracking-widest mb-1 ml-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[18px] outline-none focus:ring-2 focus:ring-[#4E7C4F] focus:bg-white transition-all text-xs font-bold appearance-none cursor-pointer"
      >
        <option value="">Select month...</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
    </div>
  );
};
