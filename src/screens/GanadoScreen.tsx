import { useState } from "react";
import type { Vaca } from "../tambo.types";

type Props = {
  vacas: Vaca[];
  onAdd: (vaca: Vaca) => void;
};

const RAZAS = ["Holando", "Jersey", "Cruza", "Otra"];

// "Ingresar ganado" (29/10/2026, pedido explicito): alta de una vaca con
// sus datos. Queda en la lista de Ordeñe para registrarle los litros.
export function GanadoScreen({ vacas, onAdd }: Props) {
  const [caravana, setCaravana] = useState("");
  const [raza, setRaza] = useState("Holando");
  const [edad, setEdad] = useState("");
  const [lactancia, setLactancia] = useState("");
  const [nota, setNota] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const tag = caravana.trim().toUpperCase();
    if (!tag) {
      alert("Falta el número de caravana.");
      return;
    }
    if (vacas.some((vaca) => vaca.caravana === tag)) {
      alert(`La caravana ${tag} ya está ingresada.`);
      return;
    }
    onAdd({
      caravana: tag,
      raza,
      edadAnios: edad ? Number(edad) : 0,
      lactancia: lactancia ? Number(lactancia) : 0,
      nota: nota.trim() || undefined
    });
    setSaved(tag);
    setCaravana("");
    setEdad("");
    setLactancia("");
    setNota("");
    window.setTimeout(() => setSaved(null), 2200);
  }

  return (
    <section className="view-in" style={{ display: "grid", gap: 18 }}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 9 }}>
        <div style={sectionLabelStyle}>Ingresar ganado</div>

        <label className="detail-row">
          <span className="detail-label">Caravana</span>
          <input
            className="detail-input"
            value={caravana}
            onChange={(event) => setCaravana(event.target.value)}
            placeholder="Ej: N30500"
            autoCapitalize="characters"
          />
        </label>

        <div className="detail-row column">
          <span className="detail-label">Raza</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {RAZAS.map((item) => (
              <button key={item} type="button" className={`state-chip${raza === item ? " is-active" : ""}`} onClick={() => setRaza(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
          <label className="detail-row">
            <span className="detail-label">Edad</span>
            <input
              className="detail-input"
              inputMode="numeric"
              value={edad}
              onChange={(event) => setEdad(event.target.value.replace(/\D/g, ""))}
              placeholder="años"
            />
          </label>
          <label className="detail-row">
            <span className="detail-label">Lactancia</span>
            <input
              className="detail-input"
              inputMode="numeric"
              value={lactancia}
              onChange={(event) => setLactancia(event.target.value.replace(/\D/g, ""))}
              placeholder="N.º"
            />
          </label>
        </div>

        <label className="detail-row column">
          <span className="detail-label">Observaciones</span>
          <textarea
            className="detail-textarea"
            value={nota}
            onChange={(event) => setNota(event.target.value)}
            rows={2}
            placeholder="Opcional"
          />
        </label>

        <button type="submit" className="save-btn" style={{ marginTop: 6 }}>
          Ingresar vaca
        </button>
      </form>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={sectionLabelStyle}>Rodeo ({vacas.length})</div>
        {vacas.map((vaca) => (
          <div key={vaca.caravana} style={rowStyle}>
            <span style={{ fontWeight: 700 }}>Caravana {vaca.caravana}</span>
            <span style={{ fontSize: 12.5, color: "var(--ink-soft)", textAlign: "right" }}>
              {vaca.raza}
              {vaca.edadAnios > 0 ? ` · ${vaca.edadAnios} años` : ""}
              {vaca.lactancia > 0 ? ` · ${vaca.lactancia}ª lact.` : ""}
            </span>
            {vaca.nota ? <span style={{ gridColumn: "1 / -1", fontSize: 13, color: "var(--ink-soft)" }}>{vaca.nota}</span> : null}
          </div>
        ))}
      </div>

      {saved ? <div className="saved-toast">✓ Vaca {saved} ingresada</div> : null}
    </section>
  );
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--green-soft)",
  margin: "2px 0 0 2px"
};

const rowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: "4px 10px",
  padding: "11px 14px",
  borderRadius: 13,
  background: "var(--card)",
  border: "1px solid var(--line)"
};
