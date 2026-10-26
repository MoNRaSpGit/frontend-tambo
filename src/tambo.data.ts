import type { RegistroOrdeñe } from "./tambo.types";

// Datos de ejemplo para la demo (pedido explicito, 25/10/2026): "no ponga
// solo un ejemplo hardcodeado, pone tipo cuatro". No hay backend todavia --
// esto es lo unico que ve el Administrador hasta que el Operario cargue
// algo nuevo (que se agrega en memoria, se pierde al refrescar la pagina).
export const SEED_REGISTROS: RegistroOrdeñe[] = [
  {
    id: 1,
    caravana: "N1327",
    litros: 14,
    fechaHoraIso: "2026-10-25T06:32:00",
    edadAnios: 6,
    estado: "sana",
    detalle: "Sin novedades."
  },
  {
    id: 2,
    caravana: "B845",
    litros: 10,
    fechaHoraIso: "2026-10-25T09:54:00",
    edadAnios: 2,
    estado: "mastitis",
    detalle: "Mastitis en la ubre izquierda delantera."
  },
  {
    id: 3,
    caravana: "C212",
    litros: 11,
    fechaHoraIso: "2026-10-25T10:15:00",
    edadAnios: 4,
    estado: "preñada",
    detalle: "Vaca de cría, preñada (último trimestre)."
  },
  {
    id: 4,
    caravana: "D903",
    litros: 13,
    fechaHoraIso: "2026-10-25T11:40:00",
    edadAnios: 5,
    estado: "sana",
    detalle: "Sin novedades."
  }
];
