const http = require('http');
const {Server} = require('socket.io');
const fs = require('fs')

const server = http.createServer((req, res) => {
    fs.readFile('./index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
})

const io = new Server(server)
/* lắng nghe kết nối socket từ phía client */
io.on("connection", (socket) => {
    console.log('a user connected')
});


server.listen(8080,()=>{
    console.log('run at 8080')
})