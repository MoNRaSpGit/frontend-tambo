import { useState } from "react";
import type { Vaca } from "../tambo.types";

type Props = {
  vacas: Vaca[];
  value: string;
  onChange: (caravana: string) => void;
};

// Buscador de caravana con lista desplegable (29/10/2026, pedido explicito:
// "un buscador con un select" en vez de todas las vacas en la cabecera).
// Se escribe parte del numero y se elige de la lista; si lo escrito es una
// caravana exacta se elige sola.
export function CaravanaSearch({ vacas, value, onChange }: Props) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const query = text.trim().toLowerCase();
  const matches = vacas.filter((vaca) => vaca.caravana.toLowerCase().includes(query));

  function pick(caravana: string) {
    onChange(caravana);
    setText("");
    setOpen(false);
  }

  function handleChange(next: string) {
    setText(next);
    setOpen(true);
    const exact = vacas.find((vaca) => vaca.caravana.toLowerCase() === next.trim().toLowerCase());
    if (exact) onChange(exact.caravana);
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={fieldStyle}>
        <span style={{ fontSize: 15, color: "var(--ink-soft)" }}>🔍</span>
        <input
          value={text}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && matches[0]) pick(matches[0].caravana);
          }}
          placeholder={value ? `Caravana ${value} · buscar otra…` : "Buscar caravana…"}
          style={inputStyle}
          autoCapitalize="characters"
        />
        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>▾</span>
      </div>

      {open ? (
        <div style={listStyle} role="listbox">
          {matches.length === 0 ? (
            <div style={{ padding: "12px 14px", color: "var(--ink-soft)", fontSize: 14 }}>No hay vacas con esa caravana.</div>
          ) : (
            matches.map((vaca) => (
              <button
                key={vaca.caravana}
                type="button"
                role="option"
                aria-selected={vaca.caravana === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(vaca.caravana)}
                style={vaca.caravana === value ? optionActiveStyle : optionStyle}
              >
                <span style={{ fontWeight: 700 }}>Caravana {vaca.caravana}</span>
                <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{vaca.raza}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "0 14px",
  minHeight: 48,
  borderRadius: 14,
  border: "1px solid rgba(143,209,166,.45)",
  background: "rgba(0,0,0,.2)"
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  border: 0,
  outline: "none",
  background: "transparent",
  color: "var(--ink)",
  fontSize: 16
};

const listStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  right: 0,
  zIndex: 5,
  maxHeight: 260,
  overflowY: "auto",
  borderRadius: 14,
  border: "1px solid var(--line)",
  background: "#16261c",
  boxShadow: "0 18px 36px rgba(0,0,0,.45)"
};

const optionStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  padding: "12px 14px",
  border: 0,
  borderBottom: "1px solid var(--line)",
  background: "transparent",
  color: "var(--ink)",
  fontSize: 14.5,
  textAlign: "left",
  cursor: "pointer"
};

const optionActiveStyle: React.CSSProperties = {
  ...optionStyle,
  background: "rgba(79,157,110,.18)",
  color: "var(--green-soft)"
};
