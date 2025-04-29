export default function SectionDivider() {
  return (
    <div className="relative w-full h-4 overflow-hidden">
      <div className="absolute top-0 w-full h-px bg-gray-200 opacity-50" />
      <div className="absolute bottom-0 w-full h-px bg-gray-200 opacity-50" />
      <div className="w-full h-full bg-gradient-to-b from-transparent via-gray-100 to-transparent" />
    </div>
  );
}
