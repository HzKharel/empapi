const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/empDB.db');

//creating a global email transporter service
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'encodedmessagingplatform@gmail.com',
        pass: 'Empapi10!'
    }
});

//get the total number of users from the database
function get_total_users(req, res) {
    let sql = "SELECT Count(*) AS count FROM USER";
    //calling db
    db.get(sql, [], (err,row)=>{
        if(err){
            res.sendStatus(400);
        }
        else {
            try {
                res.send(`${row.count}`);

            }
            catch (e){
                console.log(e);
                res.sendStatus(400);
            }

        }
    });

}
//getting the total number of messages sent
function get_total_messages(req, res) {
    let sql = "SELECT Count(*) AS count FROM Message";

    //calling the db
    db.get(sql, [], (err,row)=>{
        if(err){
            res.sendStatus(400);
        }
        else {
            try {
                res.send(`${row.count}`);
            }
            catch (e){
                console.log(e);
                res.sendStatus(400);
            }

        }
    });

}

//function to delete the given user
function admin_delete_user(req, res) {
    const username = req.body.username;
    let usersql = "DELETE FROM USER where User_Name = ?";
    let msgsql = "DELETE FROM Message where From_User = ? OR To_User = ?";

    //calling db to remove the user
    db.run(usersql, [username], (err)=>{
        if(err){
            res.sendStatus(400);
        }
    });
//calling the db to remove the messages
    db.run(msgsql, [username, username], (err)=>{
        if(err){
            res.sendStatus(400);
        }
    });

    res.sendStatus(200);
}

//giving or taking admin stat of a user
function give_admin(req, res) {

    console.log('called');
    const username = req.body.username;
    const admin_stat = req.body.adminstat;
    console.log(admin_stat);
    let sql = `update USER set Admin = '${admin_stat}' WHERE User_Name = '${username}'`;
    db.run(sql, [], (err)=>{
        if(err){
            res.sendStatus(400);
        }
        else {
            res.sendStatus(200);
        }
    });
}
//sending an email to the user
function send_email(req, res) {

    const username = req.body.username;
    const subject = req.body.subject;
    const content = req.body.content;
    let sql = "SELECT email FROM user where User_Name = ?";

    //getting email from db
    db.get(sql, [username], (err,row)=>{
        if(err){
            console.log("Error" + err);
            res.sendStatus(400);
        }
        else {
            let email;
            try{
                email = row.Email;

                //building email body
                const mailOptions = {
                    from: 'emp@gmail.com',
                    to: email,
                    subject: subject,
                    html: content
                };

                //sending the email
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        res.send("Error Sending Mail.")
                    }
                    else {
                        res.sendStatus(200);
                    }
                });
            }
            //catching the errors
            catch (e){
                res.send("The User With That Username Does Not Exist!");
            }

        }
    });
}

//exports
module.exports.totalUsers = get_total_users;
module.exports.totalMessages = get_total_messages;
module.exports.admin_delete_user = admin_delete_user;
module.exports.sendmail = send_email;
module.exports.giveAdmin = give_admin;