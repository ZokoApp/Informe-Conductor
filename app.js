const canvas = document.getElementById("firma");
const ctx = canvas.getContext("2d");

let dibujando = false;

function ajustarCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
ajustarCanvas();
window.addEventListener("resize", ajustarCanvas);

function getPos(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX - canvas.getBoundingClientRect().left,
      y: e.touches[0].clientY - canvas.getBoundingClientRect().top
    };
  }
  return {
    x: e.offsetX,
    y: e.offsetY
  };
}

function empezar(e) {
  dibujando = true;
  const p = getPos(e);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}

function mover(e) {
  if (!dibujando) return;
  const p = getPos(e);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

function terminar() {
  dibujando = false;
}

canvas.addEventListener("mousedown", empezar);
canvas.addEventListener("mousemove", mover);
canvas.addEventListener("mouseup", terminar);

canvas.addEventListener("touchstart", empezar);
canvas.addEventListener("touchmove", mover);
canvas.addEventListener("touchend", terminar);

function limpiarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
const form = document.getElementById("informeForm");

// Cargar datos guardados
window.addEventListener("load", () => {
  const saved = JSON.parse(localStorage.getItem("informe"));
  if (!saved) return;

  Object.keys(saved).forEach(key => {
    const field = form.elements[key];
    if (field) field.value = saved[key];
  });
});

// Guardar automáticamente
form.addEventListener("input", () => {
  const data = {};
  new FormData(form).forEach((v, k) => data[k] = v);
  localStorage.setItem("informe", JSON.stringify(data));
});