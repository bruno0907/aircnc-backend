const express = require('express');
const mongoose = require('mongoose')

const routes = require('./routes');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3333;
const DB = process.env.DB_URI;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( () => {
    console.log('Database connection is ON')
}).catch( () => {
    console.log('Database connection ERROR')
});



app.use(express.json());

app.use(routes);

app.listen(PORT, function() {
    console.log(`Server Running on ${this.address().port} port`)
});