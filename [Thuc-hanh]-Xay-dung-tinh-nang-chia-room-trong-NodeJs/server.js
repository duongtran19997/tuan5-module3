const http = require('http');
const fs = require('fs');
const {Server} = require('socket.io');
const url = require('url');

const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css"
};

const server = http.createServer((req, res) => {
    const urlPath = url.parse(req.url,true,true).pathname;
    if(urlPath==='/'){
        res.writeHead(200,{'content-type':'text/html'});
        fs.createReadStream('./templates/index.html').pipe(res);
    }
    /* đọc file css/js*/
    const filesDefences = req.url.match(/\.js|.css/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, { 'Content-Type': extension });
        fs.createReadStream(__dirname + "/" + req.url).pipe(res)
    }

});

const io = new Server(server);

const usernames = {};

const rooms = ['Lobby'];

io.on('connection',socket => {
    socket.on('adduser', function (username, nameRoom){
        socket.username = username;
        socket.room = nameRoom;
        usernames[username] = username;
        socket.join(nameRoom);
        if (nameRoom != null && rooms.indexOf(nameRoom) <0){
            rooms.push(nameRoom)
        }
        socket.emit('updatechat', 'SERVER', 'you have connected to '+ nameRoom);
        socket.broadcast.to(nameRoom).emit('updatechat', 'SERVER', username + ' has connected to this room');
        socket.emit('updaterooms', rooms, nameRoom);
    });

    socket.on('create', function (room) {
        rooms.push(room);
    });

    socket.on('sendchat', function (data) {
        io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('switchRoom', function(newroom){
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
        socket.emit('updaterooms', rooms, newroom);
    });


    socket.on('disconnect', function(){

        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        socket.leave(socket.room);
    });
})

server.listen(3000, 'localhost', function (){
    console.log('Server running in http://localhost:3000')
})