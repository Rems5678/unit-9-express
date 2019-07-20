const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3000;

/**
 * require routers
 */
const router = require('./routes/api.js');
const favsRouter = require('./routes/favs.js');

/**
 * handle parsing request body
 */
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
})
/**
 * handle requests for static files
 */
app.use('/assets', express.static(path.join(__dirname, '../client/assets')))

/**
 * define route handlers
 */
app.use('/api', router);
app.use('/api/favs', favsRouter);

// catch-all route handler for any requests to an unknown route

app.use('*', (req, res) => {res.status(404).send('File not found')})

// route handler to respond with main app
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' }, 
  }
  const errorObj = Object.assign(defaultErr, err);  
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
})




/**
 * configire express global error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */
// eslint-disable-next-line no-unused-vars

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
