const express = require("express");
const path = require("path");
const notesDB = require("./db/db.json");

const PORT = process.env.port || 3001;

const app = express();

// Import custom middleware, "cLog"

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET Route for homepage
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => res.json(notesDB));

app.post("/api/notes", (req, res) => {
  const { body } = req;
  notesDB.push(body);
  res.json(notesDB);
  console.log(typeof body);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
