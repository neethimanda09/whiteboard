const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {cors: {origin: "*"}}); // Allowing CORS

const drawingData=[];

// Establishing Socket connection 
io.on('connection', (socket) => {
  
  socket.emit('init', drawingData);

  socket.on('drawing', (data) => {
    drawingData.push(data);   
    io.emit('drawing', data);
  });
 
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


