const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/cliente/index.html');
});

let onlineUsers = []; // Nuevo array para almacenar usuarios en línea

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Emitir lista de usuarios en línea al nuevo usuario
    io.to(socket.id).emit('update online users', onlineUsers);
    
    // Cuando un usuario envía su nombre de usuario
    socket.on('set username', (username) => {
        socket.username = username;
        onlineUsers.push(username); // Agregar usuario a la lista de usuarios en línea
        io.emit('update online users', onlineUsers); // Emitir lista actualizada de usuarios en línea a todos los clientes
    });

    // Cuando un usuario envía un mensaje
    socket.on('chat message', (msg) => {
        console.log('mensaje: ', msg);
        io.emit('chat message', msg);
    });

    // Cuando un usuario se desconecta
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        onlineUsers = onlineUsers.filter(user => user !== socket.username); // Eliminar usuario de la lista de usuarios en línea
        io.emit('update online users', onlineUsers); // Emitir lista actualizada de usuarios en línea a todos los clientes
    });
});

server.listen(3000, () => {
    console.log('servidor está escuchando en el puerto 3000');
});
