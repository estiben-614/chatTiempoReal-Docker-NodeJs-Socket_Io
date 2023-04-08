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


  // io.emit(evento, datos) || io.sockets.emit(evento,datos)=> Envia un mensaje a todos los usuarios conectados, incluyendose
  // socket.emit(evento, datos) => Envia el mensaje a una sola persona
  // socket.broadcast.emit(evento, datos)=> Envía un mensaje a todos los sockets conectados al servidor, excepto al propio emisor. 

  listadoUsuariosConectados.push(usuario)
  console.log(listadoUsuariosConectados)

  //Mensaje al cliente con el array de los usuarios que hay conectados
  io.sockets.emit('users_online',listadoUsuariosConectados)

  //Mensaje de bienvenida solo a quien se conectó
  socket.emit('connection_user',`Welcome to chat ${usuario.nombre}`)

  
  
  //Mensaje para todos menos quien ingresó 
  socket.broadcast.emit('connection_user',`${usuario.nombre} has join`)

  //Cada conexion está identificada con un id y que se puede obtener con socker id
  // .find() me devuelve el primer usuario que cumpla que el id del servidor (socker.id) sea igual al ID de la persona que envio el mensaje y
  //que guardamos en cada usuario

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
    //El servidor indica el ID que se desconectó (socker.id)
    //La condicion devuelve el primer usuario que cumpla que el ID del servidor  ( que se desconectó) sea igual al ID que tenemos registrado en  usuario
    if(listadoUsuariosConectados.find((usuario)=>usuario.id==socket.id)){
      
      //Devuelve el indice del usuario que se desconectó 
      const index=listadoUsuariosConectados.indexOf(usuario)

      //Elimina a partir del index el usuario que se desconectó 
      listadoUsuariosConectados.splice(index)
      
      //Envia a todos el nuevo listado de usuarios conectados luego de cada desconexion 
      io.sockets.emit('users_online',listadoUsuariosConectados)

    }

    io.emit('disconnect2',`${usuario.nombre} is disconected`)
  })
})
  
});




server.listen(3000, () => {
  console.log('listening on *:3000');
});
