// components/form/MultiSelect.jsx
export default function MultiSelect({
  name,
  label,
  value = [],
  onChange,
  options = [],
  error,
  helperText,
}) {
  const handleToggle = (option) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];
    onChange({ target: { name, value: newValue } });
  };

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => handleToggle(option)}
              aria-describedby={error ? `${name}-error` : undefined}
              className={`px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-gray-800 ${
                error
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error && helperText && (
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}
