// Import required libraries
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Connect to SQLite database and create tables if they don't exist
const db = new sqlite3.Database('./expense_tracker.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    description TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL
  )`);
});

// POST /transactions - Add a new transaction
app.post('/transactions', (req, res) => {
  const { type, category, amount, date, description } = req.body;
  db.run(`INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`, 
    [type, category, amount, date, description], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// GET /transactions - Get all transactions
app.get('/transactions', (req, res) => {
  db.all(`SELECT * FROM transactions`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ transactions: rows });
  });
});

// GET /transactions/:id - Get a transaction by ID
app.get('/transactions/:id', (req, res) => {
  db.get(`SELECT * FROM transactions WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Transaction not found" });
    res.json({ transaction: row });
  });
});

// PUT /transactions/:id - Update a transaction by ID
app.put('/transactions/:id', (req, res) => {
  const { type, category, amount, date, description } = req.body;
  db.run(`UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`, 
    [type, category, amount, date, description, req.params.id], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Transaction not found" });
      res.json({ message: "Transaction updated successfully" });
    }
  );
});

// DELETE /transactions/:id - Delete a transaction by ID
app.delete('/transactions/:id', (req, res) => {
  db.run(`DELETE FROM transactions WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction deleted successfully" });
  });
});

// GET /summary - Get total income, total expenses, and balance
app.get('/summary', (req, res) => {
  db.get(`
    SELECT 
      (SELECT IFNULL(SUM(amount), 0) FROM transactions WHERE type = 'income') AS total_income,
      (SELECT IFNULL(SUM(amount), 0) FROM transactions WHERE type = 'expense') AS total_expense,
      (total_income - total_expense) AS balance
  `, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ summary: row });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


