const express = require('express');
const user_management = require('./UserManagement/UserManagement');
const app = express();
app.use(express.json());
let user_register = user_management.register_user;
//request mapping
/*app.get('/api/registerUser', user_register ,(req, res) => {
    res.send('Welcome to Express Web App API');
});
*/

app.post('/api/registerUser',(req, res) => {
    user_register(req, res);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));
