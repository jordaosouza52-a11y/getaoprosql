const express = require('express');
const router = express.Router();

// POST - Upload de arquivo
router.post('/UploadFile', (req, res) => {
  // Simular upload de arquivo
  const fileUrl = `http://localhost:5000/uploads/${Date.now()}-file`;
  res.json({ success: true, file_url: fileUrl, message: 'Arquivo enviado com sucesso' });
});

// POST - Extrair dados de arquivo enviado
router.post('/ExtractDataFromUploadedFile', async (req, res) => {
  // Simular extração de dados
  res.json({ success: true, extracted_data: {}, message: 'Dados extraídos com sucesso' });
});

module.exports = router;

