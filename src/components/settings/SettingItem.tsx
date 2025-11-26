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
  type: 'select' | 'checkbox' | 'number' | 'text' | 'path-picker';
  value: string | boolean | number;
  onChange: (value: unknown) => void;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  min?: number;
  max?: number;
}) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            className="input-base h-8"
            value={value as string}
            onChange={e => onChange(e.target.value)}
          >
            {options?.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center h-8">
            <input
              type="checkbox"
              className="w-4 h-4 cursor-pointer accent-theme-primary"
              checked={value as boolean}
              onChange={e => onChange(e.target.checked)}
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            className="input-base h-8"
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
            className="input-base h-8 w-1/2"
            value={value as string}
            onChange={e => onChange(e.target.value)}
          />
        );

      case 'path-picker':
        return (
          <div className="flex items-center gap-2 h-8">
            <div className="text-sm text-theme-base truncate max-w-xs">
              {value || 'Not set'}
            </div>
            <button
              className="px-3 py-1 text-xs font-medium text-theme-base  hover:bg-theme-secondary bg-theme-primary rounded transition-colors duration-200 shrink-0"
              onClick={() => onChange(value as string)}
            >
              Change
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-full hover:bg-main transition-colors rounded-md p-1">
        <span className="text-sm ml-1 text-theme-base">{label}</span>
        {renderInput()}
      </div>
    </>
  );
};

export default SettingItem;
