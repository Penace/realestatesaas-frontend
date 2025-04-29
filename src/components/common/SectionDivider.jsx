export default function SectionDivider() {
  return (
    <div className="relative w-full h-[3px] overflow-hidden">
      {/* Central 1px Line */}
      <div className="absolute top-1/2 left-0 w-full h-px transform -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-40 animate-dividerGlow" />

      {/* Subtle glow underneath */}
      <div className="absolute top-1/2 left-0 w-full h-3 transform -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-600 to-transparent blur-sm opacity-20" />
    </div>
  );
}
