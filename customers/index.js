const router = require('express').Router();
const { fetchCustomers, deleteReservation, createReservation } = require('../server');

router.get('/', async (req, res, next) => {
  try {
    const customers = await fetchCustomers();
    res.status(200).send(customers);
  } catch(error) {
    next(error)
  }
  console.log('here are my customers')
});

router.post('/:customer_id/reservations/', async (req, res, next) => {
  try{
    const reservations = await createReservation({
      customer_id: req.params.customer_id, 
      restaurant_id: req.body.restaurant_id, 
      reservation_date: req.body.reservation_date,
      party_count: req.body.party_count
    });
      res.status(201).send(reservations);
    } catch(error) {
      next(error)
    }
});

router.delete('/:customer_id/:reservations/:id', async (req, res, next) => {
  try {
    await deleteReservation({customer_id: req.params.customer_id, id: req.params.reservation});
    res.status(204).end();
  } catch (error) {
    next(error)
  }
})


module.exports = router;