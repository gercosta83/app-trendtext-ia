export default function CardPremium() {
  return (
    <div style={{
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      marginTop: "24px"
    }}>
      <h2 style={{ fontWeight: "bold", fontSize: "18px" }}>
        Plano Premium
      </h2>

      <p style={{ marginTop: "8px", color: "#555" }}>
        Gere roteiros, legendas, CTAs e hashtags ilimitadas com IA.
      </p>

      <button
        style={{
          marginTop: "16px",
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: "#7c3aed",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
      >
        Acessar Premium
      </button>
    </div>
  );
}
