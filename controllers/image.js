import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: process.env.API_CLARIFAI,
});

const handleApiCall = (req, res) => {
  app.models
    .predict('face-detection', req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.error(err); // Log the error for debugging
      res.status(400).json('Unable to work with API');
    });
}

const imageHandler = (req, res, db) => {
  const { id, imageUrl } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => {
      console.error(err); // Log the error for debugging
      res.status(400).json('Unable to get entries');
    });
}

export default { imageHandler, handleApiCall };
