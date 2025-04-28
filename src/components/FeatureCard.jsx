export default function FeatureCard({ title, description }) {
  return (
    <div className="group bg-white/70 backdrop-blur-md shadow-2xl p-8 rounded-2xl text-center overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      <h3 className="text-2xl font-bold text-blue-600">{title}</h3>
      <p className="text-gray-600 mt-4 text-base">{description}</p>
    </div>
  );
}
