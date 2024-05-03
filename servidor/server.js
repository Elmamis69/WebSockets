const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res, sendFile(process.cwd() + '/cliente/index.html')
});

io.on('connection', (socket) => {
    console.log('Usuario conectado')
    socket.on('chat message', (msg) => {
        console.log('mensaje: ', msg)
        io.emit('chat message', msg)
    })
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    })
})

server.listen(3000, () => {
    console.log('servidor esta escuchando en el puerto 3000')
})