var express = require("express");
var http = require("http");
var mongoose = require("mongoose");
var Io = require("socket.io");
var app = express();
    
app.use(express.static(__dirname + "/client"));
app.use(express.bodyParser());

// connect to the amazeriffic 
mongoose.connect("mongodb://localhost/amazeriffic");

var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [ String ]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);

var server = http.createServer(app).listen(3000);
var io = Io(server);

var socketio;
io.on("connection",function(soc){
   
   console.log("Socket IO Connected");
   socketio = soc;
});

function display(result){

     socketio.emit("newToDO",result);
}

app.get("/todos.json", function (req, res) {
    "use strict";

    ToDo.find({}, function (err, toDos) {
        res.json(toDos);
    });
});

app.post("/todos", function (req, res) {
    "use strict";

    console.log(req.body);
    var newToDo = new ToDo({"description":req.body.description, "tags":req.body.tags});
    newToDo.save(function (err) {
        if (err !== null) {
            console.log(err);
            res.send("ERROR");
        } else {
            ToDo.find({}, function (err, result) {
                if (err !== null) {
                    res.send("ERROR");
                }
               
                display(result);
                res.json(result);
            });
        }
    });
});






