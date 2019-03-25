const express = require('express');
const user_management = require('./UserManagement/UserManagement');
const app = express();
app.use(express.json());
const user_register = user_management.register_user;
const authorize = user_management.auth;
const updateDetails = user_management.update;
const user_details = user_management.user_details;
const delete_user = user_management.delete_user;

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



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));
