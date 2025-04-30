export default function TextInput({
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-gray-800 ${
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-400"
        }`}
      />
    </div>
  );
}
