// Registro interno de uso (29/10/2026, pedido explicito: "para ver si mis
// clientes la prueban"). No hay pantalla que lo muestre: la app avisa sola
// al backend cuando alguien ingresa, sale, cambia de pestaña o guarda algo,
// y se consulta con backend/scripts/inspect-tambo-activity.js.
//
// "Quien" es un id que se genera solo la primera vez y queda guardado en el
// navegador. El rol dice como entro: "cliente" (boton Ingresar) o
// "logiclab" (nosotros, 5 toques al logo de Logic Lab).
const API_BASE_URL = "https://saasproback.onrender.com";
const VISITOR_KEY = "tambo-visitor-id";

export type TamboRole = "cliente" | "logiclab";
export type ActivityEvent = "login" | "logout" | "seccion" | "accion";

function randomId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function resolveVisitorId() {
  try {
    let visitorId = window.localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
      visitorId = randomId().slice(0, 40);
      window.localStorage.setItem(VISITOR_KEY, visitorId);
    }
    return visitorId;
  } catch {
    // Navegacion privada / storage bloqueado: igual se registra, pero cada
    // recarga cuenta como un visitante distinto.
    return randomId();
  }
}

// En localhost no se registra nada (son pruebas de desarrollo).
const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const visitorId = resolveVisitorId();

// Nunca rompe ni demora la app: si el aviso falla, se pierde y listo.
export function trackActivity(role: TamboRole, event: ActivityEvent, detail?: string) {
  if (isLocal) return;

  fetch(`${API_BASE_URL}/api/v1/tambo/activity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId, role, event, detail: detail?.slice(0, 200) }),
    keepalive: true
  }).catch(() => {});
}
