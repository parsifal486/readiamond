// Pure CSS animation approach - best performance
const LoadingDots = () => {
  return (
    <div className="flex items-center justify-center gap-0.5">
      <span className="animate-bounce-dot animation-delay-0">•</span>
      <span className="animate-bounce-dot animation-delay-150">•</span>
      <span className="animate-bounce-dot animation-delay-300">•</span>
    </div>
  );
};

export default LoadingDots;
