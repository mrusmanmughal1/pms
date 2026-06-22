export default function Spinner({ size = "md", text = "Loading..." }) {
  const sizeMap = {
    sm: { spinner: "20px", container: "1px" },
    md: { spinner: "40px", container: "1rem" },
    lg: { spinner: "56px", container: "2rem" },
  };

  const dims = sizeMap[size] || sizeMap.md;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: dims.container,
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: dims.spinner,
          height: dims.spinner,
          border: "4px solid #e2e8f0",
          borderTop: "4px solid #5b4fe8",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
