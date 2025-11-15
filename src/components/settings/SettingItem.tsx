import React from 'react';

const SettingItem = ({
  label,
  type,
  value,
  onChange,
  options,
  min,
  max,
}: {
  label: string;
  type: 'select' | 'checkbox' | 'number' | 'text';
  value: string | boolean | number;
  onChange: (value: unknown) => void;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
}) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            className="border-2 border-gray-300 rounded-md p-1"
            value={value as string}
            onChange={e => onChange(e.target.value)}
          >
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={e => onChange(e.target.checked)}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className="border-2 border-gray-300 rounded-md px-1"
            value={value as number}
            onChange={e => onChange(parseInt(e.target.value, 10))}
            min={min}
            max={max}
          />
        );

      case 'text':
        return (
          <input
            type="text"
            className="border-2 border-gray-300 rounded-md px-2 py-1"
            value={value as string}
            onChange={e => onChange(e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-full hover:bg-main transition-colors rounded-md p-1">
        <span className="text-sm ml-1">{label}</span>
        {renderInput()}
      </div>
    </>
  );
};

export default SettingItem;
