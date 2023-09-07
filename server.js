import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';


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
app.post('/signin', (req, res) => { signin.signinHandler(req, res, db, bcrypt)});

app.post('/register', (req, res) => { register.registerHandler(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => { profile.profileHandler(req, res, db)});

app.put('/image', (req, res) => { image.imageHandler(req, res, db)});
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)});
 



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});


