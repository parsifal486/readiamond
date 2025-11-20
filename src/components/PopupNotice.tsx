import React, { useEffect } from 'react';

export const PopupNotice = (
  message: string,
  duration = 3000,
  onClose: () => void
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose(); //use parents's onClose function
    }, duration);

    // clearn up the timer
    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className={`popup-notice dark:bg-zinc-800 bg-zinc-200`}>
      <div className="text-theme-strong">{message}</div>
      <button onClick={handleClose} className="text-theme-primary">
        Close
      </button>
    </div>
  );
};
