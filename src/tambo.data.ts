import type { EstadoVaca, RegistroOrdeñe, Vaca } from "./tambo.types";

// Datos de ejemplo para la demo. No hay backend todavia: lo que carga el
// Operario se agrega en memoria y se pierde al refrescar la pagina.
//
// Desde 29/10/2026 (pedido explicito: "que quede igual al video") hay una
// lista fija de vacas por caravana y 7 dias de historial por vaca, para que
// el Administrador vea la grafica de rendimiento. N30258 es la del video:
// viene subiendo dia a dia y hoy queda sin cargar para registrarla en vivo.
export const VACAS: Vaca[] = [
  { caravana: "N30258", raza: "Holando", lactancia: 4, edadAnios: 6 },
  { caravana: "N30144", raza: "Holando", lactancia: 2, edadAnios: 4 },
  { caravana: "N30390", raza: "Jersey", lactancia: 3, edadAnios: 5 },
  { caravana: "B845", raza: "Holando", lactancia: 1, edadAnios: 2 },
  { caravana: "C212", raza: "Jersey", lactancia: 3, edadAnios: 4 },
  { caravana: "D903", raza: "Holando", lactancia: 3, edadAnios: 5 },
  { caravana: "N1327", raza: "Holando", lactancia: 4, edadAnios: 6 },
  { caravana: "F118", raza: "Cruza", lactancia: 1, edadAnios: 3, nota: "Rengueó de la pata trasera derecha." }
];

type Historial = { litros: number[]; estado?: EstadoVaca; detalle?: string };

// Litros de los ultimos dias, del mas viejo (hace 6 dias) a hoy. Si el
// array tiene 6 valores, hoy queda sin cargar.
const HISTORIAL: Record<string, Historial> = {
  N30258: { litros: [12.4, 13.1, 14.0, 14.9, 15.8, 17.0] },
  N30144: { litros: [20.2, 21.4, 20.8, 21.9, 21.1, 22.0, 21.0] },
  N30390: { litros: [14.1, 14.8, 15.0, 14.6, 15.4, 15.1, 15.2] },
  B845: {
    litros: [13.0, 12.1, 11.4, 10.6, 10.2, 9.8, 10.0],
    estado: "mastitis",
    detalle: "Mastitis en la ubre izquierda delantera."
  },
  C212: {
    litros: [11.8, 11.5, 11.6, 11.2, 11.0, 11.3, 11.0],
    estado: "preñada",
    detalle: "Vaca de cría, preñada (último trimestre)."
  },
  D903: { litros: [16.2, 16.8, 16.5, 17.1, 17.4, 17.0] },
  N1327: { litros: [13.9, 14.2, 14.0, 14.5, 14.1, 14.4, 14.0] },
  F118: {
    litros: [9.4, 9.0, 8.1, 7.6, 8.2, 8.9, 9.5],
    estado: "tratamiento",
    detalle: "Tratamiento por renguera, mejorando."
  }
};

function buildSeed(): RegistroOrdeñe[] {
  const registros: RegistroOrdeñe[] = [];
  let id = 1;
  VACAS.forEach((vaca, vacaIndex) => {
    const historial = HISTORIAL[vaca.caravana];
    historial.litros.forEach((litros, dayIndex) => {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - 6 + dayIndex);
      fecha.setHours(6, 10 + vacaIndex * 12, 0, 0);
      const esUltimo = dayIndex === historial.litros.length - 1;
      registros.push({
        id: id++,
        caravana: vaca.caravana,
        litros,
        fechaHoraIso: fecha.toISOString(),
        edadAnios: vaca.edadAnios,
        estado: esUltimo && historial.estado ? historial.estado : "sana",
        detalle: esUltimo && historial.detalle ? historial.detalle : "Sin novedades."
      });
    });
  });
  return registros;
}

export const SEED_REGISTROS: RegistroOrdeñe[] = buildSeed();

export function isSameDay(iso: string, day: Date) {
  const date = new Date(iso);
  return (
    date.getFullYear() === day.getFullYear() && date.getMonth() === day.getMonth() && date.getDate() === day.getDate()
  );
}
