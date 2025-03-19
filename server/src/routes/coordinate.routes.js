const router = require('express').Router();
const CoordinateController = require('../controllers/Coordinate.controller.js');
const verifyAccessToken = require('../middleware/verifyAccessToken.js');

router.get('/', CoordinateController.getAllCoordinates);
// Получение маршрута по ID
router.get('/:id', verifyAccessToken, CoordinateController.getCoordinateById);
// Получение координат по pathId
router.get('/by-path/:pathId', verifyAccessToken, CoordinateController.getCoordinatesByPathId);
// Создание маршрута
router.post('/', verifyAccessToken, CoordinateController.createCoordinate);
// Обновление маршрута
router.put('/update/:id', verifyAccessToken, CoordinateController.updateCoordinate);
// Удаление маршрута
router.delete('/delete/:id', verifyAccessToken, CoordinateController.deleteCoordinate);


module.exports = router;