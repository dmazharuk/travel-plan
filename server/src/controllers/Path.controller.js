const PathService = require('../services/Path.service');
const formatResponse = require('../utils/formatResponse');
const { Path } = require('../db/models');

class PathController {
  static async createPath(req, res) {
    const { pathName, roadId } = req.body; // Получаем roadId из тела запроса
    const { road, user } = res.locals; // Получаем road из res.locals (если он есть)

    try {
      // Если roadId не передан в запросе, используем road.id из res.locals
      const finalRoadId = roadId || road?.id;

      // Проверяем, что roadId задан (либо из запроса, либо из res.locals)
      if (!finalRoadId) {
        return res.status(400).json(formatResponse(400, 'Road ID is required'));
      }

      // Создаем новый путь
      const newPath = await PathService.create({
        pathName: pathName,
        roadId: finalRoadId, // Используем finalRoadId
        userId: user.id,
      });

      if (!newPath) {
        return res
          .status(400)
          .json(formatResponse(400, 'Failed to create new path'));
      }

      // Возвращаем успешный ответ
      res.status(201).json(formatResponse(201, 'Success', newPath));
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async getAllPaths(req, res) {
    try {
      const allPaths = await PathService.getAll();
      res.status(200).json(formatResponse(200, 'Success', allPaths));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, 'Internal server error', null, error.message)
        );
    }
  }

  static async getPathById(req, res) {
    const { id } = req.params;

    try {
      const path = await PathService.findById(id);

      if (!path) {
        return res.status(404).json(formatResponse(404, 'Path not found'));
      }

      res.status(200).json(formatResponse(200, 'Success', path));
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async getPathByRoadId(req, res) {
    try {
      const { roadId } = req.params;

      if (!roadId) {
        return res.status(400).json({ message: 'roadId is required' });
      }

      const path = await Path.findOne({
        where: { roadId },
      });

      if (!path || path.length === 0) {
        return res
          .status(404)
          .json(formatResponse(404, 'No paths found for this roadId'));
      }

      res.status(200).json(formatResponse(200, 'Success', path));
    } catch (error) {
      console.error('Error fetching paths by roadId:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updatePath(req, res) {
    const { id } = req.params;
    const { pathName, roadId } = req.body;

    const { road, user } = res.locals;

    try {
      //? Проверяем существование в БД
      const existingPath = await PathService.getById(id);

      if (!existingPath) {
        return res.status(404).json(formatResponse(404, 'Task not found'));
      }

      //? Проверяем права доступа: только автор может редактировать задачу
      if (existingPath.userId !== user.id) {
        return res
          .status(400)
          .json(
            formatResponse(400, "You don't have permission to update this task")
          );
      }

      const finalRoadId = roadId || road?.id;

      if (!finalRoadId) {
        return res.status(400).json(formatResponse(400, 'Road ID is required'));
      }

      const updatedPath = await PathService.update(id, {
        pathName,
        roadId: finalRoadId,
      });

      if (!updatedPath) {
        return res.status(404).json(formatResponse(404, 'Path not found'));
      }

      res
        .status(200)
        .json(formatResponse(200, 'Path updated successfully', updatedPath));
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async deletePath(req, res) {
    const { id } = req.params;
    const { user } = res.locals;

    try {
      //? Проверяем существование задачи и права доступа
      const existingPath = await PathService.getById(+id);

      //? Проверяем существование задачи
      if (!existingPath) {
        return res.status(404).json(formatResponse(404, 'Path not found'));
      }

      //? Проверяем права доступа: только автор может удалить задачу
      if (existingPath.userId !== user.id) {
        return res
          .status(400)
          .json(
            formatResponse(400, "You don't have permission to delete this path")
          );
      }

      const deletedPath = await PathService.delete(id);

      if (!deletedPath) {
        return res.status(404).json(formatResponse(404, 'Path not found'));
      }

      res.status(200).json(formatResponse(200, 'Path deleted successfully'));
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }
}

module.exports = PathController;

//
