// node server which will handle socket io
// const io = require('socket.io')(8000);
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",   // allow your frontend to connect
  },
});

httpServer.listen(8000, () => {
  console.log("Server running on port 8000");
});


const users = {};
io.on('connection', socket => {
  socket.on('new-user-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
     socket.broadcast.emit('receive', {message: message, name: users[socket.id]
    });
  });

   socket.on('disconnect', message => {
     socket.broadcast.emit('left', users[socket.id]
    );
    delete users[socket.id];
  });
});
