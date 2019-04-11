const express = require('express');
const um = require('./Management/UserManagement');
const mm = require('./Management/MessageManagement');
const cm = require('./Management/FriendListManagement');

const app = express();
app.use(express.json());

const user_register = um.register_user;
const authorize = um.auth;
const updateDetails = um.update;
const user_details = um.user_details;
const delete_user = um.delete_user;
const send_message = mm.send_message;
const get_messages = mm.get_messages;
const add_contact = cm.addContact;
const get_contacts = cm.getContacts;
const delete_contact = cm.deleteContact;
const password_reset = um.reset_password;
const check_admin = um.checkAdmin;


let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    res.header('Access-Control-Allow-Methods', "*");
    next();
};

app.use(allowCrossDomain);

//request mapping
app.post('/api/registerUser', user_register);

app.post('/api/login',authorize, (req, res)=>{
    res.sendStatus(200);
});
app.get('/api/checkAdmin',authorize,check_admin);

app.post('/api/updateUser',authorize, updateDetails);

app.get('/api/getUserDetails',authorize, user_details);

app.post('/api/deleteUser',authorize, delete_user);

app.post('/api/sendMessage', authorize, send_message);

app.get('/api/getMessages', authorize, get_messages);

app.post('/api/addContact', authorize, add_contact);

app.get('/api/getContacts', authorize, get_contacts);

app.post('api/deleteContact', authorize, delete_contact);

app.post('/api/passwordReset', password_reset);





const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}.`));
