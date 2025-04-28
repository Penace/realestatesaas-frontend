export default function FeatureCard({ title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center space-y-4 hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
