const router = require('express').Router();
const CompanionController = require('../controllers/Companion.controller.js');
const RoadController = require('../controllers/Road.controller.js');
const verifyAccessToken = require('../middleware/verifyAccessToken.js');

router.get('/roads', RoadController.getAllRoads);
// Получение маршрута по ID
router.get('/:id', verifyAccessToken, RoadController.getRoadById);
// Создание маршрута
router.post('/', verifyAccessToken, RoadController.createRoad);
// Обновление маршрута
router.put('/update/:id', verifyAccessToken, RoadController.updateRoad);
// Удаление маршрута
router.delete('/delete/:id', verifyAccessToken, RoadController.deleteRoad);



// Компаньоны
// Получение списка компаньонов
router.get('/:roadId/companions', verifyAccessToken, CompanionController.getCompanions);
// Добавление компаньона
router.post('/:roadId/companion', verifyAccessToken, CompanionController.addCompanion); // !!!
// Удаление компаньона
router.delete('/:roadId/companions/:userId', verifyAccessToken, CompanionController.removeCompanion);

module.exports = router;
