var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var app = express();
var http = require('http');
app.use(bodyParser.json());
http.createServer(app).listen(3000);
var redisClient = redis.createClient();



redisClient.mget(["wins", "losses"], function(err, output) {

            var win = parseInt(output[0], 10) || 0;
            var loss = parseInt(output[1], 10) || 0;

            app.post('/flip', function(req, res) {
                var choice = req.body.call;
                var result;
                var flip = Math.random();
                if (flip < 0.5) {
                    result = "heads";
                } else {
                    result = "tails";
                }
                console.log(choice, result);
                if (result === choice) {
                    win++;
                    redisClient.incr("wins");
                } else {
                    loss++;
                    redisClient.incr("losses");
                }
                console.log(win, loss);
                res.json({
                    "wins": win,
                    "loss": loss
                });

            });
            app.get('/stats', function(req, res) {
                //res.send("this is post");
                res.json({
                    "wins": win,
                    "losses": loss
                });

            });


            app.delete('/stats', function(req, res) {
                    redisClient.set("wins", 0);
                    redisClient.set("losses", 0);
             res.json({
                    "wins": 0,
                    "losses": 0
                });
               });
            }); 

module.exports = app;
