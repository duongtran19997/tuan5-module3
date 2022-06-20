const http = require('http');
const fs = require('fs');
const url = require('url')
const {Server} = require("socket.io");

const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css"
};

const server = http.createServer((req, res) => {
    const urlPath = url.parse(req.url,true).pathname;
    if(urlPath ==='/'){
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream('./templates/index.html').pipe(res)
    }
    /* đọc file css/js */
    const filesDefences = req.url.match(/\.js|.css/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, { 'Content-Type': extension });
        fs.createReadStream(__dirname + "/"+ req.url).pipe(res)
    }
})

const io = new Server(server);
const todoList = [];
let index = 0;

/* Quản lý dữ liệu webscoket */
io.on('connection', socket => {
    /* Lắng nghe sự kiện addTask từ phía client */
    socket.on('addTask', task => {
        todoList.push(task)
        /* Gửi sự kiện addTask cho tất cả người dùng real-time */
        socket.broadcast.emit('addTask', {task: task, index: index})
        index++;
    })
})

server.listen(3000, 'localhost', ()=>{
    console.log('Server running in http://localhost:3000')
})