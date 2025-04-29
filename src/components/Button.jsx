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
      "bg-blue-600 hover:bg-blue-500 text-white shadow-md ring-2 ring-white/5",
    secondary:
      "bg-gray-900 hover:bg-gray-800 text-white shadow-md ring-1 ring-cyan-400/5",
    hero: "bg-cyan-300/5 backdrop-blur-sm hover:bg-black/10 ring-0.5 ring-teal-100/10 text-white shadow-sm",
  };

  const baseStyles = `
    inline-block rounded-2xl font-semibold transition-all duration-300
    hover:scale-105 hover:shadow-xl transform-gpu
    drop-shadow-md text-shadow
  `;

  const styles = `
    ${baseStyles}
    ${sizeStyles[size] || sizeStyles.md}
    ${variantStyles[variant] || variantStyles.primary}
    ${className}
  `;

  const inlineStyle = {
    backgroundImage:
      "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(0,0,0,0.04))",
    backgroundBlendMode: "overlay",
  };

  return to ? (
    <Link to={to} className={styles} style={inlineStyle} {...rest}>
      <span className="drop-shadow-sm">{children}</span>
    </Link>
  ) : (
    <button
      onClick={onClick}
      type={type}
      className={styles}
      style={inlineStyle}
      {...rest}
    >
      <span className="drop-shadow-sm">{children}</span>
    </button>
  );
}
