const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/empDB.db');

function add_contact(req, res, next) {

    const senderName = req.header('username');
    const reciverName = req.body.contact;
    const contactID = senderName+reciverName;

    const sql = "INSERT INTO ContactList (ID, User_Name, Contact_Name) VALUES (?,?,?)";

    db.run(sql, [contactID, senderName,reciverName], (err)=>{
       if(err){
           console.log(err);
           res.send(err);
       }
       else{
           res.sendStatus(200);
       }
    });
}

function get_contacts(req, res, next) {

    const user_name = req.header('username');
    let contacts = [];

    const sql = `SELECT DISTINCT Contact_Name FROM ContactList WHERE User_Name =  "${user_name}"`;
    db.all(sql, [], (err, rows)=>{
       if(err){
           res.send(err);
       }
       else {
           rows.forEach((row)=>{
               const contact_name = row.Contact_Name;

               let contact = {
                   "contact_name" : contact_name};

               contacts.push(contact);

           });

       }
       console.log(contacts);
        res.send(contacts);
    });
}

function delete_contact(req, res, next) {
    const senderName = req.header('username');
    const reciverName = req.body.contact;
    const contactID = senderName+reciverName;

    let sql = `DELETE FROM ContactList WHERE ID = "${contactID}"`;
    db.run(sql,[],(err)=>{
        if(err){
            res.sendStatus(400);
        }
        else {
            res.sendStatus(200);
        }
    });
}

module.exports.addContact = add_contact;
module.exports.getContacts = get_contacts;
module.exports.deleteContact = delete_contact;