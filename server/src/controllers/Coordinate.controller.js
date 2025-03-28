const CoordinateService = require('../services/Coordinate.service');
const formatResponse = require('../utils/formatResponse');
const { Coordinate } = require('../db/models');

class CoordinateController {
  //в1 макс
  //   static async createCoordinate(req, res) {
  //     const {
  //       latitude,
  //       longitude,
  //       coordinateTitle,
  //       coordinateBody,
  //       coordinateNumber,
  //     } = req.body;
  //     const { path } = res.locals;

  //     try {
  //       const newCoordinate = await CoordinateService.create({
  //         latitude: latitude,
  //         longitude: longitude,
  //         coordinateTitle: coordinateTitle,
  //         coordinateBody: coordinateBody,
  //         coordinateNumber: coordinateNumber,
  //         pathId: path.id,
  //       });

  //       if (!newCoordinate) {
  //         return res
  //           .status(400)
  //           .json(formatResponse(400, `Failed to create new coordinate`));
  //       }

  //       res.status(201).json(formatResponse(201, "Success", newCoordinate));
  //     } catch ({ message }) {
  //       res
  //         .status(500)
  //         .json(formatResponse(500, "Internal server error", null, message));
  //     }
  //   }

  //в2
  static async createCoordinate(req, res) {
    const {
      latitude,
      longitude,
      coordinateTitle,
      coordinateBody,
      coordinateNumber,
      pathId,
    } = req.body; // Получаем pathId из тела запроса
    const { path } = res.locals; // Получаем path из res.locals (если он есть)

    try {
      // Если pathId не передан в запросе, используем path.id из res.locals
      const finalPathId = pathId || path?.id;

      // Проверяем, что pathId задан (либо из запроса, либо из res.locals)
      if (!finalPathId) {
        return res.status(400).json(formatResponse(400, 'Task ID is required'));
      }

      // Создаем новый путь
      const newCoordinate = await CoordinateService.create({
        latitude: latitude,
        longitude: longitude,
        coordinateTitle: coordinateTitle,
        coordinateBody: coordinateBody,
        coordinateNumber: coordinateNumber,
        pathId: finalPathId, // Используем finalPathId
      });

      if (!newCoordinate) {
        return res
          .status(400)
          .json(formatResponse(400, 'Failed to create new coordinate'));
      }

      // Возвращаем успешный ответ
      res.status(201).json(formatResponse(201, 'Success', newCoordinate));
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async getAllCoordinates(req, res) {
    try {
      const allCoordinates = await CoordinateService.getAll();
      res.status(200).json(formatResponse(200, 'Success', allCoordinates));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, 'Internal server error', null, error.message)
        );
    }
  }

  static async getCoordinateById(req, res) {
    const { id } = req.params;

    try {
      const coordinate = await CoordinateService.findById(id);

      if (!coordinate) {
        return res
          .status(404)
          .json(formatResponse(404, 'Coordinate not found'));
      }

      res.status(200).json(formatResponse(200, 'Success', coordinate));
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  //получение по айди path
  static async getCoordinatesByPathId(req, res) {
    try {
      const { pathId } = req.params;

      if (!pathId) {
        return res.status(400).json({ message: 'pathId is required' });
      }

      const coordinates = await Coordinate.findAll({
        where: { pathId },
      });

      if (!coordinates || coordinates.length === 0) {
        return res.status(200).json(formatResponse(200, 'Success', []));
     
      }

      res.status(200).json(formatResponse(200, 'Success', coordinates));
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async updateCoordinate(req, res) {
    const { id } = req.params;
    const {
      coordinateTitle,
      coordinateBody,
      // coordinateNumber,
    } = req.body;
    // const { path } = res.locals;

    try {
      const updatedCoordinate = await CoordinateService.update(id, {
        // latitude: latitude,
        // longitude: longitude,
        coordinateTitle: coordinateTitle,
        coordinateBody: coordinateBody,
        // coordinateNumber: coordinateNumber,
        // pathId: path.id,
      });

      if (!updatedCoordinate) {
        return res
          .status(404)
          .json(formatResponse(404, 'Coordinate not found'));
      }

      res
        .status(200)
        .json(
          formatResponse(
            200,
            'Coordinate updated successfully',
            updatedCoordinate
          )
        );
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async deleteCoordinate(req, res) {
    const { id } = req.params;

    try {
      const deletedCoordinate = await CoordinateService.delete(id);

      if (!deletedCoordinate) {
        return res
          .status(404)
          .json(formatResponse(404, 'Coordinate not found'));
      }

      res
        .status(200)
        .json(
          formatResponse(
            200,
            'Coordinate deleted successfully',
            deletedCoordinate
          )
        );
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }
}

module.exports = CoordinateController;
