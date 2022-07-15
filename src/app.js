const express = require('express');

const bodyParser = require('body-parser');

const routes = require('./routes/index.js');

require('./db.js');
const cors = require('cors')
const server = express();

server.name = 'API';

server.use(
  cors({
    credentials: true,
    origin:  ['https://poke-api-henry.vercel.app', 'https://api-pokemon-deploy.herokuapp.com/types', 'http://localhost:3000', 'https://api-pokemon-deploy.herokuapp.com/pokemons', 'https://git.heroku.com/henry-proyecto-nft.git'],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
  })

)
server.use(express.json())
server.use('/', routes);

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
