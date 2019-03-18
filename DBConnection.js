const sqlite3 = require('sqlite3').verbose();
let db= null;
class DBConnection {
    constructor(){
        db = new sqlite3.Database('db/emp.db');
    }

}

module.exports = DBConnection;