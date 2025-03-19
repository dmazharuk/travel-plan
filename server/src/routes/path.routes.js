const router = require('express').Router();
const PathController = require('../controllers/Path.controller.js');
const verifyAccessToken = require('../middleware/verifyAccessToken.js');

router.get('/', PathController.getAllPaths);
// Получение маршрута по ID
router.get('/:id', verifyAccessToken, PathController.getPathById);
// Создание маршрута
router.post('/', verifyAccessToken, PathController.createPath);
// Обновление маршрута
router.put('/update/:id', verifyAccessToken, PathController.updatePath);
// Удаление маршрута
router.delete('/delete/:id', verifyAccessToken, PathController.deletePath);


module.exports = router;