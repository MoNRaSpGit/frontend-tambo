import { useRef, useState } from "react";
import { trackActivity, type TamboRole } from "./activityLog";
import { AdministradorScreen } from "./screens/AdministradorScreen";
import { GanadoScreen } from "./screens/GanadoScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { OperarioScreen } from "./screens/OperarioScreen";
import { SEED_REGISTROS, VACAS } from "./tambo.data";
import type { RegistroOrdeñe, Vaca } from "./tambo.types";

type Tab = "ordeñe" | "ganado" | "resumen";

const TABS: { id: Tab; label: string }[] = [
  { id: "ordeñe", label: "Ordeñe" },
  { id: "ganado", label: "Ganado" },
  { id: "resumen", label: "Resumen" }
];

export function App() {
  // Sesion solo en memoria: recargar vuelve a la pantalla de ingreso.
  const [role, setRole] = useState<TamboRole | null>(null);
  const [tab, setTab] = useState<Tab>("ordeñe");
  const [vacas, setVacas] = useState<Vaca[]>(VACAS);
  const [registros, setRegistros] = useState<RegistroOrdeñe[]>(SEED_REGISTROS);
  const nextIdRef = useRef(SEED_REGISTROS.length + 1);

  function handleLogin(nextRole: TamboRole) {
    setRole(nextRole);
    setTab("ordeñe");
    trackActivity(nextRole, "login");
  }

  function handleLogout() {
    if (role) trackActivity(role, "logout");
    setRole(null);
  }

  function handleTab(next: Tab) {
    setTab(next);
    if (role) trackActivity(role, "seccion", next);
  }

  function handleRegister(nuevo: Omit<RegistroOrdeñe, "id">) {
    setRegistros((current) => [...current, { ...nuevo, id: nextIdRef.current++ }]);
    if (role) trackActivity(role, "accion", `Ordeñe ${nuevo.caravana} ${nuevo.litros} L`);
  }

  function handleAddVaca(vaca: Vaca) {
    setVacas((current) => [...current, vaca]);
    if (role) trackActivity(role, "accion", `Alta vaca ${vaca.caravana}`);
  }

  if (!role) return <LoginScreen onLogin={handleLogin} />;

  return (
    <main style={mainStyle}>
      <div style={shellStyle}>
        {/* Encabezado como en el video: monograma LL + nombre + subtitulo */}
        <header style={brandStyle}>
          <div style={monoStyle}>LL</div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span style={{ fontSize: 17, fontWeight: 800 }}>El Tambo</span>
            <span style={brandSubStyle}>Registro de ordeñe</span>
          </div>
          <button type="button" onClick={handleLogout} style={logoutStyle}>
            Salir
          </button>
        </header>

        <nav style={navStyle} role="tablist" aria-label="Secciones">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => handleTab(item.id)}
              style={tab === item.id ? navButtonActiveStyle : navButtonStyle}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {tab === "ordeñe" ? (
          <OperarioScreen vacas={vacas} registros={registros} onRegister={handleRegister} />
        ) : tab === "ganado" ? (
          <GanadoScreen vacas={vacas} onAdd={handleAddVaca} />
        ) : (
          <AdministradorScreen vacas={vacas} registros={registros} />
        )}
      </div>
    </main>
  );
}

const mainStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "20px 16px 48px"
};

const shellStyle: React.CSSProperties = {
  maxWidth: 520,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: 16
};

const brandStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12
};

const monoStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  border: "1.5px solid var(--green-soft)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  fontWeight: 800,
  color: "var(--green-soft)",
  flexShrink: 0
};

const brandSubStyle: React.CSSProperties = {
  fontSize: 11,
  color: "var(--green-soft)",
  letterSpacing: "0.08em",
  textTransform: "uppercase"
};

const logoutStyle: React.CSSProperties = {
  marginLeft: "auto",
  padding: "8px 14px",
  borderRadius: 999,
  border: "1px solid var(--line)",
  background: "transparent",
  color: "var(--ink-soft)",
  fontWeight: 700,
  cursor: "pointer"
};

const navStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 8
};

const navButtonStyle: React.CSSProperties = {
  minHeight: 44,
  borderRadius: 14,
  border: "1px solid var(--line)",
  background: "var(--card)",
  color: "var(--ink-soft)",
  fontWeight: 800,
  cursor: "pointer"
};

const navButtonActiveStyle: React.CSSProperties = {
  ...navButtonStyle,
  border: "1px solid rgba(143,209,166,.5)",
  background: "rgba(79,157,110,.18)",
  color: "var(--green-soft)"
};
