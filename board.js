require('dotenv').config({path: './sg.env'});
var sg = require("./sgmailer.js");
// consider using async for callbacks
// sg code would be here

var arduino = require("johnny-five")
    , board = new arduino.Board()
    , lcd_output = null
    , start = true;

///////// PANIC SWITCH ///////////

function panicMode(lcd, led) {
    return function sender() {
        led.blink().color("#0000FF");
        console.log("pressed BLUE");

        setTimeout(function() {
            led.stop();
            lcd.clear().print("Hold to send");
            lcd.cursor(1, 0).print("a notification");
        }, 1000);

        this.removeListener('up', sender);
        panic(this, function(resp, mailedTo) {
            lcd.clear().print(resp);
            lcd.cursor(1, 0).print(mailedTo);
            setTimeout(function() {
                lcd.clear();
            }, 4000);
        });
    };
}

var panic = function(button, callback){
    button.once("hold", function() {
        var emailCaller = null;
        var smsCaller = null;
        sg.setText("panic");
        sg.sgObject.send(sg.sendMail(), function(err, json) {
            if (err) {
                return console.error("Send Failed");
            }
            emailCaller = "Email Sent";
            sg.sgObject.send(sg.sendSMS(), function(err, json) {
                if (err) {
                    return console.error("Send Failed");
                }
                smsCaller = "SMS Sent";
                console.log("messages sent");
                callback(emailCaller, smsCaller);
            });
        });
    });
};

///////// HIKER SWITCH ///////////

function hikerMode(lcd, led, board, blue) {
    return function sender() {
        blue.removeAllListeners();
        led.blink().color("#FF0000");
        console.log("pressed RED");

        setTimeout(function() {
            led.stop();
            lcd.clear().print("Select a time");
            lcd.cursor(1, 0).print("in seconds");
        }, 1000);

        this.removeListener('up', sender);

        board.pinMode(5, arduino.Pin.ANALOG);
        board.analogRead(5, function(voltage) {
            var value = Math.floor(voltage * 60/1022);

            if (lcd_output == value || start) {
                setTimeout(function() {
                    start = false;
                }, 4000);
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
            countDown(lcd_output, lcd, led, blue, function(resp, mailedTo) {
                lcd.clear().print(resp);
                lcd.cursor(1, 0).print(mailedTo);
                setTimeout(function() {
                    lcd.clear();
                    led.off();
                }, 4000);
            });
        });
    };
}

var countDown = function(timer, lcd, led, blue, callback){
    var count = timer;
    var counter = setInterval(function() {
        console.log(count);
        lcd.clear().print(count);

        blue.on("up", function () {
            clearInterval(counter);
            lcd.clear().print("Alert Canceled");
            lcd.cursor(1, 0).print("select or reset time");
            led.on().color("#FF0000");
            setTimeout(function() {
                led.off();
            }, 1000);
        });

        count = count - 1;
        if (count < 0) {
            var emailCaller = null;
            var smsCaller = null;
            sg.setText("hiker");
            sg.sgObject.send(sg.sendMail(), function(err, json) {
                if (err) {
                    return console.error("Send Failed");
                }
                emailCaller = "Email Sent";
                sg.sgObject.send(sg.sendSMS(), function(err, json) {
                    if (err) {
                        return console.error("Send Failed");
                    }
                    smsCaller = "SMS Sent";
                    console.log("messages sent");
                    callback(emailCaller, smsCaller);
                });
            });
            clearInterval(counter);
            led.on().color("#00FF00");
        }
    }, 1000);
};

///////// MAIN ///////////

board.on("ready", function() {
    var self = this;
    var BlueButton = new arduino.Button({
        pin: 4,
        holdtime: 2000
    }).removeAllListeners();
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
    lcd.cursor(1, 0).print("Red: 127 hr Mode")

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