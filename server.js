import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import fetch from 'node-fetch';


import registerHandler from "./controllers/register.js";
import signinHandler from "./controllers/signin.js";
import profileHandler from "./controllers/profile.js";
import imageHandler from "./controllers/image.js";

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

// Add a new route to handle Clarifai API calls securely
app.post('/clarifai', (req, res) => {
  // Get the image URL from the request body
  const imageUrl = req.body.imageUrl;

  
  const CLARIFAI_PAT = '6399446788964a84813fa6a92d82ca0d';

 
  const CLARIFAI_API_URL = 'https://api.clarifai.com/v2/models/general-image-recognition/versions/aa7f35c01e0642fda5cf400f543e7c40/outputs';

  
  const requestBody = {
    "user_app_id": {
      "user_id": "marijana29", 
      "app_id": "facerecognitionbrain"      
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": imageUrl
          }
        }
      }
    ]
  };

  // Make the Clarifai API call from the server using your PAT
  fetch(CLARIFAI_API_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Key ${CLARIFAI_PAT}`, // Use your Clarifai PAT here
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(result => {
      // Handle the Clarifai API response here
      res.json(result);
    })
    .catch(error => {
      console.error('Error calling Clarifai API:', error);
      res.status(500).json('Error calling Clarifai API');
    });
});

app.put('/image', (req, res) => { imageHandler.handleApiCall(req, res, db) });
app.post('/imageurl', (req, res) => { imageHandler.handleApiCall(req, res) });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
