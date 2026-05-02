const express = require("express");
const morgan = require("morgan");
const app = express();

//allow for requests from all origins
const cors = require("cors");
// db.js pool module for faster and efficient data reading/writing
const pool = require("./db");

// Middleware are functions that can be used for
// handling request and response objects
// Middleware is used like this:
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

// morgan custom formats!!
morgan.token("obj", (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :obj"),
);

// verify database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connected successfully!");
  }
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", async (request, response) => {
  const result = await pool.query("SELECT * FROM persons");
  response.json(result.rows);
});

app.get("/info", async (request, response) => {
  const result = await pool.query("SELECT COUNT(*) FROM persons");
  const now = new Date();
  response.send(`
    <h1>Phonebook</h1>
    <p>This phonebook has info for ${result.rows[0].count} people.</p>
    <p>${now.toString()}</p>
  `);
});

app.get("/api/persons/:id", async (request, response) => {
  const result = await pool.query("SELECT * FROM persons WHERE id = $1", [
    request.params.id,
  ]);
  if (result.rows.length > 0) {
    response.json(result.rows[0]);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", async (request, response) => {
  const result = await pool.query(
    "DELETE FROM persons WHERE id = $1 RETURNING *",
    [request.params.id],
  );

  if (result.rows.length > 0) {
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", async (request, response) => {
  const { name, number } = request.body;
  if (!name) return response.status(400).json({ error: "name missing" });
  if (!number) return response.status(400).json({ error: "number missing" });

  const existing = await pool.query("SELECT * FROM persons WHERE name = $1", [
    name,
  ]);
  if (existing.rows.length > 0) {
    return response.status(400).json({ error: "name must be unique" });
  }
  const result = await pool.query(
    "INSERT INTO persons (name, number) VALUES ($1, $2) RETURNING *",
    [name, number],
  );

  response.json(result.rows[0]);
});

app.put("/api/persons/:id", async (request, response) => {
  const { name, number } = request.body;
  const id = request.params.id;
  console.log("start finding person");
  const result = await pool.query(
    "UPDATE persons SET name = $1, number = $2 WHERE id = $3 RETURNING *",
    [name, number, id],
  );
  if (result.rows.length > 0) {
    response.json(result.rows[0]);
  } else {
    response.status(404).json({ error: "person not found" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
