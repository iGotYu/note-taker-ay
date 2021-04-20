const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"index.html"))
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname,"notes.html"))
})

app.get("/api/notes", (req, res) => {
    res.json({notes});
})


app.post("/api/notes", (req, res) => {
    res.json({notes});
})

app.listen(PORT,()=>{
    console.log("listening on port" + PORT)
})
