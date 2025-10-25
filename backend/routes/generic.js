const express = require('express');

// Factory para criar rotas CRUD genéricas
function createCrudRoutes(tableName, fields = []) {
  const router = express.Router();

  // Função utilitária para executar comandos SQL
  function runSql(db, sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this); // Retorna o objeto 'this' para acessar lastID e changes
        }
      });
    });
  }

  // Função utilitária para buscar resultados SQL
  function allSql(db, sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // GET - Listar todos com ordenação opcional
  router.get('/', async (req, res) => {
    try {
      const { order_by } = req.query;
      let query = `SELECT * FROM ${tableName}`;
      
      if (order_by) {
        query += ` ORDER BY ${order_by}`;
      }
      
      const rows = await allSql(req.db, query);
      
      res.json(rows);
    } catch (error) {
      console.error('Erro ao listar:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET - Obter por ID
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const query = `SELECT * FROM ${tableName} WHERE id = ?`;
      
      const rows = await allSql(req.db, query, [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Registro não encontrado' });
      }
      
      res.json(rows[0]);
    } catch (error) {
      console.error('Erro ao obter:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST - Criar novo registro
  router.post('/', async (req, res) => {
    try {
      const data = req.body;
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);
      
      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      
      const result = await runSql(req.db, query, values);
      
      res.status(201).json({ 
        id: result.lastID, 
        ...data 
      });
    } catch (error) {
      console.error('Erro ao criar:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // PUT - Atualizar registro
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      
      const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), id];
      
      const query = `UPDATE ${tableName} SET ${updates} WHERE id = ?`;
      
      const result = await runSql(req.db, query, values);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Registro não encontrado' });
      }
      
      res.json({ id, ...data });
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE - Deletar registro
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const query = `DELETE FROM ${tableName} WHERE id = ?`;
      
      const result = await runSql(req.db, query, [id]);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Registro não encontrado' });
      }
      
      res.json({ message: 'Registro deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = createCrudRoutes;

