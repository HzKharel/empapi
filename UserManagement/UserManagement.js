const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/empDB.db');

function register(req, res, next) {
    const password = req.body.password;
    const username = req.body.username;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const date = new Date().toDateString();
    const SQLinsert = `INSERT INTO user
  (User_Password, User_Name, First_Name, Last_Name, Email, Creation_Date)
  VALUES (?,?,?,?,?,?)`;
    db.run(SQLinsert, [password, username, first_name, last_name, email, date], (err) => {
        if (err) {
            console.log(err);
            if (err.toString().toLowerCase().includes('email')) {
                res.send("ERROR: Email Address Must Be Unique");
            }
            if (err.toString().toLowerCase().includes('user_name')) {
                res.send("ERROR: User Name Must Be Unique");
            }
        }
        else {
            res.send("User Created Successfully");
        }

    });

}

module.exports.register_user = register;
