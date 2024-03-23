const router = require('express').Router();
const { fetchReservations } = require('../server');

router.get('/', async (req, res, next) => {
  try {
    const reservations = await fetchReservations();
    res.status(200).send(reservations);
  } catch (error) {
    next(error)
  }
});

module.exports = router;