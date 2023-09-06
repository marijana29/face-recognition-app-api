
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

import registerHandler from "./controllers/register.js";
import signinHandler from "./controllers/signin.js";
import profileHandler from "./controllers/profile.js";
import imageHandler from "./controllers/image.js";

const db = knex({
  client: 'pg',
  connection: {
    host : 'dpg-cjs53clv2qks73dm5t9g-a',
    user : 'mydb_rdx8_user',
    password : '4QtgjIZouGa3772fiFGhNXk2guympdVD',
    database : 'mydb_rdx8kne'
  }
});



const app = express();


app.use(cors())
app.use(express.json()); 



app.get('/', (req, res)=> { res.send(db.users) });
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)});

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});

app.put('/image', (req, res) => { image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)});
 






app.listen(5000, () => {
  console.log('app is running on port 5000');
});
