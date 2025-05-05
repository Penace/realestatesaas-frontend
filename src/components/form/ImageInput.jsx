import { useState, useCallback, useRef } from "react";

export default function ImageInput({ name, value = [], onChange, error }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedFiles = [...value, ...newFiles];
    onChange({ target: { name, value: updatedFiles } });
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = value.filter((_, i) => i !== index);
    onChange({ target: { name, value: updatedFiles } });
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
          const updatedFiles = [...value, ...droppedFiles];
          onChange({ target: { name, value: updatedFiles } });
        }
      }}
      className={`relative border-2 border-dashed rounded-md p-4 transition-colors ${
        isDragging ? "border-blue-400 bg-blue-50" : "border-transparent"
      }`}
    >
      <div className="flex flex-col">
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Upload Images (JPG, JPEG, HEIC, PNG)
        </label>
        <label className="inline-block w-max cursor-pointer px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 mb-3 text-sm font-medium">
          Choose Files
          <input
            type="file"
            accept=".jpeg,.jpg,.heic,.png"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {value.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {Array.isArray(value) &&
              value.map((file, index) => {
                const url =
                  typeof file === "string"
                    ? file
                    : file instanceof File
                    ? URL.createObjectURL(file)
                    : "";

                return (
                  <div key={index} className="relative group w-24 h-24">
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded border border-gray-300 group-hover:opacity-80 transition"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl font-bold rounded opacity-0 group-hover:opacity-100 transition"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
