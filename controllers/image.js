import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: process.env.API_CLARIFAI,
});

const handleApiCall = (req, res) => {
  const { imageUrl } = req.body; // Retrieve imageUrl from the request body

  app.models
    .predict('face-detection', { url: imageUrl }) // Use imageUrl from the request body
    .then((data) => {
      if (data && data.outputs && data.outputs.length > 0) {
        // Process the data as needed
        res.json(data);
      } else {
        console.error('Invalid or empty response from Clarifai API:', data);
        res.status(400).json('Unable to work with API');
      }
    })
    .catch((err) => {
      console.error('Error calling Clarifai API:', err);
      res.status(400).json('Unable to work with API');
    });
};

const imageHandler = (req, res, db) => {
  const { id } = req.body; // No need for imageUrl in this function

  console.log('Received request to update entries for user ID:', id);

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      console.log('Updated entries:', entries[0]);
      res.json(entries[0]);
    })
    .catch((err) => {
      console.error('Error updating entries:', err);
      res.status(400).json('Unable to update entries');
    });
};

export default { imageHandler, handleApiCall };
