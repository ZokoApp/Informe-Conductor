// ================================
// 📋 FORM + AUTOGUARDADO
// ================================
const form = document.getElementById("informeForm");

window.addEventListener("load", () => {
  const saved = JSON.parse(localStorage.getItem("informe"));
  if (!saved) return;

  Object.keys(saved).forEach(key => {
    const field = form.elements[key];
    if (!field) return;

    if (field.type === "checkbox") {
      field.checked = saved[key];
    } else {
      field.value = saved[key];
    }
  });
});

form.addEventListener("input", () => {
  const data = {};
  Array.from(form.elements).forEach(el => {
    if (!el.name) return;
    if (el.type === "checkbox") {
      data[el.name] = el.checked;
    } else {
      data[el.name] = el.value;
    }
  });
  localStorage.setItem("informe", JSON.stringify(data));
});

// ================================
// ✍️ FIRMA EN MODAL (ANTI SCROLL)
// ================================
const firmaCanvas = document.getElementById("firmaModalCanvas");
const firmaCtx = firmaCanvas.getContext("2d");

let dibujandoFirma = false;

function abrirFirmaModal() {
  document.getElementById("firmaModal").style.display = "flex";

  setTimeout(() => {
    firmaCanvas.width = firmaCanvas.offsetWidth;
    firmaCanvas.height = firmaCanvas.offsetHeight;
    firmaCtx.lineWidth = 2;
    firmaCtx.lineCap = "round";
  }, 100);
}

// Dibujo con dedo o mouse
firmaCanvas.addEventListener("pointerdown", e => {
  dibujandoFirma = true;
  firmaCtx.beginPath();
  firmaCtx.moveTo(e.offsetX, e.offsetY);
});

firmaCanvas.addEventListener("pointermove", e => {
  if (!dibujandoFirma) return;
  firmaCtx.lineTo(e.offsetX, e.offsetY);
  firmaCtx.stroke();
});

firmaCanvas.addEventListener("pointerup", () => dibujandoFirma = false);
firmaCanvas.addEventListener("pointerleave", () => dibujandoFirma = false);

function limpiarFirmaModal() {
  firmaCtx.clearRect(0, 0, firmaCanvas.width, firmaCanvas.height);
}

function confirmarFirma() {
  const img = firmaCanvas.toDataURL("image/png");
  document.getElementById("firmaData").value = img;
  document.getElementById("firmaModal").style.display = "none";
}
