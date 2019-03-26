const express = require('express');
const um = require('./Management/UserManagement');
const mm = require('./Management/MessageManagement');

const app = express();
app.use(express.json());

const user_register = um.register_user;
const authorize = um.auth;
const updateDetails = um.update;
const user_details = um.user_details;
const delete_user = um.delete_user;
const send_message = mm.send_message;
const get_messages = mm.get_messages;

//request mapping
app.post('/api/registerUser',(req, res) => {
    user_register(req, res);
});

app.post('/api/login',authorize, (req, res) => {
    res.sendStatus(200);
});

app.post('/api/updateUser',authorize, updateDetails, (req, res) => {
    res.sendStatus(200);
});

app.get('/api/getUserDetails',authorize, user_details);

app.post('/api/deleteUser',authorize, delete_user, (req, res) =>{
    res.send(200);
});

app.post('/api/sendMessage', authorize, send_message);

app.get('/api/getMessages', authorize, get_messages);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));
