import { useState } from "react";
import type { EstadoVaca, RegistroOrdeñe } from "../tambo.types";
import { ESTADO_LABEL } from "../tambo.types";

type Props = {
  onRegister: (registro: Omit<RegistroOrdeñe, "id">) => void;
};

const ESTADOS: EstadoVaca[] = ["sana", "mastitis", "tratamiento", "preñada", "cría"];

export function OperarioScreen({ onRegister }: Props) {
  const [caravana, setCaravana] = useState("");
  const [litros, setLitros] = useState("");
  const [edad, setEdad] = useState("");
  const [estado, setEstado] = useState<EstadoVaca>("sana");
  const [detalle, setDetalle] = useState("");
  const [confirmacion, setConfirmacion] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const litrosValue = Number(litros);
    if (!caravana.trim()) {
      alert("Falta el numero de caravana.");
      return;
    }
    if (!Number.isFinite(litrosValue) || litrosValue <= 0) {
      alert("Escribe los litros ordeñados.");
      return;
    }

    onRegister({
      caravana: caravana.trim().toUpperCase(),
      litros: Number(litrosValue.toFixed(1)),
      fechaHoraIso: new Date().toISOString(),
      edadAnios: edad ? Number(edad) : 0,
      estado,
      detalle: detalle.trim() || (estado === "sana" ? "Sin novedades." : "")
    });

    setConfirmacion(`Registrado: vaca ${caravana.trim().toUpperCase()} - ${litrosValue} L`);
    setCaravana("");
    setLitros("");
    setEdad("");
    setEstado("sana");
    setDetalle("");
    window.setTimeout(() => setConfirmacion(null), 2500);
  }

  return (
    <section style={cardStyle}>
      <h2 style={{ margin: 0, fontSize: 22, color: "#1f3a1c" }}>Registrar ordeñe</h2>
      <p style={{ margin: "4px 0 18px", color: "#51664e" }}>Cargá la vaca, los litros y cualquier novedad de salud.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
        <label style={fieldStyle}>
          <span style={labelStyle}>Número de caravana</span>
          <input
            type="text"
            value={caravana}
            onChange={(event) => setCaravana(event.target.value)}
            placeholder="Ej: N1327"
            style={inputStyle}
            autoFocus
          />
        </label>

        <label style={fieldStyle}>
          <span style={labelStyle}>Litros ordeñados</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            value={litros}
            onChange={(event) => setLitros(event.target.value)}
            placeholder="Ej: 12"
            style={inputStyle}
          />
        </label>

        <label style={fieldStyle}>
          <span style={labelStyle}>Edad aproximada (años)</span>
          <input
            type="number"
            min="0"
            step="1"
            value={edad}
            onChange={(event) => setEdad(event.target.value)}
            placeholder="Opcional"
            style={inputStyle}
          />
        </label>

        <label style={fieldStyle}>
          <span style={labelStyle}>Estado de la vaca</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ESTADOS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setEstado(item)}
                style={estado === item ? chipActiveStyle : chipStyle}
              >
                {ESTADO_LABEL[item]}
              </button>
            ))}
          </div>
        </label>

        {estado !== "sana" ? (
          <label style={fieldStyle}>
            <span style={labelStyle}>Detalle (ej: "mastitis en ubre izquierda delantera")</span>
            <textarea
              value={detalle}
              onChange={(event) => setDetalle(event.target.value)}
              rows={3}
              placeholder="Describí la novedad"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>
        ) : null}

        <button type="submit" style={submitButtonStyle}>
          Registrar ordeñe
        </button>

        {confirmacion ? <p style={confirmStyle}>{confirmacion}</p> : null}
      </form>
    </section>
  );
}

const cardStyle: React.CSSProperties = {
  maxWidth: 480,
  margin: "0 auto",
  padding: 20,
  borderRadius: 20,
  background: "#ffffff",
  border: "1px solid #d9e6d4",
  boxShadow: "0 16px 32px rgba(35, 70, 30, 0.08)"
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 6
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#3a4f37"
};

const inputStyle: React.CSSProperties = {
  minHeight: 46,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #c7d8c1",
  fontSize: 16,
  background: "#f8fbf6"
};

const chipStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 999,
  border: "1px solid #c7d8c1",
  background: "#f3f8f1",
  color: "#3a4f37",
  fontWeight: 700,
  cursor: "pointer"
};

const chipActiveStyle: React.CSSProperties = {
  ...chipStyle,
  border: "1px solid #2f5e2a",
  background: "#2f5e2a",
  color: "#f3f8f1"
};

const submitButtonStyle: React.CSSProperties = {
  minHeight: 50,
  borderRadius: 14,
  border: "none",
  background: "#2f5e2a",
  color: "#f3f8f1",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 12px 22px rgba(47, 94, 42, 0.26)"
};

const confirmStyle: React.CSSProperties = {
  margin: 0,
  textAlign: "center",
  color: "#235c1f",
  fontWeight: 700
};
