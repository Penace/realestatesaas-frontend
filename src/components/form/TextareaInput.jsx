export default function TextareaInput({
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-describedby={error ? `${name}-error` : undefined}
        rows={4}
        className={`px-4 py-3 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 transition-all text-gray-800 ${
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-400"
        }`}
      />
      {error && helperText && (
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}
