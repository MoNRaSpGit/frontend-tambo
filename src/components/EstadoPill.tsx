import type { EstadoVaca } from "../tambo.types";
import { ESTADO_LABEL } from "../tambo.types";

const COLORS: Record<EstadoVaca, { bg: string; fg: string }> = {
  sana: { bg: "#dff3dc", fg: "#235c1f" },
  mastitis: { bg: "#fbdede", fg: "#8a2222" },
  tratamiento: { bg: "#fdecc8", fg: "#8a5a10" },
  "preñada": { bg: "#dde8fb", fg: "#1f3f8a" },
  "cría": { bg: "#e6ddf7", fg: "#4a2b8a" }
};

export function EstadoPill({ estado }: { estado: EstadoVaca }) {
  const { bg, fg } = COLORS[estado];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 12,
        fontWeight: 800
      }}
    >
      {ESTADO_LABEL[estado]}
    </span>
  );
}
