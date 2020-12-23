const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const formatMessage = require('./utils/message')

var indexRouter = require('./routers/index');

const {
    userJoin,
    userLeave,
    getRoomUsers,
    getCurrentUser
} = require('./utils/user')

const app = express()
const server = http.createServer(app);
const io = socketIO(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000

const system = 'System '

// Khi co user ket noi
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        // bat room ma user da vao
        socket.join(user.room)

        // Hien thi loi chao khi user vao chat room
        socket.emit('message', formatMessage(system, 'Chào mừng bạn đến với chat room'))

        //Hien thi thong bao khi co nguoi tham gia chat room
        socket.broadcast.to(user.room).emit('message', formatMessage(system, `${user.username} đã kết nối `))

        // hien thi thanh vien trong room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // Gui tin nhan khi co nguoi chat
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    // khi co user ngat ket noi
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(system, `${user.username} đã ngắt kết nối `))

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))