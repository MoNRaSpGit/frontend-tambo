import { useRef, useState } from "react";
import { AdministradorScreen } from "./screens/AdministradorScreen";
import { OperarioScreen } from "./screens/OperarioScreen";
import { SEED_REGISTROS } from "./tambo.data";
import type { RegistroOrdeñe } from "./tambo.types";

type Tab = "operario" | "administrador";

export function App() {
  const [tab, setTab] = useState<Tab>("operario");
  const [registros, setRegistros] = useState<RegistroOrdeñe[]>(SEED_REGISTROS);
  const nextIdRef = useRef(SEED_REGISTROS.length + 1);

  function handleRegister(nuevo: Omit<RegistroOrdeñe, "id">) {
    setRegistros((current) => [...current, { ...nuevo, id: nextIdRef.current++ }]);
  }

  return (
    <main style={mainStyle}>
      <div style={shellStyle}>
        <header style={titleStyle}>
          <span style={kickerStyle}>Demo</span>
          <h1 style={{ margin: 0, fontSize: 28, color: "#1f3a1c" }}>El Tambo</h1>
        </header>

        <nav style={navStyle} role="tablist" aria-label="Secciones">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "operario"}
            onClick={() => setTab("operario")}
            style={tab === "operario" ? navButtonActiveStyle : navButtonStyle}
          >
            Operario
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "administrador"}
            onClick={() => setTab("administrador")}
            style={tab === "administrador" ? navButtonActiveStyle : navButtonStyle}
          >
            Administrador
          </button>
        </nav>

        {tab === "operario" ? <OperarioScreen onRegister={handleRegister} /> : <AdministradorScreen registros={registros} />}
      </div>
    </main>
  );
}

const mainStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "24px 14px 48px"
};

const shellStyle: React.CSSProperties = {
  maxWidth: 520,
  margin: "0 auto",
  display: "grid",
  gap: 16
};

const titleStyle: React.CSSProperties = {
  display: "grid",
  gap: 2
};

const kickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#5f8a52"
};

const navStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8
};

const navButtonStyle: React.CSSProperties = {
  minHeight: 46,
  borderRadius: 14,
  border: "1px solid #c7d8c1",
  background: "#f3f8f1",
  color: "#3a4f37",
  fontWeight: 800,
  cursor: "pointer"
};

const navButtonActiveStyle: React.CSSProperties = {
  ...navButtonStyle,
  border: "1px solid #2f5e2a",
  background: "#2f5e2a",
  color: "#f3f8f1"
};
