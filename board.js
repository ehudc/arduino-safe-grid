require('dotenv').config({path: './sg.env'});
var sg = require("./sgmailer.js")

// sg code would be here

var arduino = require("johnny-five")
    , board = new arduino.Board();

board.on("ready", function() {
    var button = new arduino.Button(4);

    button.on("up", function() {
        sg.sgObject.send(sg.sendMail(), function(err, json) {
            if (err) {
                return console.error("ERROR: ", err);
            }
            console.log("no error:", json);
        });

    });
});