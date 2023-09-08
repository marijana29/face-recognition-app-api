import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: process.env.API_CLARIFAI,
});

const handleApiCall = (req, res, db) => {
  app.models
    .predict('face-detection', req.body.input)
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
  const { id, imageUrl } = req.body;

  console.log('Received request to update entries for user ID:', id);

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      console.log('Updated entries:', entries[0].entries);
      res.json(entries[0].entries);
    })
    .catch(err => {
      console.error('Error updating entries:', err); // Log the error for debugging
      res.status(400).json('Unable to update entries');
    });
}


export default { imageHandler, handleApiCall };
