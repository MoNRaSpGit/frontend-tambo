export type EstadoVaca = "sana" | "mastitis" | "preñada" | "cría" | "tratamiento";

export const ESTADO_LABEL: Record<EstadoVaca, string> = {
  sana: "Sana",
  mastitis: "Mastitis",
  "preñada": "Preñada",
  "cría": "Vaca de cría",
  tratamiento: "En tratamiento"
};

export type Vaca = {
  caravana: string;
  raza: string;
  lactancia: number;
  edadAnios: number;
  nota?: string;
};

export type RegistroOrdeñe = {
  id: number;
  caravana: string;
  litros: number;
  fechaHoraIso: string;
  edadAnios: number;
  estado: EstadoVaca;
  detalle: string;
};
