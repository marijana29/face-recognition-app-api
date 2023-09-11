import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import registerHandler from "./controllers/register.js";
import signinHandler from "./controllers/signin.js";
import profileHandler from "./controllers/profile.js";
import image from "./controllers/image.js"; // Use import instead of { imageHandler, handleApiCall }

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
  }
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => { res.send(db.users) });
app.post('/signin', (req, res) => { signinHandler(req, res, db, bcrypt) });
app.post('/register', (req, res) => { registerHandler(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profileHandler(req, res, db) });
app.put('/image', (req, res) => { image.imageHandler(req, res, db) }); // Use 'image' instead of { imageHandler }
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) }); // Use 'image' instead of { handleApiCall }

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
