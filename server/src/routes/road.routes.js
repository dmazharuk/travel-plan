const router = require('express').Router();
const RoadController = require('../controllers/Road.controller.js');
const verifyAccessToken = require('../middleware/verifyAccessToken.js');

router.get('/roads', RoadController.getAllRoads);
router.get('/:id', verifyAccessToken, RoadController.getRoadById);
router.post('/', verifyAccessToken, RoadController.createRoad);
// router.put('/:id', verifyAccessToken, RoadController.updateRoad);
// router.delete('/:id', verifyAccessToken, RoadController.deleteRoad);
router.put('/update/:id', verifyAccessToken, RoadController.updateRoad);
router.delete('/delete/:id', verifyAccessToken, RoadController.deleteRoad);

module.exports = router;
