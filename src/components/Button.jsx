import { Link } from "react-router-dom";

export default function Button({
  children,
  to = "#",
  size = "md",
  variant = "primary",
  className = "",
}) {
  const sizeStyles = {
    sm: "px-4 py-2 text-base",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-2xl",
  };

  const variantStyles = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white shadow-md ring-2 ring-white/5",
    secondary:
      "bg-gray-900 hover:bg-gray-800 text-white shadow-md ring-1 ring-cyan-400/5",
    hero: "bg-cyan-300/5 backdrop-blur-sm hover:bg-white/15 ring-1 ring-teal-100/10 text-white shadow-md",
  };

  return (
    <Link
      to={to}
      className={`inline-block rounded-2xl font-semibold text-white shadow-lg transition-shadow transform-gpu duration-300 ease-out
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        hover:scale-105 hover:shadow-2xl
        ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.05) 100%)",
        backgroundBlendMode: "overlay",
      }}
    >
      {children}
    </Link>
  );
}
