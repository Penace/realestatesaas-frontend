import { useState, useRef, useEffect } from "react";

export default function CommaInput({
  name,
  value,
  onChange,
  label,
  error,
  suggestions = [],
  helperText,
}) {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);

  const values = value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v);

  const handleAddValue = (val) => {
    if (!values.includes(val)) {
      const newValue = [...values, val].join(", ");
      onChange({ target: { name, value: newValue } });
      setInputValue("");
    }
  };

  const handleRemove = (val) => {
    const newValue = values.filter((v) => v !== val).join(", ");
    onChange({ target: { name, value: newValue } });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed) handleAddValue(trimmed);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setFilteredSuggestions([]), 100); // delay to allow click
  };

  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      setFilteredSuggestions(
        suggestions.filter(
          (s) =>
            s.toLowerCase().includes(inputValue.toLowerCase()) &&
            !values.includes(s)
        )
      );
    }
  }, [inputValue]);

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        className={
          "flex flex-wrap gap-2 items-center w-full px-4 py-3 border rounded-lg shadow-sm focus-within:outline-none focus-within:ring-2 transition-all text-gray-800 " +
          (error
            ? "border-red-400 focus-within:ring-red-400"
            : "border-gray-300 focus-within:ring-blue-400")
        }
      >
        {values.map((val, i) => (
          <span
            key={i}
            className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
          >
            {val}
            <button
              type="button"
              className="ml-2 text-blue-500 hover:text-red-500"
              onClick={() => handleRemove(val)}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            setFilteredSuggestions(
              suggestions.filter((s) => !values.includes(s))
            );
          }}
          placeholder="Add value..."
          aria-describedby={error ? `${name}-error` : undefined}
          className="flex-grow bg-transparent outline-none text-sm min-w-[150px]"
        />
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="border border-gray-300 rounded-md mt-20 shadow-sm bg-white z-10 absolute max-w-md">
          {filteredSuggestions.map((sug, i) => (
            <div
              key={i}
              onMouseDown={() => handleAddValue(sug)}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
            >
              {sug}
            </div>
          ))}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">This field is required.</p>
      )}
      {error && helperText && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
