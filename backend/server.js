require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados SQLite
const DB_PATH = path.resolve(__dirname, 'gestaopro.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    // Inicializa o DB se o arquivo for novo
    const initScriptPath = path.resolve(__dirname, 'database.sqlite.sql');
    if (!fs.existsSync(DB_PATH) || fs.statSync(DB_PATH).size === 0) {
      console.log('Banco de dados vazio. Inicializando esquema...');
      const initScript = fs.readFileSync(initScriptPath, 'utf8');
      db.exec(initScript, (err) => {
        if (err) {
          console.error('Erro ao inicializar o esquema do DB:', err.message);
        } else {
          console.log('Esquema do DB inicializado com sucesso.');
        }
      });
    }
  }
});

// Middleware para adicionar o objeto db às requisições
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Rotas
const productRoutes = require('./routes/products');
const saleRoutes = require('./routes/sales');
const customerRoutes = require('./routes/customers');
const serviceRoutes = require('./routes/services');
const contractRoutes = require('./routes/contracts');
const materialRoutes = require('./routes/materials');
const expenseRoutes = require('./routes/expenses');
const productionOrderRoutes = require('./routes/productionOrders');
const supplierRoutes = require('./routes/suppliers');
const employeeRoutes = require('./routes/employees');
const employeeDocumentRoutes = require('./routes/employeeDocuments');
const invoiceRoutes = require('./routes/invoices');
const assetRoutes = require('./routes/assets');
const uploadRoutes = require('./routes/upload');

// Registrar rotas
app.use('/api/entities/Product', productRoutes);
app.use('/api/entities/Sale', saleRoutes);
app.use('/api/entities/Customer', customerRoutes);
app.use('/api/entities/Service', serviceRoutes);
app.use('/api/entities/Contract', contractRoutes);
app.use('/api/entities/Material', materialRoutes);
app.use('/api/entities/Expense', expenseRoutes);
app.use('/api/entities/ProductionOrder', productionOrderRoutes);
app.use('/api/entities/Supplier', supplierRoutes);
app.use('/api/entities/Employee', employeeRoutes);
app.use('/api/entities/EmployeeDocument', employeeDocumentRoutes);
app.use('/api/entities/Invoice', invoiceRoutes);
app.use('/api/entities/Asset', assetRoutes);
app.use('/api/integrations/Core', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

