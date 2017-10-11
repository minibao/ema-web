/**
 * Created by B-04 on 2017/7/27.
 */
var controlArr = new Array();//记录所有control端的连接
var showArr = new Array();//记录所有show端的连接
var ws = require('nodejs-websocket');
var server = ws.createServer(function (connection) {
    connection.data = null;
    connection.type = null;
    console.log("new connetion");
    console.log("连接数connection = " + server.connections.length);
    var playerNum = 1;
    if(server.connections.length == 1){
        playerNum = 1;
    }else if(server.connections.length == 2){
        playerNum = 2;
    }else{
        playerNum = 0;
    }
    //接收数据
    connection.on("text", function (str) {
        console.log(str);
        var data = JSON.parse(str);
        console.log("userid =",data.userid,"type =",data.type,"msg =",data.msg);
        if (connection.data === null) {

            /**
             * 1.判断链接是control端还是show端
             * 2.如果是control端，且是第一次发送消息，什么都不做
             * 3.如果是control端，不是第一次发送消息，那给所有的show端发送消息请求，游戏开始。
             * 4.show端接受消息，对应的唯一show端，做相对应的处理，并返回消息。
             * 5.游戏正式开始
             */

            connection.userid = data.userid;
            connection.type = data.type;
            var broadData;

            if(connection.type == 'create'){
                if(playerNum == 1){
                    broadData = { player: playerNum,type:'ready'};
                }else if(playerNum == 2){
                    broadData = { player: playerNum,type:'go'};
                }else{
                    broadData = { player: playerNum,type:'holdOn'};
                }
            }else if(connection.type == 'game'){
                broadData = data;
            }else{
                broadData = data;
            }
            broadcast(JSON.stringify(broadData));

        } else {
            broadcast("[" + connection.userid + "] " + connection.userid);
            console.log("connection.userid = " + connection.userid);
        }
    });
    connection.on("close", function () {
        var data = { userid: connection.userid, type: connection.type, event: "leave", leftOrRight: "null" };
        var str = JSON.stringify(data);
        broadcast(str);
        console.log("userid =",data.userid,"type =",data.type," close");
        console.log("连接数connection = " + server.connections.length);
    });
    connection.on("error", function () {
        if (connection.type == "control") {
            var indexControl = controlArr.indexOf(connection);
            if (indexControl != -1) {
                controlArr.splice(indexControl, 1);
            }
        }
        if (connection.type == "show") {
            var indexShow = controlArr.indexOf(connection);
            if (indexShow != -1) {
                controlArr.splice(indexShow, 1);
            }
        }
    });
})
server.listen(8001);
/**
 *
 * 发送消息到所有连接
 */
function broadcast(str) {
    server.connections.forEach(function (connection) {
        connection.sendText(str);
    })
}
/**
 *
 * 发送消息到control(控制)端
 */
function sendMessageToControl(str) {
    server.connections.forEach(function (connection) {
        if (connection.type == "control") {
            connection.sendText(str);
        }
    })
}
/**
 *
 * 发送消息到show(表现)端
 */
function sendMessageToShow(str) {
    server.connections.forEach(function (connection) {
        if (connection.type == "show") {
            connection.sendText(str);
        }
    })
}
console.log("服务器启动");