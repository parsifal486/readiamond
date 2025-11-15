import { useState, useEffect, useRef, forwardRef } from 'react';

interface AutoResizeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minRows?: number;
  maxRows?: number;
}

export const AutoResizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(
  (
    { value, onChange, placeholder, className = '', minRows = 1, maxRows = 10 },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [textareaHeight, setTextareaHeight] = useState('auto');

    // Calculate line height for setting min and max height
    const lineHeight = 1; // rem unit
    const padding = 0.25; // padding for p-1 class
    const minHeight = minRows * lineHeight + padding * 2;
    const maxHeight = maxRows * lineHeight + padding * 2;

    // Function to auto-adjust height
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        // Reset height to get correct scrollHeight
        textarea.style.height = 'auto';

        // Calculate new height
        const scrollHeight = textarea.scrollHeight;
        const newHeight = Math.min(
          Math.max(scrollHeight, minHeight * 16),
          maxHeight * 16
        ); // Convert to px

        textarea.style.height = newHeight + 'px';
        setTextareaHeight(newHeight + 'px');
      }
    };

    // Adjust height when value changes
    useEffect(() => {
      adjustHeight();
    }, [value]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    // Handle input event for real-time height adjustment
    const handleInput = () => {
      adjustHeight();
    };

    return (
      <textarea
        ref={ref || textareaRef}
        value={value}
        onChange={handleChange}
        onInput={handleInput}
        placeholder={placeholder}
        rows={minRows}
        className={`
          w-full 
          resize-none 
          leading-tight
          border-l-2
          border-[var(--color-theme-primary)]
          ${className}
          outline-none
          hover:shadow-sm
          focus:shadow-sm
          focus:border-[var(--color-theme-secondary)]
        `}
        style={{
          minHeight: `${minHeight}rem`,
          maxHeight: `${maxHeight}rem`,
          height: textareaHeight,
        }}
      />
    );
  }
);

AutoResizeTextarea.displayName = 'AutoResizeTextarea';
