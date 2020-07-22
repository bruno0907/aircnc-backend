const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');

const cors = require('cors');
const path = require('path');

const routes = require('./routes');

require('dotenv').config();


const app = express();
const server = http.Server(app);
const io = socketio(server);

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



const connectedUsers = {};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(routes);

server.listen(PORT, function() {
    console.log(`Server Running on ${this.address().port} port`)
});