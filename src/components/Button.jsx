import { Link } from "react-router-dom";

export default function Button({
  children,
  to = "#",
  size = "lg", // "sm", "md", "lg"
  variant = "primary", // "primary", "secondary", "ghost"
  fullWidth = false,
}) {
  const baseStyles =
    "rounded-2xl shadow-lg transition-all duration-300 ease-out transform-gpu";

  const sizeStyles = {
    sm: "px-4 py-2 text-base",
    md: "px-6 py-3 text-lg",
    lg: "px-10 py-5 text-2xl",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-500 hover:to-teal-400 hover:scale-105 hover:shadow-2xl",
    secondary:
      "bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-600 hover:to-gray-800 hover:scale-105 hover:shadow-xl",
    ghost:
      "bg-transparent text-white border border-white hover:bg-white hover:text-gray-900 hover:scale-105",
  };

  return (
    <Link
      to={to}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </Link>
  );
}
