// components/form/MultiSelect.jsx
export default function MultiSelect({
  name,
  label,
  value = [],
  onChange,
  options = [],
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
              className="rounded"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
