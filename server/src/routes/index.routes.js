const router = require('express').Router(); 
const authRoutes = require('./auth.routes'); 
const roadRoutes = require('./road.routes');
const roadPaths = require('./path.routes');
const roadCoordinates = require('./coordinate.routes');
const formatResponse = require('../utils/formatResponse'); 


router.use('/auth', authRoutes); 
router.use('/road', roadRoutes);
router.use('/path', roadPaths);
router.use('/coordinate', roadCoordinates);

router.use('*', (req, res) => {
  res.status(404).json(formatResponse(404, 'Not found'));
});

module.exports = router;
