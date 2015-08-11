/* SENDGRID MAILER */
(function() {

    var from_address, to_address, subject, text_body, html_body ;

    from_address = "test@example.com";
    to_address = "YOUR_ADDRESS";
    subject = "Date not working out";

    text_body = "Hey there\n\
        Thanks so much for your interest in our event!\n";

    html_body = "<html><body>\
            <p>Hey there</p>\n\
            <p>Thanks so much for your interest in our event!</p>\n\
        </body></html>";

    var sgObject = module.exports.sgObject = require('sendgrid')(process.env.SG_KEY);

    module.exports.sendMail = function() {
        var content = new sgObject.Email({
            to: to_address,
            from: from_address,
            subject: subject,
            text: text_body,
            html: html_body
        });

        return content
    };

//    var email = module.exports.sendMail();
}());