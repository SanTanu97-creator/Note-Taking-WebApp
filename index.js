const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Set up view engine
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '977563',
    database: 'note_taking_db'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL Database');
});

// Route: Get All Notes
app.get("/", (req, res) => {
    const query = 'SELECT * FROM notes';
    db.query(query, (err, results) => {
        if (err) {
            throw err;
        }
        res.render('index', { notes: results });
    });
});

// Route to display note content
app.get("/file/:id", (req, res) => {
    const query = 'SELECT * FROM notes WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching note:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            const note = results[0];
            res.render('show', { filename: note.title, filedata: note.content });
        } else {
            res.status(404).send('Note not found');
        }
    });
});

// Route to create a new note
app.post("/create", (req, res) => {
    const { title, content } = req.body;
    const query = 'INSERT INTO notes (title, content) VALUES (?, ?)';
    
    db.query(query, [title, content], (err, result) => {
        if (err) {
            throw err;
        }
        res.redirect('/');
    });
});

// Route to render the edit form
app.get("/edit/:id", (req, res) => {
    const query = 'SELECT * FROM notes WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching note for edit:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            const note = results[0];
            res.render('edit', { note: note });
        } else {
            res.status(404).send('Note not found');
        }
    });
});

// Route to update a note
app.post("/update/:id", (req, res) => {
    const { title, content } = req.body;
    const query = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';

    db.query(query, [title, content, req.params.id], (err, result) => {
        if (err) {
            throw err;
        }
        res.redirect('/');
    });
});

// Route to delete a note
app.get("/delete/:id", (req, res) => {
    const query = 'DELETE FROM notes WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting note:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Note deleted:', req.params.id);
        res.redirect('/');
    });
});

// Start the server
app.listen(port, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server started at http://localhost:${port}`);
    }
});
