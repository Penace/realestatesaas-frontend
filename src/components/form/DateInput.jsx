// components/form/DateInput.jsx
export default function DateInput({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
}) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`mt-1 block w-full rounded-lg border px-4 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-400 "
        }`}
      />
      {error && helperText && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
          {helperText}
        </p>
      )}
    </label>
  );
}
