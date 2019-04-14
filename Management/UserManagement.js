const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const saltRounds = 10;

let db = new sqlite3.Database('./db/empDB.db');

//creating an email transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'encodedmessagingplatform@gmail.com',
        pass: 'Empapi10!'
    }
});

//validates all the user data
function data_validator(res, username, password, email) {
    if (username.length <= 5) {
        res.send("Username Must be at Least 6 characters Long.");
    }
    else if (password.length <= 5) {
        res.send("Password Must be at Least 6 characters Long.");
    }
    else if (email.length <= 3 || !email.includes('@')) {
        res.send("Please Enter a Valid Email.");
    }
    else {
        return true;
    }

}
//hashing user password using bcrypt using synchronous method (sync due to design issue)
function password_encrypt(password) {
    return bcrypt.hashSync(password, saltRounds);
}

//register a new user
function register(req, res, next) {
    //gathering required data
    const password = req.body.password;
    const username = req.body.username;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    let admin = 0;
    if(username === 'EMPAdmin'){
        admin = 1;
    }
    //getting current date and time
    const date = new Date().toLocaleString();
    const SQLinsert = `INSERT INTO user
  (User_Password, User_Name, First_Name, Last_Name, Email, Creation_Date, Admin)
  VALUES (?,?,?,?,?,?,?)`;
    if (data_validator(res, username, password, email)) {

        //hashing password
        let hash = password_encrypt(password);

        //calling the db
        db.run(SQLinsert, [hash, username, first_name, last_name, email, date, admin], (err) => {
            if (err) {
                console.log(err);
                if (err.toString().toLowerCase().includes('user_name')) {
                    res.send("Error: Username Must be Unique");
                }
                else if (err.toString().toLowerCase().includes('email')) {
                    res.send("Error: Email Must be Unique");
                }
                else {
                    res.send("Unexpected Error!");
                }
            }
            else {
                res.send("User Created Successfully");

                //building email body to let user know their account was created
                const mailOptions = {
                    from: 'emp@gmail.com',
                    to: email,
                    subject: 'Welcome To Encoded Messaging Platform',
                    html: `<h2>Hello, ${username} </h2> <br> <p>Your Account was successfully created! Head over to the login page to access your account.</p>`
                };

                //sending the email
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

}

//checking if the supplied username and password matches a user
function auth(req, res, next) {
    const username = req.header('username');
    const password = req.header('password');

    //calling the db
    let sql = `SELECT User_Name, User_Password FROM User WHERE User_Name = "${username}"`;
    db.get(sql, [], (err, row) => {

        if (err) {
            res.send(err);
        }
        else {
            try {
                //comparing the hashed passwords
                let hash = row.User_Password;
                bcrypt.compare(password, hash, (err, resp) => {
                    if (resp && username === row.User_Name) {
                        next();
                    }
                    else if (!resp) {
                        res.sendStatus(404);
                    }
                });
            }
            catch (e) {
                res.sendStatus(404);
            }

        }
    });
}

//updating the user details
function UpdateUserDB(req,res,userDetails) {

    //gathering required data s
    let user_name_update = req.body.username;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let password = req.body.password;
    let email = req.body.email;

    if (data_validator(res, user_name_update, password, email)) {
        //hashing the new password
        let hash = password_encrypt(password);

        //calling the db to update email
        db.run('update USER set email = ? WHERE UserID = ?', [email,userDetails.userID]), (err)=>{
            if(err){
                res.write('Error Updating Email' + err +'\n');
            }
        };

        //calling the db to update password
        db.run('update USER set User_Password = ? WHERE  UserID = ?', [hash,userDetails.userID]), (err)=>{
            if(err){
                if(err){
                    res.write('Error Updating the Password' + err +'\n');
                }
            }
        };
        //calling the db to First and Last names
        db.run('update USER set First_Name = ?, Last_Name = ? WHERE  UserID = ?', [first_name,last_name,userDetails.userID]), (err)=>{
            if(err){

                if(err){
                    res.write('Error Updating Name' + err +'\n');
                }
            }
        };



    }

    res.send("User Details Updated.");
}

//the update method that gets called
function updateDetails(req, res, next) {

    const user_name = req.header('username');
    let userDetails = new Object();

    //getting all current user data
    db.get("Select * from User WHERE User_Name = ?", [user_name], (err,row)=>{

       if(err){
           res.Write("Unknown Error Occurred!");
       }
       else {
           //creating an object from the user details
           userDetails.userID = row.UserID;
           userDetails.UserName = row.User_Name;
           userDetails.email = row.Email;
           userDetails.password = row.User_Password;

           UpdateUserDB(req,res,userDetails);
       }
    });
}

//getting all the user
function getUserDetails(req, res, next) {
    const user_name = req.header('username');
    let sql = `SELECT * from USER where User_Name = "${user_name}"`;

    //calling the db
    db.get(sql, [], (err, row) => {
        if (err) {
            res.sendStatus(400);
        }
        else {
            //building a data stream
            const user_id = row.UserID;
            const user_name = row.User_Name;
            const user_password = row.User_Password;
            const first_name = row.First_Name;
            const last_name = row.Last_Name;
            const email = row.Email;
            const creation_date = row.Creation_Date;
            const admin = row.Admin;

            let response = {
                "User_ID": user_id,
                "User_Name": user_name,
                "User_Password": user_password,
                "First_Name": first_name,
                "Last_Name": last_name,
                "Email": email,
                "Creation_Date": creation_date,
                "Admin" : admin
            };


            res.send(response);
        }

    });

}

//deleting the user account
function deleteUser(req, res, next) {
    const user_name = req.header('username');
    let sql = `DELETE FROM User WHERE User_Name = ?`;

    //calling db
    db.run(sql, [user_name], (err) => {
        if (err) {
            res.sendStatus(400);
        }
        else {
            res.sendStatus(200);
        }
    });


}

//resetting current user password
function passwordReset(req, res) {
    const username = req.body.username;
    const email = req.body.email;
    let sql = `SELECT User_Name FROM User WHERE User_Name = ? AND Email = ? `;

    //checking if user with the given username and email exists
    db.get(sql,[username,email], (err, row)=>{
        if(err){
            res.sendStatus(400);
        }
        else {
            if(row.User_Name === username){

                //generating a random hex password using crypto to increase security and hashing it
                let temppswd = crypto.randomBytes(10).toString('hex');
                let temppswdhash = password_encrypt(temppswd);

                //changing the user password to the generated one
                let updateSql = `update USER set User_Password = '${temppswdhash}' WHERE User_Name = ?`;
                db.run(updateSql, [username], (err)=>{
                    if(err){
                       console.log(err);
                       res.sendStatus(400);
                    }
                });

                //emailing the user the new password
                const mailOptions = {
                    from: 'emp@gmail.com',
                    to: email,
                    subject: 'EMP Password Reset',
                    html: `<h2>Hello, ${username} </h2> <br> <p>You recently requested to reset your password.</p><br><p>A new temporary password was generated for you. Please log in using:  ${temppswd}</p><br><p>Make Sure you change your password afterwards</p>`
                };

                //sending the email
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                    }
                });


                res.sendStatus(200);


            }
        }
    });

}
//checking if the user is an admin
function checkAdmin(req, res, next) {
    const username = req.header('username');
    let sql = "Select Admin from User where User_Name = ?";
    db.get(sql, [username], (err,row)=>{
        if(err){
            res.sendStatus(400);
        }
        else {
            if(row.Admin === 1){
               next();
            }
            else {
                res.sendStatus(403);
            }
        }
    });

}

//exports
module.exports.register_user = register;
module.exports.auth = auth;
module.exports.update = updateDetails;
module.exports.user_details = getUserDetails;
module.exports.delete_user = deleteUser;
module.exports.reset_password = passwordReset;
module.exports.checkAdmin = checkAdmin;
