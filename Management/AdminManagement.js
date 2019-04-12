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

function get_total_users(req, res) {
    let sql = "SELECT Count(*) AS count FROM USER";
    db.get(sql, [], (err,row)=>{
        if(err){
            res.sendStatus(400);
        }
        else {
            try {
                res.send(row);

            }
            catch (e){
                console.log(e);
                res.sendStatus(400);
            }

        }
    });

}

function get_total_messages(req, res) {
    let sql = "SELECT Count(*) AS count FROM Message";
    db.get(sql, [], (err,row)=>{
        if(err){
            res.sendStatus(400);
        }
        else {
            try {
                res.send(row);
            }
            catch (e){
                console.log(e);
                res.sendStatus(400);
            }

        }
    });

}


function admin_delete_user(req, res) {
    const username = req.body.username;
    let usersql = "DELETE FROM USER where User_Name = ?";
    let msgsql = "DELETE FROM Message where From_User = ? OR To_User = ?";
    db.run(usersql, [username], (err)=>{
        if(err){
            res.sendStatus(400);
        }
    });

    db.run(msgsql, [username, username], (err)=>{
        if(err){
            res.sendStatus(400);
        }
    });

    res.sendStatus(200);
}

function give_admin(req, res) {

    const username = req.body.username;
    const admin_stat = req.body.adminstat;
    let sql = `update USER set Admin = '${admin_stat}' WHERE User_Name = '${username}'`;
    db.run(sql, [], (err)=>{
        console.log(sql);
        if(err){
            res.sendStatus(400);
        }
        else {
            res.sendStatus(200);
        }
    });
}

function send_email(req, res) {

    const username = req.body.username;
    const subject = req.body.subject;
    const content = req.body.content;
    let sql = "SELECT email FROM user where User_Name = ?";
    db.get(sql, [username], (err,row)=>{
        if(err){
            console.log("Error" + err);
            res.sendStatus(400);
        }
        else {
            let email;
            try{
                email = row.Email;

                const mailOptions = {
                    from: 'emp@gmail.com',
                    to: email,
                    subject: subject,
                    html: content
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        res.send("Error Sending Mail.")
                    }
                    else {
                        res.sendStatus(200);
                    }
                });
            }
            catch (e){
                res.send("The User With That Username Does Not Exist!");
            }

        }
    });
}

module.exports.totalUsers = get_total_users;
module.exports.totalMessages = get_total_messages;
module.exports.admin_delete_user = admin_delete_user;
module.exports.sendmail = send_email;
module.exports.giveAdmin = give_admin;