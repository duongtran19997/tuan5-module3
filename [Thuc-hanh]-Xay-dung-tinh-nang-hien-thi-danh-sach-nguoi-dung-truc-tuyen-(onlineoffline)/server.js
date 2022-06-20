const http = require("http");
const fs = require('fs');
const {Server} = require("socket.io");
const url = require('url')

const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css"
};

const server = http.createServer((req, res) => {
    const urlPath = url.parse(req.url, true, true).pathname;
    if (urlPath === '/') {
        res.writeHead(200, {'content-type': 'text/html'});
        fs.createReadStream('/template/index.html').pipe(res);
        /* đọc file css/js*/
        const filesDefences = req.url.match(/\.js|.css/);
        if (filesDefences) {
            const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
            res.writeHead(200, {'Content-Type': extension});
            fs.createReadStream(__dirname + "/" + req.url).pipe(res)
        }
    }
})

const io = new Server(server);

/* Danh sách người dùng hệ thống */
const users = [
    {
        name: "admin",
        online: false,
        color: 'red'
    },
    {
        name: "phong",
        online: false,
        color: 'red'
    },
    {
        name: "user",
        online: false,
        color: 'red'
    }
]

io.on('connection', socket => {
    socket.on('login', name => {
        let userLogin = users.find((users, index) => {
            return users.name === name
        })
        if (userLogin) {
            userLogin.online = true;
            userLogin.color = 'green';
            userLogin.id = socket.id;
            socket.emit('list-user', users)
            socket.broadcast.emit('user-connected', users)
        }
    })
    /* Sự kiện người dùng ngắt kết nối */
    socket.on('disconnect', () => {
        let userLogin = users.find((user, index) => {
            return user.id === socket.id
        });
        if (userLogin) {
            console.log(userLogin)
            userLogin.online = false;
            userLogin.color = 'red';
            socket.broadcast.emit('user-disconnected', users)
        }
    })


})


server.listen(3000, 'localhost', function () {
    console.log('Server running in http://localhost:3000')
})