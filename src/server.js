import { app } from './app/index.js';

// TODO: can make this configurable.
const port = 3000;

app.listen(port, (err) => {
  if (err) {
    console.log('Error on listen:', err.message);
    throw err;
  }

  console.log(`Example app listening on port ${port}`);
});
