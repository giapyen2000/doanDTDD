var express = require('express');
var app = express();
app.use(express.static('public')); //Mọi request gửi lên sẽ vào public. 
app.set('view engine', 'ejs'); 
app.set('views', './views'); //Thư mục view để chứa (trangchu...)

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

var arrayUsers = [];

io.on('connection', function(socket){ //Lắng nghe xem có người kết nối không, mỗi lần Refresh sẽ là 1 lần kết nối với id khác nhau 

    socket.on("client-send-Username", function(data){
        arrayUsers.push(data);
        socket.userName = data;
        socket.emit("server-send-dki-thanhcong", data);
        io.sockets.emit("server-send-out", data);
        io.sockets.emit("sever-send-danhsach-Users", arrayUsers);
    });

    socket.on("logout", function(){
        var a = socket.userName;
        arrayUsers.splice(arrayUsers.indexOf(socket.userName), 1);
        socket.broadcast.emit("sever-send-danhsach-Users", arrayUsers)
        socket.broadcast.emit("server-out-ne", a);
    });

    socket.on("user-send-message", function(data){
        io.sockets.emit("server-send-message", {un: socket.userName, nd: data});
    });

    socket.on("write", function(){
        var s = socket.userName + " đang gõ chữ";
        io.sockets.emit('person-write', s);
    });

    socket.on("write-stop", function(){
        io.sockets.emit('person-write-stop');
    });

    socket.on('user image', function(image){
        io.sockets.emit('addimage', socket.userName, image);

    });

}); 

app.get('/', function(req, res){
    res.render('trangchu'); //Dùng express sẽ có render
});