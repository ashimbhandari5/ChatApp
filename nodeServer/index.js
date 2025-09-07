// node server which will handle socket io
// const io = require('socket.io')(8000);
// const { createServer } = require("http");


// const { Server } = require("socket.io");

// const httpServer = createServer();
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",   // allow your frontend to connect
//   },
// });

// httpServer.listen(8000, () => {
//   console.log("Server running on port 8000");
// });


// const { createServer } = require("http");
// const { Server } = require("socket.io");

// const PORT = process.env.PORT || 8000;

// // create HTTP server
// const httpServer = createServer();

// // create socket.io server
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*", // allow frontend
//   },
// });

// // start server
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });






const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 8000;

// Simple HTTP handler for Render health check
const handler = (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Server is running with Socket.IO ✅");
};

// Create HTTP server with handler
const httpServer = createServer(handler);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // allow frontend (Vercel domain)
  },
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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
