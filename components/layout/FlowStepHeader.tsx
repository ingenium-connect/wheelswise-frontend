type Props = {
  step?: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
};

export default function FlowStepHeader({
  step,
  totalSteps,
  title,
  subtitle,
}: Props) {
  const progress =
    step && totalSteps ? Math.round((step / totalSteps) * 100) : null;

  return (
    <div className="px-4 md:px-8 pt-6 pb-2 bg-[#f0f6f9]">
      <div className="bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-8 shadow-lg">
        {step && totalSteps ? (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-white/90 bg-white/20 px-2.5 py-1 rounded-full">
              Step {step} of {totalSteps}
            </span>
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="text-white/60 text-sm mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
