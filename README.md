floww-ai
Backend Assignment Floww_ai

Financial Records API
This is a simple RESTful API for managing personal financial transactions such as income and expenses.


// Database Setup:
// The transactions table is created to store transactions (income or expense), including fields like type, category, amount, date, and description.

// API Endpoints:
// POST /transactions: Add a new transaction.
// GET /transactions: Retrieve all transactions.
// GET /transactions/:id: Retrieve a transaction by ID.
// PUT /transactions/:id: Update a transaction by ID.
// DELETE /transactions/:id: Delete a transaction by ID.
// GET /summary: Retrieve a summary of total income, total expenses, and balance.

// Server Setup:
// The server listens on port 3000.

// Running the Project:
// Install dependencies:
// npm install express sqlite3 body-parser

// Run the server:
// node index.js

// Use Postman or Curl to test the API:
// Add a transaction:

// POST /transactions
// {
//   "type": "income",
//   "category": "salary",
//   "amount": 1000,
//   "date": "2024-10-22",
//   "description": "Monthly Salary"
// }
// Get all transactions:
// GET /transactions

// Get a transaction by ID:
// GET /transactions/1

// Get a summary:
// GET /summary
