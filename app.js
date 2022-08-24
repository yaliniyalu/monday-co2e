require('dotenv').config();

const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');

const routes = require('./routes');

const app = express();
const cors = require('cors');

mongoose
    .connect(process.env.MONGODB_URI)
    .then(_ => console.log("Connected to MongoDB"));

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    // log requests & responses
    app.use(function(req, res, next) {
        console.log(`${req.method} ${req.path}`);
        next();
        const { statusCode, body } = res;
        console.log(`${statusCode} ${body}`);
    })

    app.use((err, req, res, next) => {
        console.error(err.message);
        res.status(500).json({ error: err.message });
        next(err);
    });
}

app.use('/', routes);

// listen
app.listen(process.env.APP_PORT, () => {
    console.log('listening on port 3000');
})
