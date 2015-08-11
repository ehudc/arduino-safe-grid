require('dotenv').config({path: './sg.env'});
var sg = require("./sgmailer.js")

// sg code would be here

var arduino = require("johnny-five")
    , board = new arduino.Board()
    , lcd
    , lcd_output = null;

////////////////////

function panicMode(lcd, led) {
    return function sender() {
        led.on().color("#0000FF");
        console.log("pressed BLUE");

        setTimeout(function() {
            led.off()
            lcd.clear().print("Press to send")
            lcd.cursor(1, 0);
            lcd.print("a notification")
        }, 1000);

        this.removeListener('up', sender);
        panic(this, function(resp) {
            lcd.clear().print(resp);
            setTimeout(function() {
                lcd.clear();
            }, 2000);
        });
    };
}

var panic = function(button, callback){
    button.on("up", function() {
        sg.sgObject.send(sg.sendMail(), function(err, json) {
            if (err) {
                return console.error("Send Failed");
            }
            callback("Email Sent");
        });
    });
};

///////////////////

function hikerMode(lcd, led, board, blue) {
    return function sender() {
        led.on().color("#FF0000");
        console.log("pressed RED");

        setTimeout(function() {
            led.off()
            lcd.clear().print("Select a time")
            lcd.cursor(1, 0);
            lcd.print("in seconds")
        }, 1000);

        this.removeListener('up', sender);

        board.pinMode(5, arduino.Pin.ANALOG);
        board.analogRead(5, function(voltage) {
            var value = Math.floor(voltage * 60/1022);

            if (lcd_output == value) {
                return;
            } else {
                lcd_output = value;
                console.log(value);

                lcd.clear().print(lcd_output + " seconds");
                setTimeout(function() {
                    lcd.clear();
                }, 10000);
            }
        });

        this.on("up", function() {
            blue.removeAllListeners();
            countDown(lcd_output, lcd, led, blue)
        });
    };
}

var countDown = function(timer, lcd, led, blue){
    var count = timer;
    var counter = setInterval(function() {
        console.log(count);
        lcd.clear().print(count);

        blue.on("up", function () {
            clearInterval(counter)
        });

        count = count - 1;
        if (count < 0) {
            clearInterval(counter);
            led.on().color("#00FF00");
        }
    }, 1000);
    led.off();
};

///////////////////

board.on("ready", function() {
    var self = this;
    var BlueButton = new arduino.Button(4).removeAllListeners();
    var RedButton = new arduino.Button(2).removeAllListeners();

    var led = new arduino.Led.RGB({
        pins: {
            red: 3,
            green: 5,
            blue: 6
        }
    }).off();

    var lcd = new arduino.LCD({
        // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
        // Arduino pin # 7    8   9   10  11  12
        pins: [7, 8, 9, 10, 11, 12],
        backlight: 13,
        rows: 2,
        cols: 20
        // Options:
        // bitMode: 4 or 8, defaults to 4
        // lines: number of lines, defaults to 2
        // dots: matrix dimensions, defaults to "5x8"
    });

    lcd.clear().print("Blue: Panic Mode");
    lcd.cursor(1, 0);
    lcd.print("Red: 127 hr Mode")

    BlueButton.on("up", panicMode(lcd, led));

    RedButton.on("up", hikerMode(lcd, led, self, BlueButton));
});




//    RedButton.on("up", function() {
//        console.log("pressed RED");
//        led.on();
//        led.color("#FF0000");
//        self.wait(2000, function() {
//            led.off()
//        });
//        lcd.clear().print("johnny, ALIVE!");
//        lcd.cursor(1, 0);
//    });


//    this.pinMode(5, arduino.Pin.ANALOG);
//    this.analogRead(5, function(voltage) {
//        var value = Math.floor(voltage * 60/1022);
//
//        if (lcd_output == value) {
//            return;
//        } else {
//            lcd_output = value;
//            console.log(value);
//
//            lcd.clear().print(lcd_output + " seconds");
//            self.wait(10000, function() {
//                lcd.clear();
//                lcd.cursor(1, 0);
//            });
//        }
//    });




//    button.on("up", function() {
//        sg.sgObject.send(sg.sendMail(), function(err, json) {
//            if (err) {
//                return console.error("ERROR: ", err);
//            }
//            console.log("no error:", json);
//        });
//    });

//    this.repl.inject({
//        lcd: lcd
//    });