const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Set up view engine
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Route to display the list of files
app.get("/", (req, res) => {
    fs.readdir(path.join(__dirname, 'files'), (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render("index", { files: files });
    });
});

// Route to display file content
app.get("/file/:filename", (req, res) => {
    const filePath = path.join(__dirname, 'files', req.params.filename);
    fs.readFile(filePath, "utf-8", (err, filedata) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

// Route to create a new file
app.post("/create", (req, res) => {
    const filePath = path.join(__dirname, 'files', req.body.title.split(' ').join('_') + '.txt');
    fs.writeFile(filePath, req.body.details, (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect("/");
    });
}); 

// Route to delete a file
app.get("/delete/file/:filename", (req, res) => {
    const filePath = path.join(__dirname, 'files', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('File deleted:', req.params.filename);
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
