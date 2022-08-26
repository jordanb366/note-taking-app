const express = require("express");
const path = require("path");
const notesDB = require("./db/db.json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

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

app.get("/api/notes", (req, res) => {
  // res.json(notesDB);
  // Obtain existing DB files
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedDB = JSON.parse(data);
      res.json(parsedDB);
    }
  });
});

// Post notes
app.post("/api/notes", (req, res) => {
  const { body } = req;
  notesDB.push(body);
  res.json(notesDB);
  console.log(typeof body);

  const { title, text } = req.body;

  const newBody = {
    title,
    text,
    id: uuidv4(),
  };

  // Obtain existing DB files
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedDB = JSON.parse(data);

      // Add a new note
      parsedDB.push(newBody);

      // Write updated notes back to the file
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(parsedDB, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info("Successfully updated notes!")
      );
    }
  });
});

// Handles the delete route
app.delete("/api/notes/:id", (req, res) => {
  const requestedID = req.params.id.toLowerCase();

  console.log(requestedID);
  // Obtain existing DB files
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedDB = JSON.parse(data);

      // const index = parsedDB.findIndex((index) => index.id === requestedID);

      // if (index !== undefined) parsedDB.splice(index, 1);

      // console.log(parsedDB[1].id);
      for (let i = 0; i < parsedDB.length; i++) {
        if (parsedDB[i].id === requestedID) {
          parsedDB.splice(i, 1);
          console.log(parsedDB);
        }
      }

      // Write updated notes back to the file
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(parsedDB, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info("Successfully deleted notes!")
      );
    }
  });
  res.json(notesDB);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
