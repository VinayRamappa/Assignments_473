var express = require("express");
var bodyParser = require('body-parser');
var http = require("http");
var mongoose = require("mongoose");
var app = express();

app.use(bodyParser.json());
http.createServer(app).listen(3000);

mongoose.connect('mongodb://localhost/links');

var linksSchema = mongoose.Schema({
    title: String,
    link: String,
    clicks: Number
});

var links = mongoose.model("links", linksSchema);

app.get("/links", function(req, res) {
    links.find({}, function(err, links) {
        res.json(links);
    });
});

app.post("/links", function(req, res) {

    console.log(req.body);

    var newlink = new links({
        "title": req.body.title,
        "link": req.body.link,
        "clicks": 0
    });

    newlink.save(function(err, links) {

        console.log("record saved");

    });

    links.find({}, function(err, links) {
        res.json(links);

    });


});



app.get('/click/:title', function(req, res) {

    var counter = mongoose.model("links");

    links.find({
        "title": req.params.title
    }, function(err, click) {

        console.log("success");

        var cl = click[0].clicks;
        console.log(cl);

        counter.collection.update({
            "title": req.params.title
        }, {
            $set: {
                "title": req.params.title,
                "clicks": cl + 1
            }
        });
        res.redirect(click[0].link);

    });

});

module.exports = app;
