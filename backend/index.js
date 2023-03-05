const app=require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const { disconnect } = require("process");
const io = require("socket.io")(server,{
    cors:
    {
        origin:"*",
        methods:["GET", "POST"]
    }
});
app.use(cors());
const port = process.env.PORT || 5000;
app.get('/', (req, res)=>{
    res.send("app is running");
})
io.on('connection', (socket) =>{
    socket.emit('me', socket.id);
    socket.on('disconnect', ({signal})=>{
        socket.broadcast.emit("callended", {signal:signal});
    })
    socket.on("calluser", ({userToCall, signalData, from, name})=>{
        io.to(userToCall).emit("calluser",  {signal: signalData, from, name})
    })
    socket.on("answercall", (data)=>{
        io.to(data.to).emit("callaccepted", data.signal);
    })
})
server.listen(port,()=>[
    console.log(`server is running at ${port}`)
]);
