import { useMemo, useState } from "react";
import { CaravanaSearch } from "../components/CaravanaSearch";
import { RendimientoChart } from "../components/RendimientoChart";
import { isSameDay } from "../tambo.data";
import type { RegistroOrdeñe, Vaca } from "../tambo.types";

type Props = {
  vacas: Vaca[];
  registros: RegistroOrdeñe[];
};

function formatFechaHora(iso: string) {
  const date = new Date(iso);
  const dia = isSameDay(iso, new Date()) ? "Hoy" : date.toLocaleDateString("es-UY", { weekday: "short", day: "2-digit", month: "2-digit" });
  return `${dia} · ${date.toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" })}`;
}

// Resumen del dia + buscador de caravana: al elegir una vaca se ve SOLO esa
// vaca, su grafica de rendimiento y sus movimientos (29/10/2026).
export function AdministradorScreen({ vacas, registros }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [caravana, setCaravana] = useState(vacas[0]?.caravana ?? "");

  const today = new Date();
  const deHoy = useMemo(
    () =>
      registros
        .filter((registro) => isSameDay(registro.fechaHoraIso, today))
        .sort((left, right) => new Date(right.fechaHoraIso).getTime() - new Date(left.fechaHoraIso).getTime()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [registros]
  );

  const vacasOrdeñadas = new Set(deHoy.map((item) => item.caravana)).size;
  const totalLitros = deHoy.reduce((sum, item) => sum + item.litros, 0);
  // "Con novedad" (por Estado) se saco junto con el Estado (29/10/2026).
  const promedio = vacasOrdeñadas > 0 ? totalLitros / vacasOrdeñadas : 0;

  const deLaVaca = registros
    .filter((registro) => registro.caravana === caravana)
    .sort((left, right) => new Date(right.fechaHoraIso).getTime() - new Date(left.fechaHoraIso).getTime());

  function handleSelect(next: string) {
    setCaravana(next);
    setExpandedId(null);
  }

  return (
    <div className="view-in" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18 }}>
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Vacas ordeñadas</span>
          <strong style={statValueStyle}>{vacasOrdeñadas}</strong>
        </div>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Litros hoy</span>
          <strong style={{ ...statValueStyle, color: "var(--gold-soft)" }}>{totalLitros.toFixed(1)}</strong>
        </div>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Promedio x vaca</span>
          <strong style={{ ...statValueStyle, color: "var(--green-soft)" }}>{promedio.toFixed(1)}</strong>
        </div>
      </div>

      <section style={panelStyle}>
        <div style={{ marginBottom: 16 }}>
          <CaravanaSearch vacas={vacas} value={caravana} onChange={handleSelect} />
        </div>
        {caravana ? <RendimientoChart caravana={caravana} registros={registros} /> : null}
      </section>

      <section>
        <h3 style={{ margin: "0 0 10px", fontSize: 16 }}>Movimientos de la caravana {caravana}</h3>

        {deLaVaca.length === 0 ? (
          <div style={emptyStyle}>Todavía no hay movimientos de esta vaca.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {deLaVaca.map((registro) => {
              const isExpanded = expandedId === registro.id;
              return (
                <article
                  key={registro.id}
                  style={isExpanded ? movementCardExpandedStyle : movementCardStyle}
                  onClick={() => setExpandedId(isExpanded ? null : registro.id)}
                >
                  <div style={movementHeaderStyle}>
                    <span style={chevronStyle(isExpanded)}>›</span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{formatFechaHora(registro.fechaHoraIso)}</span>
                    <span style={{ fontWeight: 800, color: "var(--gold-soft)" }}>{registro.litros.toFixed(1)} L</span>
                  </div>

                  {isExpanded ? (
                    <div style={movementDetailStyle}>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{registro.detalle || "Sin observaciones."}</p>
                    </div>
                  ) : (
                    <p style={descPreviewStyle}>{registro.detalle || "Sin observaciones."}</p>
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

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 10
};

const statCardStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  padding: "14px 10px",
  borderRadius: 16,
  background: "var(--card)",
  border: "1px solid var(--line)",
  textAlign: "center"
};

const statLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "var(--ink-soft)",
  textTransform: "uppercase",
  letterSpacing: "0.04em"
};

const statValueStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800
};

const panelStyle: React.CSSProperties = {
  padding: "14px 12px 16px",
  borderRadius: 18,
  background: "var(--card)",
  border: "1px solid var(--line)"
};

const emptyStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 14,
  border: "1px dashed var(--line)",
  color: "var(--ink-soft)",
  textAlign: "center"
};

const movementCardStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  padding: "12px 14px",
  borderRadius: 16,
  background: "var(--card)",
  border: "1px solid var(--line)",
  cursor: "pointer"
};

const movementCardExpandedStyle: React.CSSProperties = {
  ...movementCardStyle,
  border: "1px solid rgba(143,209,166,.6)"
};

const movementHeaderStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  gap: 10
};

function chevronStyle(isOpen: boolean): React.CSSProperties {
  return {
    display: "inline-block",
    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 0.15s ease",
    color: "var(--green-soft)",
    fontWeight: 900,
    fontSize: 18
  };
}

const descPreviewStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13.5,
  color: "var(--ink-soft)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};

const movementDetailStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  paddingTop: 8,
  borderTop: "1px solid var(--line)"
};
