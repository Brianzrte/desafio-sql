const express = require('express');
const rutaApi = require('./routers/app.routers');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpserver = new HttpServer(app);
const io = new IOServer(httpserver);

const PORT = process.env.PORT || 8080;

//data
const { Chat } = require('./models/index');
const chat = new Chat();
const { Productos } = require('./models/index');
const productos = new Productos();


//publics static files
app.use(express.static(path.resolve(__dirname, 'public')));

io.on('connection', async socket => {
   
    console.log('Cliente conectado: ' + socket.id);
    socket.on('incomingMessage', async (message) => {
        if(message.email){
            await chat.save(message);
            socket.emit('enviarMensaje', message);
        }
    });

    socket.emit('regenerarProductos', await productos.getAll());
    socket.emit('regenerarChat', await chat.getAll());    
});

//rutas
app.use('/api', rutaApi);


app.get('/', (req, res) => {
    res.sendfile(path.resolve(__dirname, './public/index.html'));
})



httpserver.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})