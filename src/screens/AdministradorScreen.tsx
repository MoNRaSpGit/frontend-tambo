import { useMemo, useState } from "react";
import type { RegistroOrdeñe } from "../tambo.types";
import { EstadoPill } from "../components/EstadoPill";

type Props = {
  registros: RegistroOrdeñe[];
};

function formatFechaHora(iso: string) {
  const date = new Date(iso);
  const dia = `${date.getDate()}`.padStart(2, "0");
  const mes = `${date.getMonth() + 1}`.padStart(2, "0");
  const hora = date.toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" });
  return `${dia}/${mes} - ${hora}`;
}

export function AdministradorScreen({ registros }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const recentFirst = useMemo(
    () => [...registros].sort((left, right) => new Date(right.fechaHoraIso).getTime() - new Date(left.fechaHoraIso).getTime()),
    [registros]
  );

  const vacasOrdeñadas = registros.length;
  const totalLitros = registros.reduce((sum, item) => sum + item.litros, 0);
  const conNovedad = registros.filter((item) => item.estado !== "sana").length;

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <section style={headerCardStyle}>
        <h2 style={{ margin: 0, fontSize: 22, color: "#1f3a1c" }}>Tambo N.º 1</h2>
        <p style={{ margin: "4px 0 0", color: "#51664e" }}>Resumen del ordeñe de hoy.</p>
      </section>

      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Vacas ordeñadas</span>
          <strong style={statValueStyle}>{vacasOrdeñadas}</strong>
        </div>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Total litros</span>
          <strong style={statValueStyle}>{totalLitros.toFixed(1)} L</strong>
        </div>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Con novedad</span>
          <strong style={{ ...statValueStyle, color: conNovedad > 0 ? "#8a2222" : "#235c1f" }}>{conNovedad}</strong>
        </div>
      </div>

      <section>
        <h3 style={{ margin: "0 0 10px", fontSize: 17, color: "#1f3a1c" }}>Movimientos</h3>

        {recentFirst.length === 0 ? (
          <div style={emptyStyle}>Todavia no hay ordeñes registrados hoy.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {recentFirst.map((registro) => {
              const isExpanded = expandedId === registro.id;
              return (
                <article
                  key={registro.id}
                  style={isExpanded ? movementCardExpandedStyle : movementCardStyle}
                  onClick={() => setExpandedId(isExpanded ? null : registro.id)}
                >
                  <div style={movementHeaderStyle}>
                    <span style={chevronStyle(isExpanded)}>›</span>
                    <span style={caravanaBadgeStyle}>Vaca {registro.caravana}</span>
                    <span style={litrosStyle}>{registro.litros.toFixed(1)} L</span>
                    <span style={horaStyle}>{formatFechaHora(registro.fechaHoraIso)}</span>
                  </div>

                  {isExpanded ? (
                    <div style={movementDetailStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <EstadoPill estado={registro.estado} />
                        {registro.edadAnios > 0 ? <span style={detailTextStyle}>{registro.edadAnios} años</span> : null}
                      </div>
                      <p style={detailDescriptionStyle}>{registro.detalle || "Sin observaciones."}</p>
                    </div>
                  ) : (
                    <EstadoPill estado={registro.estado} />
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

const headerCardStyle: React.CSSProperties = {
  padding: "16px 20px",
  borderRadius: 20,
  background: "linear-gradient(135deg, #2f5e2a 0%, #1f3a1c 100%)",
  color: "#f3f8f1",
  boxShadow: "0 16px 32px rgba(35, 70, 30, 0.22)"
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 10
};

const statCardStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  padding: "14px 12px",
  borderRadius: 16,
  background: "#ffffff",
  border: "1px solid #d9e6d4",
  textAlign: "center"
};

const statLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#6a7f66",
  textTransform: "uppercase",
  letterSpacing: "0.04em"
};

const statValueStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: "#1f3a1c"
};

const emptyStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 14,
  border: "1px dashed #c7d8c1",
  color: "#6a7f66",
  textAlign: "center"
};

const movementCardStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  padding: "12px 14px",
  borderRadius: 16,
  background: "#ffffff",
  border: "1px solid #d9e6d4",
  cursor: "pointer"
};

const movementCardExpandedStyle: React.CSSProperties = {
  ...movementCardStyle,
  border: "1px solid #2f5e2a",
  boxShadow: "0 10px 20px rgba(35, 70, 30, 0.1)"
};

const movementHeaderStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr auto auto",
  alignItems: "center",
  gap: 10
};

function chevronStyle(isOpen: boolean): React.CSSProperties {
  return {
    display: "inline-block",
    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 0.15s ease",
    color: "#2f5e2a",
    fontWeight: 900,
    fontSize: 18
  };
}

const caravanaBadgeStyle: React.CSSProperties = {
  fontWeight: 800,
  color: "#1f3a1c",
  fontSize: 15
};

const litrosStyle: React.CSSProperties = {
  fontWeight: 800,
  color: "#2f5e2a"
};

const horaStyle: React.CSSProperties = {
  color: "#6a7f66",
  fontSize: 13
};

const movementDetailStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  paddingTop: 4,
  borderTop: "1px solid #e4ede1"
};

const detailTextStyle: React.CSSProperties = {
  color: "#51664e",
  fontSize: 13,
  fontWeight: 700
};

const detailDescriptionStyle: React.CSSProperties = {
  margin: 0,
  color: "#3a4f37",
  fontSize: 14,
  lineHeight: 1.5
};
