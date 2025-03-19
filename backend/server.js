const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware para permitir JSON y CORS
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Ruta para guardar el XML
app.post('/api/guardar-xml', (req, res) => {
  const xmlData = req.body.xml;

  if (!xmlData) {
    return res.status(400).json({ error: 'No se proporcionó el XML' });
  }

  const filePath = path.join(__dirname, '..', 'public', 'assets', 'productos.xml');

  fs.writeFile(filePath, xmlData, (err) => {
    if (err) {
      console.error('Error al guardar el XML:', err);
      return res.status(500).json({ error: 'Error al guardar el XML' });
    }
    res.json({ message: 'XML guardado con éxito' });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
