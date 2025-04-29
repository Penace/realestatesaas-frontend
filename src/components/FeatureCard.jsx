export default function FeatureCard({ title, description }) {
  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-transform duration-500 hover:scale-[1.03] hover:shadow-2xl ease-out">
      <h3 className="text-xl font-bold text-blue-600 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
