const express = require('express');
const { v4: uuidv4 } = require('uuid');
//uuidv4()
const path = require('path');
const fs = require('fs');
const util = require('util');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

//html routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"./public/index.html"))
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname,"./public/notes.html"))
})

//api routes
const promisifiedRead = util.promisify(fs.readFile);
const promisifiedWrite = util.promisify(fs.writeFile);

const getNotes = () => {
    return promisifiedRead("./db/db.json", "utf8").then((notes) => {
        return JSON.parse(notes);
    });
}

const addNote = (note) => {
    const newNote = note;
    newNote.id = uuidv4();

    return getNotes().then((notes) => {
        const allNotes = notes;
        allNotes.push(newNote);
        promisifiedWrite("./db/db.json", JSON.stringify(allNotes));
    })
}

const deleteNote = (id) => {
    return getNotes().then((notes) => {
        const allNotes = notes;
        const filteredNotes = allNotes.filter((note) => note.id !== id);
        promisifiedWrite("./db/db.json", JSON.stringify(filteredNotes));
    })
}

app.get("/api/notes", (req, res) => {
    getNotes().then(notes => {
        res.json(notes)
    });
});

app.post("/api/notes", (req, res) => {
    addNote(req.body).then((notes) => {
        res.json(notes)
    })
});

app.delete("/api/notes/:id", (req, res) => {
    deleteNote(req.params.id).then((notes) => {
        res.json({
            success: true
        })
    })
});

app.listen(PORT,()=>{
    console.log("listening on port" + PORT)
})
