import React from 'react';

const SettingSection = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      id={id}
      className="flex flex-col self-stretch items-center justify-start p-2 bg-emphasis border rounded-md split-line mx-5 my-5 relative max-w-3xl"
    >
      <span className="text-base font-bold ml-1 text-theme-strong">
        {title}
      </span>

      {/* divide line */}
      <div className="w-full h-0.5 border-t split-line my-2"></div>

      {children}
    </div>
  );
};

export default SettingSection;
