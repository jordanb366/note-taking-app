// All imports for express, path, notes db, fs and uuid for the unique id in the db
const express = require("express");
const path = require("path");
// Using let instead of const
let notesDB = require("./db/db.json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Port for deployment and local 3001 port
const PORT = process.env.PORT || 3001;

// App variable for express
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// For the public path folder
app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET Route for homepage
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// Get api notes routes
app.get("/api/notes", (req, res) => {
  res.json(notesDB);
});

// Post api notes route
app.post("/api/notes", (req, res) => {
  // Gets the req.body
  const { title, text } = req.body;
  // Saves Body of the req in the format as below
  const newNoteToSave = {
    title,
    text,
    id: uuidv4(),
  };

  //  Pushes to the array notesDB
  notesDB.push(newNoteToSave);

  // Write updated notes back to the file
  fs.writeFile("./db/db.json", JSON.stringify(notesDB, null, 4), (writeErr) =>
    writeErr
      ? console.error(writeErr)
      : console.info("Successfully updated notes!")
  );
  // Reads the file
  res.json(notesDB);
});

// Handles the delete route
app.delete("/api/notes/:id", (req, res) => {
  // Saves teh req params id to variable
  const requestedID = req.params.id;
  // Logs the param id
  console.log(requestedID);

  // Filters out the noteDB array to filter out the requestedID to delete
  let newNotes = notesDB.filter((note) => {
    return note.id !== requestedID;
  });
  // Sets notesDB equal to newNote,
  notesDB = newNotes;

  // Write updated notes back to the file,
  // Using writeFileSync to clean up code
  fs.writeFileSync(
    "./db/db.json",
    JSON.stringify(notesDB, null, 4),
    console.log("Successfully deleted the note")
  );
  // Read file
  res.json(notesDB);
});

// Wildcard redirect
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// Listening port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
