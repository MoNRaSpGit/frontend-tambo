import type { RegistroOrdeñe } from "../tambo.types";
import { isSameDay } from "../tambo.data";

type Props = {
  caravana: string;
  registros: RegistroOrdeñe[];
};

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const CHART_H = 200;
const BAR_MAX = 165;

// Grafica de rendimiento de una vaca, ultimos 7 dias (como en el video de
// El Tambo, 29/10/2026): barras que suben de a una, la de hoy en dorado,
// linea de tendencia y cartel con la diferencia de la semana. Se vuelve a
// animar al cambiar de vaca (key en el contenedor).
export function RendimientoChart({ caravana, registros }: Props) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - 6 + index);
    const litros = registros
      .filter((registro) => registro.caravana === caravana && isSameDay(registro.fechaHoraIso, day))
      .reduce((sum, registro) => sum + registro.litros, 0);
    return { label: DAY_NAMES[day.getDay()], litros };
  });

  const withData = days.filter((day) => day.litros > 0);
  const max = Math.max(1, ...days.map((day) => day.litros));
  const first = withData[0]?.litros ?? 0;
  const last = withData[withData.length - 1]?.litros ?? 0;
  const diff = first > 0 && withData.length > 1 ? Math.round(((last - first) / first) * 100) : null;
  const lastIndex = days.reduce((acc, day, index) => (day.litros > 0 ? index : acc), -1);

  const colW = 100 / days.length;
  const points = days
    .map((day, index) => (day.litros > 0 ? { x: colW * index + colW / 2, y: CHART_H - (day.litros / max) * BAR_MAX - 26 } : null))
    .filter((point): point is { x: number; y: number } => point !== null);

  return (
    <div key={caravana} style={{ display: "grid", gap: 12 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--green-soft)" }}>Rendimiento</div>
        <div style={{ marginTop: 4, fontSize: 17, fontWeight: 800 }}>Caravana {caravana} · últimos 7 días</div>
      </div>

      {diff !== null ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span className="chart-badge" style={badgeStyle(diff >= 0)}>
            {diff >= 0 ? "▲ +" : "▼ "}
            {diff}% en la semana
          </span>
        </div>
      ) : null}

      {withData.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--ink-soft)", padding: 24 }}>Todavía no hay ordeñes de esta vaca.</div>
      ) : (
        <div>
          <div style={{ position: "relative", height: CHART_H, borderBottom: "2px solid rgba(238,243,234,.15)", margin: "0 4px" }}>
            {days.map((day, index) => {
              if (day.litros <= 0) return null;
              const h = (day.litros / max) * BAR_MAX;
              const delay = `${index * 0.09}s`;
              return (
                <div key={index}>
                  <div
                    className={`chart-bar${index === lastIndex ? " is-last" : ""}`}
                    style={{ left: `calc(${colW * index + colW / 2}% - 15px)`, width: 30, height: h, animationDelay: delay }}
                  />
                  <div className="chart-value" style={{ left: `${colW * index + colW / 2}%`, bottom: h + 6, animationDelay: delay }}>
                    {day.litros.toFixed(1)}
                  </div>
                </div>
              );
            })}
            {points.length > 1 ? (
              <svg className="chart-trend" viewBox={`0 0 100 ${CHART_H}`} preserveAspectRatio="none" style={{ width: "100%", height: CHART_H, animationDelay: "0.8s" }}>
                <polyline
                  points={points.map((point) => `${point.x},${point.y}`).join(" ")}
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            ) : null}
          </div>
          <div style={{ display: "flex", margin: "6px 4px 0" }}>
            {days.map((day, index) => (
              <span key={index} style={{ width: `${colW}%`, textAlign: "center", fontSize: 11, color: "var(--ink-soft)" }}>
                {day.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function badgeStyle(up: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    padding: "6px 14px",
    borderRadius: 999,
    background: up ? "rgba(217,165,43,.16)" : "rgba(240,128,128,.14)",
    border: `1px solid ${up ? "rgba(217,165,43,.5)" : "rgba(240,128,128,.45)"}`,
    color: up ? "var(--gold-soft)" : "var(--red-soft)",
    fontSize: 14,
    fontWeight: 800
  };
}
