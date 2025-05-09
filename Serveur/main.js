const express = require('express');
const cors = require('cors');
const port = 8080;
const session = require("express-session");
const body_parser = require('body-parser');
const app = express();

app.use(cors({
    origin: '*'
}));

app.use(session({
    secret: 'your secret',
    resave: false,
    saveUninitialized: true
}));

app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

app.set('view engine', 'ejs');

routes = require('./routeur/routeur');
app.use(routes);

app.use('/static', express.static('./static'));

app.listen(port, () => console.log(`localhost:${port}/`));