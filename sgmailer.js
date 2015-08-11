/* SENDGRID MAILER */
(function() {

    var from_address, to_address, subject, text_body, html_body ;

    from_address = "test@example.com"
    to_address = "YOUR_ADDRESS"
    subject = "test";

    text_body = "%%salutation%% \n \
                     Thanks so much for your interest in our event!\n\n \
                     You have registered for the following event:\n %%event_details%%.\n\n";

    html_body = "<html>\n <body>\n%%salutation%% <br />\n\
                    Thanks so much for your interest in our event!\n\n \
                    <p>You have registered for the following event:<br />\n %%event_details%% \
                    </p>\n\n </body></html>";

    var sgObject = module.exports.sgObject = require('sendgrid')(process.env.SG_KEY);

    module.exports.sendMail = function() {
        var content = new sgObject.Email({
            to: to_address,
            from: from_address,
            subject: subject,
            text: text_body,
            html: html_body
        });

        /* SMTP API ============================
        var recipients = [
            "SOME ADDRESS"
        ];
        for (var i = 0; i < recipients.length; i++) {
            content.addTo(recipients[i]);
        }

        var subs = {
            "%%salutation%%": [
                "%%greeting%%"
            ],
            "%%name%%": [
                "Ehud"
            ],
            "%%event_details%%": [
                "%%event1_section_tag%%"
            ]
        };

        content.setSections({
            "%%greeting%%": "Hello %%name%%!",
            "%%event1_section_tag%%": "A wonderful birthday party!"
        });

        for (var tag in subs) {
            content.addSubstitution(tag, subs[tag]);
        }
         */

        return content
    };

//    var email = module.exports.sendMail();


}());