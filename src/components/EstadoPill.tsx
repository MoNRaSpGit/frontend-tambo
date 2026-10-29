import type { EstadoVaca } from "../tambo.types";
import { ESTADO_LABEL } from "../tambo.types";

// Colores para el tema oscuro (verde/dorado, igual al video de El Tambo).
const COLORS: Record<EstadoVaca, { bg: string; fg: string }> = {
  sana: { bg: "rgba(143,209,166,.14)", fg: "#8fd1a6" },
  mastitis: { bg: "rgba(240,128,128,.15)", fg: "#f2a0a0" },
  tratamiento: { bg: "rgba(236,207,134,.15)", fg: "#eccf86" },
  "preñada": { bg: "rgba(140,175,240,.15)", fg: "#a9c3f5" },
  "cría": { bg: "rgba(190,160,240,.15)", fg: "#c9b3f2" }
};

export function EstadoPill({ estado }: { estado: EstadoVaca }) {
  const { bg, fg } = COLORS[estado];
  return (
    <span
      style={{
        display: "inline-flex",
        justifySelf: "start",
        alignItems: "center",
        padding: "4px 11px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 12.5,
        fontWeight: 700,
        whiteSpace: "nowrap"
      }}
    >
      {ESTADO_LABEL[estado]}
    </span>
  );
}
