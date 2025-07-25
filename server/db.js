const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Criar o banco de dados SQLite
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco SQLite:', err.message);
  } else {
    console.log('Conectado ao banco SQLite com sucesso!');
  }
});
// Criar a tabela Gastos se ela não existir
db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS Gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        categoria TEXT NOT NULL,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Erro ao criar tabela:', err.message);
      } else {
        console.log('Tabela Gastos criada/verificada com sucesso!');
      }
    });
  });
  
  module.exports = { db };