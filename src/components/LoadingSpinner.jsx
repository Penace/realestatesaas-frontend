export default function LoadingSpinner({ size = 24, color = "text-blue-500" }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-transparent border-t-current ${color}`}
      style={{
        width: size,
        height: size,
        borderTopWidth: "3px",
        borderLeftWidth: "3px",
      }}
    />
  );
}
