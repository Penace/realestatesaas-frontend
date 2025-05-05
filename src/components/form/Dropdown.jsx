// components/form/Dropdown.jsx
export default function Dropdown({
  name,
  label,
  value,
  onChange,
  options = [],
  error,
  helperText,
}) {
  return (
    <label className="flex flex-col w-full relative">
      <span className="text-sm font-medium text-gray-700 mb-1">{label}</span>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 border rounded-xl shadow-lg text-sm font-semibold tracking-wide transition-all focus:outline-none focus:ring-2 bg-white text-gray-800 ${
            error
              ? "border-red-400 focus:ring-red-400 bg-red-50 text-red-700"
              : "border-blue-500 focus:ring-blue-300 text-gray-800"
          } appearance-none`}
        >
          <option value="" disabled className="text-gray-500 font-medium">
            Select {label}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-white text-gray-800 hover:bg-blue-50 px-4 py-3 transition-colors"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="text-gray-500"
          >
            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
          </svg>
        </div>
      </div>
    </label>
  );
}
