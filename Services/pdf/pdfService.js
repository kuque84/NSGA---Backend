const PDFDocument = require("pdfkit");
const path = require("path");

// Ruta absoluta del archivo de imagen del membrete
const imagePath = path.resolve(
  __dirname,
  "../../Src/Img/MEMBRETE - 2024 - completo.png"
);
console.log("Image path:", imagePath); // Verifica que la ruta sea correcta

// Márgenes en puntos (1 cm ≈ 28.35 puntos)
const MARGEN_TOP = 3 * 28.35;
const MARGEN_LEFT = 3 * 28.35;
const MARGEN_RIGHT = 2 * 28.35;
const MARGEN_BOTTOM = 3 * 28.35;

const addMembrete = (doc) => {
  console.log("Añadiendo membrete...");
  console.log("Image path:", imagePath); // Verifica que la ruta sea correcta
  try {
    // Ajusta el membrete para que ocupe toda la página, considerando los márgenes
    doc.image(imagePath, 0, 0, {
      width: 595.276, // Ancho de A4 en puntos
      height: 841.89, // Alto de A4 en puntos
      align: "center",
      valign: "top",
    });
  } catch (error) {
    console.error("Error al agregar el membrete:", error);
  }
};

const addHeader = (doc, title) => {
  doc
    .font("Helvetica-Bold")
    .fillColor("black")
    .text(title, {
      align: "center",
      baseline: (MARGEN_TOP - 50) * -1, // Ajuste basado en el margen superior para evitar superposición con el membrete
    })
    .moveDown();
};

const addTextWithMargins = (doc, text, options = {}) => {
  const { x = MARGEN_LEFT, y = MARGEN_TOP, align = "left" } = options;
  doc.text(text, x, y, { align });
};

const addFooter = (doc, footerText) => {
  const bottomY = doc.page.height - MARGEN_BOTTOM + 20; // Ajuste para que el pie de página no quede demasiado cerca del borde
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("gray")
    .text(footerText, MARGEN_LEFT, bottomY, {
      align: "center",
      width: doc.page.width - MARGEN_LEFT - MARGEN_RIGHT,
    });
  //ágina x de y
  doc.text(
    `Página ${doc.page.number} de ${doc.pageCount}`,
    MARGEN_LEFT,
    bottomY + 10,
    {
      align: "center",
      width: doc.page.width - MARGEN_LEFT - MARGEN_RIGHT,
    }
  );
};

module.exports = {
  addMembrete,
  addHeader,
  addTextWithMargins,
  addFooter,
  MARGEN_TOP, // Exportar constantes
  MARGEN_LEFT,
  MARGEN_RIGHT,
  MARGEN_BOTTOM,
};
