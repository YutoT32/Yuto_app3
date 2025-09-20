const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'SDEV',
    password: 'password',
    database: 'app3'
});

app.get('/top', (req, res) => {
    res.render('top.ejs');
});

app.get('/index', (req, res) => {
    "SELECT * FROM items;",
    (error, results) => {
        console.log(results);
        res.render('index.ejs');
    }
});

app.listen(3000);