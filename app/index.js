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

let listadoUsuariosConectados=[]

//Socket 
io.on('connection', (socket) => {
socket.on('nombreUsuario',(data)=>{

  const usuario={
    nombre:data,
    id:socket.id
  }
  const nombreUsuario=data

  listadoUsuariosConectados.push(usuario)
  console.log(listadoUsuariosConectados)

  //Mensaje de bienvenida solo a quien se conectó
  socket.emit('connection_user',`Welcome to chat ${usuario.nombre}`)

  //Mensaje para todos menos quien ingrespó 
  socket.broadcast.emit('connection_user',`${usuario.nombre} has join`)

  //Si el id que hay en el listado, corresponde con el actual que da el socket, se envia el mensaje con su nombre
  //Esto es lo que hace que cada persona tenga su nombre al enviar un mensaje
  if(listadoUsuariosConectados.find((usuario)=>usuario.id==socket.id)){
    //Socket on escucha los eventos, en este caso, el evento infoClient
    socket.on('infoClient',(data)=>{

    //io envia el mensaje a todos los que están en el servidor (sockets)
    //Ahora es el servidor quien emite un evento al cliente (html)
    //Devuelve los datos
    io.sockets.emit('infoServidor',{message:data.message,
                                    username:nombreUsuario})
    
    console.log(`${nombreUsuario} has sent a message  `)
  })
  }
  


  //Recibe el username y lo envia a todos menos a la persona que está escribiendo (broadcast)
  socket.on('typingClient',(data)=>{
    socket.broadcast.emit('typingServidor',data)
  })

  //Desconexion Cliente
  socket.on('disconnect',()=>{
    io.emit('disconnect2',`${usuario.nombre} is disconected`)
  })
})
  
});




server.listen(3000, () => {
  console.log('listening on *:3000');
});
//.bin/