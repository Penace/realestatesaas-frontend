import { Link } from "react-router-dom";

export default function Button({
  children,
  to = null,
  onClick,
  type = "button",
  size = "md",
  variant = "primary",
  className = "",
  ...rest
}) {
  const sizeStyles = {
    sm: "px-4 py-2 text-base",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-2xl",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white ring-2 ring-white/5 shadow-md",
    secondary:
      "bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white ring-1 ring-cyan-400/10 shadow-md",
    hero: "bg-gradient-to-br from-cyan-100/5 via-white/5 to-blue-200/10 backdrop-blur-md hover:bg-white/10 text-white ring-1 ring-teal-200/10 shadow-sm",
    approve:
      "bg-green-50 text-green-800 ring-1 ring-green-300 hover:bg-green-100 hover:text-green-900",
    reject:
      "bg-red-50 text-red-800 ring-1 ring-red-300 hover:bg-red-100 hover:text-red-900",
  };

  const baseStyles =
    "inline-block rounded-2xl font-semibold transition-all duration-300 transform-gpu hover:scale-105 drop-shadow-md text-shadow";

  const resolvedClasses = [
    baseStyles,
    sizeStyles[size] || sizeStyles.md,
    variantStyles[variant] || variantStyles.primary,
    className,
  ]
    .join(" ")
    .trim();

  const inlineStyle = {
    backgroundImage:
      "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(0,0,0,0.04))",
    backgroundBlendMode: "overlay",
  };

  return to ? (
    <Link to={to} className={resolvedClasses} style={inlineStyle} {...rest}>
      <span className="drop-shadow-sm">{children}</span>
    </Link>
  ) : (
    <button
      onClick={onClick}
      type={type}
      className={resolvedClasses}
      style={inlineStyle}
      {...rest}
    >
      <span className="drop-shadow-sm">{children}</span>
    </button>
  );
}
