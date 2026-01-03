import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  required,
}) => (
  <div className="w-full">
    <label className="block text-[10px] font-black text-[#966F33] uppercase tracking-widest mb-1 ml-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[18px] outline-none focus:ring-2 focus:ring-[#4E7C4F] focus:bg-white transition-all text-sm font-bold placeholder:text-slate-300"
      placeholder={placeholder}
    />
  </div>
);
