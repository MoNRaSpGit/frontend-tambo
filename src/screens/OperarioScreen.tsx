import { useMemo, useState } from "react";
import { isSameDay } from "../tambo.data";
import type { RegistroOrdeñe, Vaca } from "../tambo.types";

type Props = {
  vacas: Vaca[];
  registros: RegistroOrdeñe[];
  onRegister: (registro: Omit<RegistroOrdeñe, "id">) => void;
};

// Registro de ordeñe como en el video (29/10/2026): lista de vacas por
// caravana -> se toca una -> Litros y Descripcion -> Guardar ("✓ Guardado"
// + cartel) y vuelve a la lista. El Estado se saco de la app para hacerla
// mas simple (pedido 29/10/2026; en el video SI queda): se guarda "sana".
export function OperarioScreen({ vacas, registros, onRegister }: Props) {
  const [selected, setSelected] = useState<Vaca | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(false);

  const today = new Date();
  const litrosHoy = useMemo(() => {
    const map = new Map<string, number>();
    for (const registro of registros) {
      if (!isSameDay(registro.fechaHoraIso, today)) continue;
      map.set(registro.caravana, (map.get(registro.caravana) ?? 0) + registro.litros);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registros]);

  const filtered = vacas.filter((vaca) => vaca.caravana.toLowerCase().includes(search.trim().toLowerCase()));

  function handleSaved() {
    setToast(true);
    window.setTimeout(() => setToast(false), 2200);
    window.setTimeout(() => setSelected(null), 1100);
  }

  return (
    <section>
      {selected ? (
        <RegistroForm key={selected.caravana} vaca={selected} onBack={() => setSelected(null)} onRegister={onRegister} onSaved={handleSaved} />
      ) : (
        <div className="view-in" style={{ display: "grid", gap: 10 }}>
          <div style={listLabelStyle}>Vacas (por caravana)</div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar caravana…"
            style={searchStyle}
          />
          <div style={{ display: "grid", gap: 8 }}>
            {filtered.map((vaca) => {
              const litros = litrosHoy.get(vaca.caravana);
              return (
                <button key={vaca.caravana} type="button" className="cow-card" onClick={() => setSelected(vaca)}>
                  <div style={avatarStyle}>{vaca.caravana.slice(-3)}</div>
                  <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 700 }}>Caravana {vaca.caravana}</span>
                    <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                      {vaca.raza}
                      {vaca.lactancia > 0 ? ` · ${vaca.lactancia}ª lactancia` : ""}
                    </span>
                  </div>
                  {litros !== undefined ? (
                    <span style={litersChipStyle}>{litros.toFixed(1)} L</span>
                  ) : (
                    <span style={pendingChipStyle}>Sin cargar</span>
                  )}
                </button>
              );
            })}
            {filtered.length === 0 ? <div style={emptyStyle}>No hay vacas con esa caravana. Cargala en "Ganado".</div> : null}
          </div>
        </div>
      )}
      {toast ? <div className="saved-toast">✓ Datos del animal guardados</div> : null}
    </section>
  );
}

type FormProps = {
  vaca: Vaca;
  onBack: () => void;
  onRegister: Props["onRegister"];
  onSaved: () => void;
};

function RegistroForm({ vaca, onBack, onRegister, onSaved }: FormProps) {
  const [litros, setLitros] = useState("");
  const [detalle, setDetalle] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (saved) return;
    const litrosValue = Number(litros.replace(",", "."));
    if (!Number.isFinite(litrosValue) || litrosValue <= 0) {
      alert("Escribí los litros ordeñados.");
      return;
    }
    onRegister({
      caravana: vaca.caravana,
      litros: Number(litrosValue.toFixed(1)),
      fechaHoraIso: new Date().toISOString(),
      edadAnios: vaca.edadAnios,
      estado: "sana",
      detalle: detalle.trim() || "Sin novedades."
    });
    setSaved(true);
    onSaved();
  }

  return (
    <div className="view-in" style={{ display: "grid", gap: 9 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <button type="button" onClick={onBack} style={backStyle} aria-label="Volver">
          ←
        </button>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 18, fontWeight: 800 }}>Caravana {vaca.caravana}</span>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Registro de hoy</span>
        </div>
      </div>

      <label className="detail-row">
        <span className="detail-label">Litros</span>
        <input
          className="detail-input liters"
          inputMode="decimal"
          value={litros}
          onChange={(event) => setLitros(event.target.value.replace(/[^0-9.,]/g, ""))}
          placeholder="0.0 L"
          autoFocus
        />
      </label>

      {/* Descripcion libre: para anotar algo que no entra en los estados
          fijos (ej. "se quebro el pie", "cojea de la pata trasera"). */}
      <label className="detail-row column">
        <span className="detail-label">Descripción</span>
        <textarea
          className="detail-textarea"
          value={detalle}
          onChange={(event) => setDetalle(event.target.value)}
          rows={3}
          placeholder="Ej: Animal en buen estado, come bien."
        />
      </label>

      <button type="button" className={`save-btn${saved ? " is-saved" : ""}`} style={{ marginTop: 8 }} onClick={handleSave}>
        {saved ? "✓ Guardado" : "Guardar"}
      </button>
    </div>
  );
}

const listLabelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--green-soft)",
  margin: "2px 0 0 2px"
};

const searchStyle: React.CSSProperties = {
  minHeight: 44,
  padding: "10px 14px",
  borderRadius: 13,
  border: "1px solid var(--line)",
  background: "var(--card)",
  color: "var(--ink)",
  fontSize: 15,
  outline: "none"
};

const avatarStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  background: "var(--green-soft)",
  color: "var(--panel)",
  fontSize: 12.5,
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const litersChipStyle: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 700,
  color: "var(--gold-soft)",
  padding: "5px 10px",
  borderRadius: 999,
  background: "rgba(217,165,43,.12)",
  whiteSpace: "nowrap"
};

const pendingChipStyle: React.CSSProperties = {
  ...litersChipStyle,
  color: "var(--ink-soft)",
  background: "rgba(238,243,234,.06)",
  fontWeight: 600
};

const backStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: 0,
  background: "rgba(238,243,234,.08)",
  color: "var(--ink)",
  fontSize: 16,
  cursor: "pointer",
  flexShrink: 0
};

const emptyStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 14,
  border: "1px dashed var(--line)",
  color: "var(--ink-soft)",
  textAlign: "center"
};
