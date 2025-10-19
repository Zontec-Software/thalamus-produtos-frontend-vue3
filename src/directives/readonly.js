// src/directives/readonly.js
function applyReadonly(el, on) {
  // IGNORAR itens marcados como "permitidos"
  const allowSelector = "[data-allow-when-readonly]";

  const nodes = el.querySelectorAll("input, textarea, select, button, a");
  nodes.forEach((n) => {
    if (n.closest(allowSelector) || n.matches(allowSelector)) return;

    const tag = n.tagName.toLowerCase();
    const type = (n.getAttribute("type") || "").toLowerCase();

    const mustDisable = tag === "select" || tag === "button" || type === "checkbox" || type === "radio" || type === "file";

    if (mustDisable) {
      n.disabled = !!on;
      if (on) n.blur();
    } else {
      n.readOnly = !!on;
      n.disabled = false;
    }

    if (on) n.setAttribute("tabindex", "-1");
    else n.removeAttribute("tabindex");

    n.classList.toggle("is-readonly", !!on);
  });

  // Bloquear cliques de elementos clicáveis
  const clickables = el.querySelectorAll("[data-block-when-readonly]");
  clickables.forEach((n) => {
    if (n.closest(allowSelector) || n.matches(allowSelector)) return;
    n.style.pointerEvents = on ? "none" : "";
    n.classList.toggle("is-readonly", !!on);
  });

  // Evita submit
  const forms = el.querySelectorAll("form");
  forms.forEach((f) => {
    if (on) {
      if (!f._readonlyHandler) {
        f._readonlyHandler = (e) => e.preventDefault();
        f.addEventListener("submit", f._readonlyHandler);
      }
    } else if (f._readonlyHandler) {
      f.removeEventListener("submit", f._readonlyHandler);
      delete f._readonlyHandler;
    }
  });
}

export default {
  mounted(el, binding) {
    applyReadonly(el, binding.value);
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) applyReadonly(el, binding.value);
    else applyReadonly(el, binding.value);
  },
};
