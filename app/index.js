const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


//Ruta del servidor
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
}); 


//Socket 
io.on('connection', (socket) => {

  socket.broadcast.emit('connectionUser','An user has join')
  //Socket on escucha los eventos
  socket.on('infoClient',(data)=>{

    //io envia el mensaje a todos los que están en el servidor (sockets)
    //Ahora es el servidor quien emite un evento al cliente (html)
    //Devuelve los datos
    io.sockets.emit('infoServidor',data)
    
    console.log(data)
  })


  //Recibe el username y lo envia a todos menos a la persona que está escribiendo (broadcast)
  socket.on('typingClient',(data)=>{
    socket.broadcast.emit('typingServidor',data)
  })

  //Desconexion Cliente
  socket.on('disconnect',()=>{
    io.emit('disconnect2','An user is disconected')
  })
});

// io.on('connection', (socket) => {
//   socket.on('sensor_message', (msg) => {
//     console.log('message: ' + msg);
//   });
// });



server.listen(3000, () => {
  console.log('listening on *:3000');
});
//.bin/