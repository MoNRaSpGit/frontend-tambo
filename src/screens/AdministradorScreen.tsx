import { useMemo, useState } from "react";
import { EstadoPill } from "../components/EstadoPill";
import { RendimientoChart } from "../components/RendimientoChart";
import { isSameDay } from "../tambo.data";
import type { RegistroOrdeñe, Vaca } from "../tambo.types";

type Props = {
  vacas: Vaca[];
  registros: RegistroOrdeñe[];
};

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" });
}

// Resumen del dia + grafica de rendimiento por vaca (29/10/2026, igual al
// video) + movimientos de hoy.
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
  const conNovedad = deHoy.filter((item) => item.estado !== "sana").length;

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
          <span style={statLabelStyle}>Con novedad</span>
          <strong style={{ ...statValueStyle, color: conNovedad > 0 ? "var(--red-soft)" : "var(--green-soft)" }}>{conNovedad}</strong>
        </div>
      </div>

      <section style={panelStyle}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
          {vacas.map((vaca) => (
            <button
              key={vaca.caravana}
              type="button"
              className={`state-chip${caravana === vaca.caravana ? " is-active" : ""}`}
              style={{ flexShrink: 0 }}
              onClick={() => setCaravana(vaca.caravana)}
            >
              {vaca.caravana}
            </button>
          ))}
        </div>
        {caravana ? <RendimientoChart caravana={caravana} registros={registros} /> : null}
      </section>

      <section>
        <h3 style={{ margin: "0 0 10px", fontSize: 16 }}>Movimientos de hoy</h3>

        {deHoy.length === 0 ? (
          <div style={emptyStyle}>Todavía no hay ordeñes registrados hoy.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {deHoy.map((registro) => {
              const isExpanded = expandedId === registro.id;
              return (
                <article
                  key={registro.id}
                  style={isExpanded ? movementCardExpandedStyle : movementCardStyle}
                  onClick={() => setExpandedId(isExpanded ? null : registro.id)}
                >
                  <div style={movementHeaderStyle}>
                    <span style={chevronStyle(isExpanded)}>›</span>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>Vaca {registro.caravana}</span>
                    <span style={{ fontWeight: 800, color: "var(--gold-soft)" }}>{registro.litros.toFixed(1)} L</span>
                    <span style={{ color: "var(--ink-soft)", fontSize: 13 }}>{formatHora(registro.fechaHoraIso)}</span>
                  </div>

                  {isExpanded ? (
                    <div style={movementDetailStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <EstadoPill estado={registro.estado} />
                        {registro.edadAnios > 0 ? (
                          <span style={{ color: "var(--ink-soft)", fontSize: 13, fontWeight: 700 }}>{registro.edadAnios} años</span>
                        ) : null}
                      </div>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{registro.detalle || "Sin observaciones."}</p>
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
  gridTemplateColumns: "auto 1fr auto auto",
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

const movementDetailStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  paddingTop: 8,
  borderTop: "1px solid var(--line)"
};
