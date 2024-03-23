const router = require('express').Router();
const { fetchRestaurants } = require('../server');

router.get('/', async (req, res, next) => {
  try {
    const restaurants = await fetchRestaurants();
    res.status(200).send(restaurants);
  } catch(error) {
    next(error)
  }
});

module.exports = router;