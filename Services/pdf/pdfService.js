const PDFDocument = require('pdfkit');
const path = require('path');

// Ruta absoluta del archivo de imagen
const imagePath = path.resolve(__dirname, '../../Src/Img/MEMBRETE - 2024 - completo.png');
console.log('Image path:', imagePath); // Verifica que la ruta sea correcta

// Márgenes en puntos (1 cm ≈ 28.35 puntos)
const MARGEN_TOP = 4 * 28.35;
const MARGEN_LEFT = 3 * 28.35;
const MARGEN_RIGHT = 2 * 28.35;
const MARGEN_BOTTOM = 3 * 28.35;

const addMembrete = (doc) => {
    console.log('Añadiendo membrete...');
    console.log('Image path:', imagePath); // Verifica que la ruta sea correcta
    // Ajusta el membrete para que ocupe toda la página, considerando los márgenes
    doc.image(imagePath, -MARGEN_LEFT, -MARGEN_TOP, {
        width: 595.276 + MARGEN_LEFT + MARGEN_RIGHT,  // Ancho total considerando los márgenes
        height: 841.890 + MARGEN_TOP + MARGEN_BOTTOM, // Alto total considerando los márgenes
        align: 'center',
        valign: 'top'
    });
};

// Ajusta los contenidos del PDF para respetar los márgenes
const addHeader = (doc, title) => {
    doc
      .fontSize(20)
      .text(title, {
          align: 'center',
          // Calcula la posición considerando el margen superior
          continued: false,
          baseline: MARGEN_TOP + 30 // Ajuste basado en el margen superior
      })
      .moveDown();
};

// Añadir un método para ajustar el contenido de texto con márgenes
const addTextWithMargins = (doc, text, options = {}) => {
    const {
        x = MARGEN_LEFT,
        y = MARGEN_TOP,
        align = 'left'
    } = options;

    doc.text(text, x, y, {
        align,
    });
};

module.exports = {
    addMembrete,
    addHeader,
    addTextWithMargins,
    MARGEN_TOP, // Exportar constantes
    MARGEN_LEFT,
    MARGEN_RIGHT,
    MARGEN_BOTTOM
};
