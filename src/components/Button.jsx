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
      "bg-green-100/50 text-green-800 ring-1 ring-green-300/55 hover:bg-green-300 hover:text-white",
    reject:
      "bg-red-100/50 text-red-800 ring-1 ring-red-300/55 hover:bg-red-300 hover:text-white",
    primaryLight:
      "bg-white text-blue-600 ring-2 ring-blue-100 shadow hover:bg-blue-50 hover:text-blue-700",
  };

  const baseStyles = `
  inline-block rounded-2xl font-semibold
  transform-gpu transition-transform transition-shadow
  duration-200 ease-out
  drop-shadow-sm
  hover:drop-shadow-md hover:scale-[1.07]
`;

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
