import { useRef } from "react";
import type { TamboRole } from "../activityLog";

type Props = {
  onLogin: (role: TamboRole) => void;
};

const LOGO_TAPS = 5;
const TAP_WINDOW_MS = 2500;

// Ingreso sin contraseña (29/10/2026, pedido explicito): por ahora es solo
// para probar. "Ingresar" entra directo como cliente; 5 toques seguidos al
// logo de Logic Lab entran como nosotros. Adentro es el mismo panel: el rol
// solo sirve para el registro de uso (saber si el cliente la prueba).
export function LoginScreen({ onLogin }: Props) {
  const tapsRef = useRef<number[]>([]);

  function handleLogoTap() {
    const now = Date.now();
    tapsRef.current = [...tapsRef.current.filter((time) => now - time < TAP_WINDOW_MS), now];
    if (tapsRef.current.length >= LOGO_TAPS) {
      tapsRef.current = [];
      onLogin("logiclab");
    }
  }

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <img
          src={`${import.meta.env.BASE_URL}logoLogicLab.png`}
          alt="Logic Lab"
          onClick={handleLogoTap}
          draggable={false}
          style={logoStyle}
        />
        <div style={{ textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>El Tambo</h1>
          <p style={{ margin: "6px 0 0", color: "var(--green-soft)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Registro de ordeñe
          </p>
        </div>
        <button type="button" className="save-btn" style={{ width: "100%" }} onClick={() => onLogin("cliente")}>
          Ingresar
        </button>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-soft)", textAlign: "center" }}>Versión de prueba · datos de ejemplo</p>
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px"
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 360,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 26
};

const logoStyle: React.CSSProperties = {
  width: 170,
  borderRadius: 12,
  userSelect: "none",
  WebkitTapHighlightColor: "transparent",
  cursor: "default"
};
