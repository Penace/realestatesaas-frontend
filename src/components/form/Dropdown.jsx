// components/form/Dropdown.jsx
export default function Dropdown({
  name,
  label,
  value,
  onChange,
  options = [],
  error,
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
          error
            ? "border-red-500"
            : "focus:border-indigo-500 focus:ring-indigo-500"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
