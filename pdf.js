// ===== UTIL PARA CHECKS (CUADRO + X) =====
function drawCheck(pdf, x, y, checked) {
  pdf.rect(x, y - 3, 4, 4);
  if (checked) {
    pdf.line(x, y - 3, x + 4, y + 1);
    pdf.line(x + 4, y - 3, x, y + 1);
  }
}

async function generarPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const form = document.getElementById("informeForm");
  const data = Object.fromEntries(new FormData(form));

  let y = 15;

  // LOGO
  const logo = new Image();
  logo.src = "logo.png";
  await logo.decode();
  pdf.addImage(logo, "PNG", 150, 8, 40, 15);

  // TITULO
  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Informe diario de servicio", 10, y);
  y += 5;

  pdf.setFontSize(9);
  pdf.setFont("Helvetica", "normal");
  pdf.line(10, y, 200, y);
  y += 7;

  // DATOS GENERALES
  pdf.text("Fecha:", 10, y);
  pdf.text(data.fecha || "", 25, y);

  pdf.text("Servicio:", 60, y);
  pdf.text(data.servicio || "", 80, y);

  pdf.text("Turno:", 120, y);
  pdf.text(data.turno || "", 135, y);
  y += 7;

  pdf.text("Interno:", 10, y);
  pdf.text(data.interno || "", 30, y);

  pdf.text("Ruta:", 60, y);
  pdf.text(data.ruta || "", 75, y);

  pdf.text("N° CCT:", 120, y);
  pdf.text(data.cct || "", 140, y);
  y += 8;

  // CHOFER
  pdf.rect(10, y - 5, 190, 16);
  pdf.setFont("Helvetica", "bold");
  pdf.text("Chofer", 12, y);
  pdf.setFont("Helvetica", "normal");

  y += 5;
  pdf.text("Titular:", 12, y);
  pdf.text(data.chofer_titular || "", 30, y);

  y += 5;
  pdf.text("Reemplazo:", 12, y);
  pdf.text(data.chofer_reemplazo || "", 35, y);
  y += 10;

  // ===== CARGADOR 1 =====
  pdf.rect(10, y - 5, 190, 16);
  pdf.setFont("Helvetica", "bold");
  pdf.text("CARGADORES", 12, y);
  pdf.setFont("Helvetica", "normal");

  y += 6;
  pdf.text(data.cargador_1 || "", 12, y);
  y += 10;

  // ===== CARGADOR 2 =====
  pdf.rect(10, y - 5, 190, 16);
  pdf.setFont("Helvetica", "bold");
  pdf.text("CARGADORES", 12, y);
  pdf.setFont("Helvetica", "normal");

  y += 6;
  pdf.text(data.cargador_2 || "", 12, y);
  y += 12;

  // REVISIONES
  pdf.setFont("Helvetica", "bold");
  pdf.text("Revisión salida:", 10, y);
  pdf.setFont("Helvetica", "normal");

  drawCheck(pdf, 45, y, document.querySelector('[name="rev_salida_ok"]')?.checked);
  pdf.text("Sin novedades", 50, y);

  drawCheck(pdf, 90, y, document.querySelector('[name="rev_salida_obs"]')?.checked);
  pdf.text("Con novedades", 95, y);
  y += 6;

  pdf.setFont("Helvetica", "bold");
  pdf.text("Revisión llegada:", 10, y);
  pdf.setFont("Helvetica", "normal");

  drawCheck(pdf, 45, y, document.querySelector('[name="rev_llegada_ok"]')?.checked);
  pdf.text("Sin novedades", 50, y);

  drawCheck(pdf, 90, y, document.querySelector('[name="rev_llegada_obs"]')?.checked);
  pdf.text("Con novedades", 95, y);
  y += 10;

  // CHECKLIST TITULOS
  pdf.setFont("Helvetica", "bold");
  pdf.text("Funcionamiento luces", 10, y);
  pdf.text("Estado chasis", 70, y);
  pdf.text("Interior cabina", 130, y);
  pdf.setFont("Helvetica", "normal");
  y += 5;

  const luces = [
    ["Posición", "luces_posicion"],
    ["Bajas", "luces_bajas"],
    ["Altas", "luces_altas"],
    ["Stop", "luces_stop"],
    ["Giro", "luces_giro"],
    ["Retroceso", "luces_retroceso"]
  ];

  const chasis = [
    ["Espejos", "espejos"],
    ["Vidrios", "vidrios"],
    ["Manija puerta", "manija"],
    ["Estribos", "estribos"],
    ["Paragolpes", "paragolpes"],
    ["Guardabarros", "guardabarros"]
  ];

  const cabina = [
    ["Asientos", "asientos"],
    ["Cinturón", "cinturon"],
    ["Manija interior", "manija_int"],
    ["Limpieza", "limpieza"],
    ["Luces tablero", "luces_tablero"]
  ];

  for (let i = 0; i < 6; i++) {
    if (luces[i]) {
      drawCheck(pdf, 10, y, document.querySelector(`[name="${luces[i][1]}"]`)?.checked);
      pdf.text(luces[i][0], 15, y);
    }
    if (chasis[i]) {
      drawCheck(pdf, 70, y, document.querySelector(`[name="${chasis[i][1]}"]`)?.checked);
      pdf.text(chasis[i][0], 75, y);
    }
    if (cabina[i]) {
      drawCheck(pdf, 130, y, document.querySelector(`[name="${cabina[i][1]}"]`)?.checked);
      pdf.text(cabina[i][0], 135, y);
    }
    y += 5;
  }

  y += 4;

  // OBSERVACIONES
  pdf.rect(10, y, 190, 22);
  pdf.text("Observaciones:", 12, y + 5);
  pdf.text(data.observaciones || "", 12, y + 10, { maxWidth: 186 });
  y += 30;

  // FIRMA
  pdf.setFont("Helvetica", "bold");
  pdf.text("Firma del conductor", 10, y);
  pdf.setFont("Helvetica", "normal");

  pdf.rect(10, y + 3, 90, 28);
  const firmaImg = document.getElementById("firma").toDataURL("image/png");
  pdf.addImage(firmaImg, "PNG", 12, y + 5, 86, 24);

  // PIE
  pdf.setFontSize(8);
  pdf.text("Documento generado digitalmente", 10, 285);

  // GUARDAR Y PREPARAR PARA COMPARTIR
  const pdfBlob = pdf.output("blob");
  window.lastPDF = new File(
    [pdfBlob],
    `Informe_Conductor_${data.fecha || "sin_fecha"}.pdf`,
    { type: "application/pdf" }
  );

  pdf.save(window.lastPDF.name);
}

// ===== COMPARTIR POR WHATSAPP =====
async function compartirWhatsApp() {
  if (!window.lastPDF) {
    alert("Primero generá el PDF");
    return;
  }

  if (navigator.canShare && navigator.canShare({ files: [window.lastPDF] })) {
    await navigator.share({
      title: "Informe diario de servicio",
      text: "Adjunto informe diario",
      files: [window.lastPDF]
    });
  } else {
    const url = URL.createObjectURL(window.lastPDF);
    window.open("https://wa.me/");
    window.open(url);
  }
}