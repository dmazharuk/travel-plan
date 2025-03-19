const road = require("../db/models/road");
const PathService = require("../services/Path.service");
const formatResponse = require("../utils/formatResponse");
const { Path } = require('../db/models');


class PathController {
  // //вариант 1, максима
  // static async createPath(req, res) {
  //   const { pathName } = req.body;
  //   const { road } = res.locals;

  //   try {
  //     const newPath = await PathService.create({
  //       pathName: pathName,
  //       roadId: road.id,
  //     });

  //     if (!newPath) {
  //       return res
  //         .status(400)
  //         .json(formatResponse(400, `Failed to create new path`));
  //     }

  //     res.status(201).json(formatResponse(201, "Success", newPath));
  //   } catch ({ message }) {
  //     res
  //       .status(500)
  //       .json(formatResponse(500, "Internal server error", null, message));
  //   }
  // }

  //вариант 2 от чата
  static async createPath(req, res) {
    const { pathName, roadId } = req.body; // Получаем roadId из тела запроса
    const { road } = res.locals; // Получаем road из res.locals (если он есть)

    try {
      // Если roadId не передан в запросе, используем road.id из res.locals
      const finalRoadId = roadId || road?.id;

      // Проверяем, что roadId задан (либо из запроса, либо из res.locals)
      if (!finalRoadId) {
        return res.status(400).json(formatResponse(400, "Road ID is required"));
      }

      // Создаем новый путь
      const newPath = await PathService.create({
        pathName: pathName,
        roadId: finalRoadId, // Используем finalRoadId
      });

      if (!newPath) {
        return res
          .status(400)
          .json(formatResponse(400, "Failed to create new path"));
      }

      // Возвращаем успешный ответ
      res.status(201).json(formatResponse(201, "Success", newPath));
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, message));
    }
  }

  static async getAllPaths(req, res) {
    try {
      const allPaths = await PathService.getAll();
      res.status(200).json(formatResponse(200, "Success", allPaths));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, "Internal server error", null, error.message)
        );
    }
  }

  static async getPathById(req, res) {
    const { id } = req.params;

    try {
      const path = await PathService.findById(id);

      if (!path) {
        return res.status(404).json(formatResponse(404, "Path not found"));
      }

      res.status(200).json(formatResponse(200, "Success", path));
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, message));
    }
  }

  //получение по айди роуда
  // static async getPathByRoadId(req, res) {

  //   try {
  //     const { roadId } = req.params;

  //     // Ищем Path по roadId
  //     const path = await Path.findOne({ where: { roadId } });
  //     console.log('>>>>>>>>>>>>>>>>>>>>>>>>', path);
      

  //     if (!path) {
  //       return res
  //         .status(404)
  //         .json(formatResponse(404, "Path not found for this roadId"));
  //     }

  //     res.status(200).json(formatResponse(200, "Success", path));
  //   } catch ({ message }) {
  //     res
  //       .status(500)
  //       .json(formatResponse(500, "Internal server error", null, message));
  //   }
  // }

  //получение по айди роуда
  // static async getPathByRoadId(req, res) {
  //   const { id } = req.params;


  //     const path = await PathService.findById(id);
  //     console.log(path);
      


  //   try {
  //     const { roadId } = req.params;
  //     console.log('>>>>>>>>>>>>>>>>>>>', roadId);
      
  
  //     // Проверяем, что roadId передан и является числом
  //     if (!roadId || isNaN(roadId)) {
  //       return res.status(400).json(formatResponse(400, "Invalid roadId"));
  //     }
  
  //     // Ищем Path по roadId
  //     const path = await Path.findOne({ where: { roadId: Number(roadId) } });
  //     console.log('Path found:>>>>>>>>>>>>>>>>>>>', path);
  
  //     if (!path) {
  //       return res.status(404).json(formatResponse(404, "Path not found for this roadId"));
  //     }
  
  //     res.status(200).json(formatResponse(200, "Success", path));
  //   } catch ({ message }) {
  //     console.error('Error in getPathByRoadId:', message);
  //     res.status(500).json(formatResponse(500, "Internal server error", null, message));
  //   }
  // }

  static async getPathByRoadId(req, res) {
    try {
      const { roadId } = req.params;
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>',roadId);


      if (!roadId ) {
        return res.status(400).json({ message: 'roadId is required' });
      }

      const path = await Path.findOne({
        where: { roadId },
      });

      // console.log('>>>>>>>>>>>>>>>>>>>>>>>',path);
      

      if (!path || path.length  === 0) {
        return res
        .status(404)
        .json(formatResponse(404, "No paths found for this roadId"));
      }

      res.status(200).json(formatResponse(200, "Success", path));
    } catch (error) {
      console.error('Error fetching paths by roadId:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }





  // //в1, типовой
  // static async updatePath(req, res) {
  //   const { id } = req.params;
  //   const { pathName } = req.body;
  //   const { road } = res.locals;

  //   try {
  //     const updatedPath = await PathService.update(id, {
  //       pathName,
  //       roadId: road.id,
  //     });

  //     if (!updatedPath) {
  //       return res.status(404).json(formatResponse(404, "Path not found"));
  //     }

  //     res
  //       .status(200)
  //       .json(formatResponse(200, "Path updated successfully", updatedPath));
  //   } catch ({ message }) {
  //     res
  //       .status(500)
  //       .json(formatResponse(500, "Internal server error", null, message));
  //   }
  // }

  //в2, адаптир
  static async updatePath(req, res) {
    const { id } = req.params;
    const { pathName, roadId } = req.body;
    // console.log("roadId", roadId);

    const { road } = res.locals;

    try {
      const finalRoadId = roadId || road?.id;
      // console.log("finalRoadId", finalRoadId);

      if (!finalRoadId) {
        return res.status(400).json(formatResponse(400, "Road ID is required"));
      }

      const updatedPath = await PathService.update(id, {
        pathName,
        roadId: finalRoadId,
      });
      // console.log("updatedPath", updatedPath);

      if (!updatedPath) {
        return res.status(404).json(formatResponse(404, "Path not found"));
      }

      res
        .status(200)
        .json(formatResponse(200, "Path updated successfully", updatedPath));
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, message));
    }
  }

  static async deletePath(req, res) {
    const { id } = req.params;

    try {
      const deletedPath = await PathService.delete(id);

      if (!deletedPath) {
        return res.status(404).json(formatResponse(404, "Path not found"));
      }

      res.status(200).json(formatResponse(200, "Path deleted successfully"));
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, message));
    }
  }
}

module.exports = PathController;

//
