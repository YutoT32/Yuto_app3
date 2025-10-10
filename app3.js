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

app.get('/', (req, res) => {
    res.render('top.ejs');
});

app.get('/index', (req, res) => {
    res.render('index.ejs');
});

app.listen(3000);