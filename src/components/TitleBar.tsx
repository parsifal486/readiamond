import { twMerge } from "tailwind-merge";

export default function TitleBar({ className }: { className: string }) {
  return (
    <div
      className={twMerge("flex flex-row", className)}
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <div className="flex h-8 w-full">
        {/* space for traffic light */}
        <div
          className="w-20 h-8 bg-red-700"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        ></div>

        <div className="flex-1 h-8 flex items-center justify-center bg-blue-300">
          temperoray title
        </div>

        <div
          className="w-24 h-8 bg-green-500"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        ></div>
      </div>
    </div>
  );
}
