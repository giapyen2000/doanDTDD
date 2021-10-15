var socket = io("http://localhost:3000");

socket.on("server-send-message", function(data){
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    $("#chatbox").append("<div class='ms'>" + "<span>" + time + "</span> " + data.un + ": " + data.nd + "</div>");
    $("#thongbao").html("");
});

socket.on("person-write", function(data){
    $("#thongbao").html(data);
});

socket.on("person-write-stop", function(){
    $("#thongbao").html("");
});

socket.on("server-out-ne", function(a){
    $("#chatbox").append("<div class='ms'>" + a + " đã thoát phòng</div>");
});

socket.on("addimage", function(a, base64image){
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    $("#chatbox").append("<span>" + time + "</span> " + a +  ": " + "<br><img src='" + base64image + "'/><br>");
});

$(document).ready(function(){
    $("#loginform").show();
    $("#wrapper").hide();

    $("#usermsg").keyup(function(){
        socket.emit("write");
    });

    $("#usermsg").blur(function(){
        $("#usermsg").html("");
        socket.emit("write-stop");
    });

    $("#enter").click(function(){
        if($("#name").val()!=""){
            socket.emit("client-send-Username", $("#name").val()); 
            socket.on("server-send-dki-thanhcong", function(data){
                $("#currentUser").html(data);
                $("#loginform").hide(2000);
                $("#wrapper").show(1000);
            });
            socket.on("sever-send-danhsach-Users", function(data){
                $("#boxContent").html("");
                data.forEach(function(i){
                    $("#boxContent").append("<div class='user'>" + i + "</div>")
                });
            });
            socket.on("server-send-out", function(data){
                $("#chatbox").append("<div class='ms'>" + data + " đã vào phòng</div>");
            });
        }else{
            alert("Hãy nhập tên của bạn");
        }
       
    });

    $("#exit").click(function(){
        socket.emit("logout");
        alert('Đăng xuất thành công');
        $("#wrapper").hide(2000);
        $("#loginform").show(1000);
    });

    $("#submitmsg").click(function(){
        socket.emit("user-send-message", $("#usermsg").val());
        $("#usermsg").val("");
    });

    $("#imagefile").on('change', function(e){
        var file = e.originalEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function(evt){
            socket.emit('user image', evt.target.result);
        }
        reader.readAsDataURL(file);
    });

});