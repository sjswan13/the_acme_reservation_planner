require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const router = require ('./api')

const { client, createTables, seed } = require('./server')
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(morgan('combined'))

const init = async () => {

  await client.connect();
  console.log('db connected');
  await createTables();
  console.log('tables created');
  await seed();
  console.log('data seeded')

app.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
};

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
})
app.use('/api', router);

init();