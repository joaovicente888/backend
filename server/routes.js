const express = require("express");
const router = express.Router();
const { db } = require("./db");

// GET - Listar todos os gastos
router.get("/gastos", (req, res) => {
  db.all("SELECT * FROM Gastos ORDER BY data_criacao DESC", [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar gastos:', err.message);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }
    res.json(rows);
  });
});

// POST - Criar um novo gasto
router.post("/gastos", (req, res) => {
  const { descricao, valor, categoria } = req.body;

  console.log(req.body)
  
  // Validação básica
  if (!descricao || !valor || !categoria) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.run(
    "INSERT INTO Gastos (descricao, valor, categoria) VALUES (?, ?, ?)",
    [descricao, parseFloat(valor), categoria],
    function(err) {
      if (err) {
        console.error('Erro ao criar gasto:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      res.status(201).json({ 
        id: this.lastID,
        message: 'Gasto criado com sucesso!'
      });
    }
  );
});

// PUT - Atualizar um gasto
router.put("/gastos/:id", (req, res) => {
  const { id } = req.params;
  const { descricao, valor, categoria } = req.body;
  
  // Validação básica
  if (!descricao || !valor || !categoria) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.run(
    "UPDATE Gastos SET descricao=?, valor=?, categoria=? WHERE id=?",
    [descricao, parseFloat(valor), categoria, parseInt(id)],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar gasto:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Gasto não encontrado' });
        return;
      }
      
      res.json({ message: 'Gasto atualizado com sucesso!' });
    }
  );
});

// DELETE - Deletar um gasto
router.delete("/gastos/:id", (req, res) => {
  const { id } = req.params;
  
  db.run("DELETE FROM Gastos WHERE id=?", [parseInt(id)], function(err) {
    if (err) {
      console.error('Erro ao deletar gasto:', err.message);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Gasto não encontrado' });
      return;
    }
    
    res.json({ message: 'Gasto deletado com sucesso!' });
  });
});

module.exports = router;