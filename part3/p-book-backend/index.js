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

app.get("/api/persons", async (request, response, next) => {
  try {
    const result = await pool.query("SELECT * FROM persons");
    response.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/info", async (request, response, next) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM persons");
    const now = new Date();
    response.send(`
    <h1>Phonebook</h1>
    <p>This phonebook has info for ${result.rows[0].count} people.</p>
    <p>${now.toString()}</p>
  `);
  } catch (error) {
    next(error);
  }
});

app.get("/api/persons/:id", async (request, response, next) => {
  try {
    const result = await pool.query("SELECT * FROM persons WHERE id = $1", [
      request.params.id,
    ]);
    if (result.rows.length > 0) {
      response.json(result.rows[0]);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

app.delete("/api/persons/:id", async (request, response, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM persons WHERE id = $1 RETURNING *",
      [request.params.id],
    );

    if (result.rows.length > 0) {
      response.status(204).end();
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/persons", async (request, response, next) => {
  try {
    const { name, number } = request.body;
    if (!name) return response.status(400).json({ error: "name missing" });
    if (!number) return response.status(400).json({ error: "number missing" });

    // name must be unique. if not
    // Just let the INSERT fail and the errorHandler catches error.code === "23505"
    const result = await pool.query(
      "INSERT INTO persons (name, number) VALUES ($1, $2) RETURNING *",
      [name, number],
    );

    response.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

// Handles requests to routes that don't exist.
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// global error handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  // pg unique constraint violation (duplicate name)
  if (error.code === "23505") {
    return response.status(400).json({ error: "name must be unique" });
  }
  // pg not-null constraint violation
  if (error.code === "23502") {
    return response.status(400).json({ error: "missing required field" });
  }
  // pg invalid data format
  if (error.code === "22P02") {
    return response.status(400).json({ error: "invalid data format" });
  }
  // Connection failure
  if (error.code === "08006") {
    return response.status(503).json({ error: "database unavailable" });
  }
  // Default: 500 internal server error
  response.status(500).json({ error: "internal server error" });
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
