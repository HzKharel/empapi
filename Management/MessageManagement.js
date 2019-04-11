const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/empDB.db');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'encodedmessagingplatform@gmail.com',
        pass: 'Empapi10!'
    }
});

function sendMessage(req, res, next) {
    const message = req.body.message;
    const from_user = req.body.from_user;
    const to_user = req.body.to_user;
    const encryption = req.body.encryption;
    const encryption_key = req.body.encryption_key;
    const sent_datetime = new Date().toLocaleString();

    const sql = `INSERT INTO Message
  (Sent_Message, From_User, To_User, Encryption, Sent_Date, Encryption_Key)
  VALUES (?,?,?,?,?,?)`;

    try {
        db.run(sql, [message, from_user, to_user, encryption, sent_datetime, encryption_key], (err) => {
            if (err) {
                res.sendStatus(err);
            }
            else {
                res.sendStatus(200);
            }


        });
    }
    catch (e) {
        res.sendStatus(e);
    }

    db.get(`SELECT Email FROM User where User_Name = ?`, [to_user], (err, row)=>{
        const mailOptions = {
            from: 'emp@gmail.com',
            to: row.Email,
            subject: `New Message from ${from_user}`,
            html: `<h2>Hello, ${to_user} </h2> <br><hr> <p> You have a new message from ${from_user} in your inbox.</p>
                    <p>Head over to the inbox page to read it. Remember, you will need the cipher and the key to decipher the message.</p>`
        }

        transporter.sendMail(mailOptions, (err,info)=>{
            if(err){
                console.log(err);
            }
        });
    });

}

function getMesseages(req, res, next) {
    const user = req.header('username');

    let inbox = req.query.inbox;
    var messages = [];
    let sql;
    if(inbox === 'true'){
        sql = `SELECT * FROM Message WHERE To_User = "${user}"`;
    }
    else {
        sql = `SELECT * FROM Message WHERE From_User = "${user}"`;

    }


    db.all(sql, [], (err, rows) => {
            if (err) {
                res.send(err);
            }
            else {
                try {

                    rows.forEach((row) => {
                        let sent_message = row.Sent_Message;
                        const from_user = row.From_User;
                        const to_user = row.To_User;
                        const encryption = row.Encryption;
                        const sent_date = row.Sent_Date;
                        const encryption_key = row.Encryption_Key;

                        let message = {
                            "sent_message": sent_message,
                            "from_user": from_user,
                            "to_user": to_user,
                            "encryption": encryption,
                            "sent_date": sent_date,
                            "encryption_key": encryption_key
                        };

                        messages.push(message);

                    });

                    res.send(JSON.stringify(messages));
                }
                catch (e) {
                    res.send(400);
                }
            }

        }
    );
}

module.exports.send_message = sendMessage;
module.exports.get_messages = getMesseages;