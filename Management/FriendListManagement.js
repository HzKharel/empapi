const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/empDB.db');

//function to add a new contact to ther users list
function add_contact(req, res, next) {

    const senderName = req.header('username');
    const reciverName = req.body.contact;
    const contactID = senderName+reciverName;

    //length check
    if(contactID.length <= 5){
            res.send("Contact ID Must be at Least 6 characters Long.");
    }
    else{
        const sql = "INSERT INTO ContactList (ID, User_Name, Contact_Name) VALUES (?,?,?)";
        //calling the db
        db.run(sql, [contactID, senderName,reciverName], (err)=>{
            if(err){
                res.send("No Need, That Contact is Already On Your List.");
            }
            else{
                res.send("Contact Added Successfully.");
            }
        });
    }

}

//retrieving all of the users contacts
function get_contacts(req, res, next) {

    const user_name = req.header('username');
    let contacts = [];

    const sql = `SELECT DISTINCT Contact_Name FROM ContactList WHERE User_Name =  "${user_name}"`;
    //getting the username from the db
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
       //sending a list of contacts to the frontend
        res.send(contacts);
    });
}

//removing an added contact from the list
function delete_contact(req, res, next) {
    const senderName = req.header('username');
    const reciverName = req.body.contact;
    const contactID = senderName+reciverName;

    let sql = `DELETE FROM ContactList WHERE ID = "${contactID}"`;
    //calling the db
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