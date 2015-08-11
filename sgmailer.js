/* SENDGRID MAILER */
(function() {

    var from_address, to_address, sms_address, subject, text, html, phone;

    from_address = "test@example.com";
    to_address = "ADDRESS";
    sms_address = "safegrid@tushar.bymail.in";
    phone = "PHONENUMBER";

    panic_subject = "Date not working out";

    panic_plain = "Ohh get me away from here...\n\
        play me a song to set me free\n\
        nobody writes them like they used to\n\
        so it may as well be me.\n";

    panic_html = "<html><body>\
            <p>Ohh get me away from here...</p>\n\
            <p>play me a song to set me free, nobody writes them like they used to</p>\n\
            <p>so it may as well be me.</p>\
        </body></html>";

    hiker_subject = "I got lost in the lab";

    hiker_plain = "I'm a robot writing to notify you\n\
        that [friend] has not checked in since leaving\n\
        to study at the world famous Aperture Science facilities.\n";

    hiker_html = "<html><body>\
            <p>I'm a robot writing to notify you</p>\
            <p>that your friend has not checked in since leaving</p>\
            <p>to study at the world famous Aperture Science facilities.</p>\
        </body></html>";

    module.exports.setText = function(type) {
        if (type == "panic") {
            subject = panic_subject;
            text = panic_plain;
            html = panic_html;
        } else if (type == "hiker") {
            subject = hiker_subject;
            text = hiker_plain;
            html = hiker_html;
        }
    };

    module.exports.getToEmail = function() {
        return to_address
    };

    var sgObject = module.exports.sgObject = require('sendgrid')(process.env.SG_KEY);

    module.exports.sendMail = function() {
        var content = new sgObject.Email({
            to: to_address,
            from: from_address,
            subject: subject,
            text: text,
            html: html
        });

        return content
    };

    module.exports.sendSMS = function() {
        var content = new sgObject.Email({
            to: sms_address,
            from: from_address,
            subject: phone,
            text: text
        });

        return content
    };

//    var email = module.exports.sendMail();
}());