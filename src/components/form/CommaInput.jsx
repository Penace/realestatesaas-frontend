// components/form/CommaInput.jsx
export default function CommaInput({
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Comma-separated values"}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm resize-none ${
          error
            ? "border-red-500"
            : "focus:border-indigo-500 focus:ring-indigo-500"
        }`}
        rows={2}
      />
    </label>
  );
}
