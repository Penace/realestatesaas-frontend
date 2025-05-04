// components/form/DateInput.jsx
export default function DateInput({ name, label, value, onChange, error }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
          error
            ? "border-red-500"
            : "focus:border-indigo-500 focus:ring-indigo-500"
        }`}
      />
    </label>
  );
}
