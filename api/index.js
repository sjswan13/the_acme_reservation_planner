const router = require('express').Router();

router.use('/customers', require('../customers'));
router.use('/restaurants', require('../restaurants'));
router.use('/reservations', require('../reservations'));


module.exports = router;