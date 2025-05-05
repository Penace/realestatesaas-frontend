import { useState, useRef, useEffect } from "react";
import { features, amenities, facilities } from "../../utils/constants";

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

  const values = Array.isArray(value) ? value : [];

  const handleAddValue = (val) => {
    const current = Array.isArray(value)
      ? value
      : typeof value === "string"
      ? value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : [];

    if (!current.includes(val)) {
      const updated = [...current, val];
      onChange({ target: { name, value: updated } });
      setInputValue("");
    }
  };

  const handleRemove = (val) => {
    const current = Array.isArray(value)
      ? value
      : typeof value === "string"
      ? value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : [];
    const updated = current.filter((v) => v !== val);
    onChange({ target: { name, value: updated } });
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

  const updateFilteredSuggestions = () => {
    const lowerInput = inputValue.toLowerCase();
    const filtered = suggestions.filter((s) => {
      return (
        s.toLowerCase().includes(lowerInput) &&
        !values.some((v) => v.toLowerCase() === s.toLowerCase())
      );
    });
    setFilteredSuggestions(filtered);
  };

  useEffect(() => {
    if (typeof inputValue === "string") {
      updateFilteredSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const allSuggestions = [...features, ...amenities, ...facilities].map((s) =>
    s.toLowerCase()
  );

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
        {values.map((val, i) => {
          const isSuggested = allSuggestions.includes(val.toLowerCase());
          const colorClass = isSuggested
            ? "bg-blue-100 text-blue-800 border-blue-300"
            : "bg-purple-100 text-purple-800 border-purple-300";
          return (
            <span
              key={`tag-${val}-${i}`}
              className={`flex items-center text-sm px-2 py-1 rounded-full border ${colorClass}`}
            >
              {val}
              <button
                type="button"
                className="ml-2 text-gray-500 hover:text-red-500"
                onClick={() => handleRemove(val)}
              >
                &times;
              </button>
            </span>
          );
        })}
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={updateFilteredSuggestions}
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
