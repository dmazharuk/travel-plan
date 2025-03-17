const router = require('express').Router(); 
const authRoutes = require('./auth.routes'); 
const roadRoutes = require('./road.routes');
const formatResponse = require('../utils/formatResponse'); 
const gigachatRoutes = require('./gigachat.routes');

router.use('/auth', authRoutes); 
router.use('/road', roadRoutes);
router.use('/gigachat', gigachatRoutes);

router.use('*', (req, res) => {
  res.status(404).json(formatResponse(404, 'Not found'));
});

module.exports = router;
