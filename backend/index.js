const express=require('express');
const http=require('http');
const socketConfig=require('./config/socketIOConfig');
const route  = require('./routes/route');

const app=express();
const server=http.createServer(app);
const io= require('socket.io')(server);

app.use(express.json());
const port=process.env.PORT || 8080;
app.use('/api',route);

socketConfig(io)
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})