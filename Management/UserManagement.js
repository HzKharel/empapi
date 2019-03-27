const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/empDB.db');

function register(req, res, next) {
    const password = req.body.password;
    const username = req.body.username;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const date = new Date().toLocaleString();
    const SQLinsert = `INSERT INTO user
  (User_Password, User_Name, First_Name, Last_Name, Email, Creation_Date)
  VALUES (?,?,?,?,?,?)`;
    db.run(SQLinsert, [password, username, first_name, last_name, email, date], (err) => {
        if (err) {
            console.log(err);
            if (err.toString().toLowerCase().includes('email')) {
                res.send("ERROR: Email Address Must Be Unique");
            }
            else if (err.toString().toLowerCase().includes('user_name')) {
                res.send("ERROR: User Name Must Be Unique");
            }
            else {
                res.send("Unexpected Error!");
            }
        }
        else {
            res.send("User Created Successfully");
           // next();

        }


    });

}

function auth(req, res, next) {
    const username = req.header('username');
    const password = req.header('password');

    let sql = `SELECT User_Name, User_Password FROM User WHERE User_Name = "${username}"`;
    db.get(sql, [], (err, row)=>{
        if(err){
            console.log(err);
            res.sendStatus(400);
        }
        else {
            try{
                if(row.User_Name === username && row.User_Password === password){
                    next();
                }
                else{


                    res.sendStatus(404);
                }
            }
            catch (e){
                res.sendStatus(400);
            }

        }
    });
}

function updateDetails(req, res, next) {

    const user_name = req.header('username');
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let password = req.body.password;
    let email = req.body.email;

    let sql = `UPDATE
                 user
                    SET
                        User_Password = "${password}",
                        First_Name = "${first_name}",
                        Last_Name = "${last_name}",
                        Email = "${email}"
                    WHERE
                        User_Name = "${user_name}"`;

    db.run(sql, [], (err)=>{
        if(err){
            console.log(err);
            res.send(400);
        }
        else {
            res.send(200);
        }
    });
    
}

function getUserDetails(req, res, next) {
    const user_name = req.header('username');
    let sql = `SELECT * from USER where User_Name = "${user_name}"`
    db.get(sql,[], (err, row)=>{
        if(err){
            res.sendStatus(400);
        }
        else{
            const user_id = row.UserID;
            const user_name = row.User_Name;
            const user_password = row.User_Password;
            const first_name = row.First_Name;
            const last_name = row.Last_Name;
            const email = row.Email;
            const creation_date = row.Creation_Date;

            let response = {"User_ID" : user_id,
            "User_Name" : user_name,
            "User_Password" : user_password,
            "First_Name" : first_name,
            "Last_Name" : last_name,
            "Email" : email,
            "Creation_Date": creation_date};


            res.send(response);
        }

    });
    
}

function deleteUser(req, res, next) {
    const user_name = req.header('username');
    let sql = `DELETE FROM User WHERE User_Name = "${user_name}"`;
    db.run(sql, [], (err)=>{
        if(err){
            res.sendStatus(400);
        }
        else {
            res.send(200);
        }
    });


}

module.exports.register_user = register;
module.exports.auth = auth;
module.exports.update = updateDetails;
module.exports.user_details = getUserDetails;
module.exports.delete_user = deleteUser;
