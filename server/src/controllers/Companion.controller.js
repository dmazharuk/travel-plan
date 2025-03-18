const CompanionService = require("../services/Companion.service")
const RoadService = require("../services/Road.service")
const UserService = require("../services/User.service")
const formatResponse = require("../utils/formatResponse")


class CompanionController {
  // Добавить компаньона
  static async addCompanion(req,res){
    const {roadId} = req.params
    const {email} = req.body
    const {user} = res.locals

    const normalizedEmail = email.toLowerCase()
    console.log('normalizedEmail====>',normalizedEmail)
    console.log('Request body:====>', req.body);
    console.log('Params:====>', req.params);
    console.log('user====>',res.locals);
    

    try {
     // проверка прав доступа
     const road = await RoadService.getById(Number(roadId))
     if (road.userId !== user.id) {
      return res.status(403).json({message: "У вас нет прав на добавление компаньонов"})
     }

     const companionByEmail = await UserService.getByEmail(normalizedEmail)

     if (!companionByEmail) {
      return res.status(404).json({message: "Компаньон не найден"})
     }

     if (companionByEmail.id === user.id) {
      return res.status(400).json({message: "Вы не можете добавить себя в компаньоны"})
     }

     const companionInRoad = await CompanionService.getByRoadIdAndUserId(Number(roadId),Number(companionByEmail.id))
     if (companionInRoad) {
      return res.status(400).json({message: "Компаньон уже добавлен"})
     }



     const companion = await CompanionService.addCompanion(Number(roadId),Number(companionByEmail.id))
     res.status(201).json(formatResponse(201,"Компаньон добавлен",companion))
    } catch (error) {
      res.status(400).json(formatResponse(400,error.message))
          }
  }

  // Удалить компаньона
  static async removeCompanion(req, res) {
    const { roadId, userId } = req.params; // userId — это тот, кого удаляют
    const { user } = res.locals; // текущий пользователь
  
    try {
      const road = await RoadService.getById(Number(roadId));
      if (!road) {
        return res.status(404).json(formatResponse(404, "Маршрут не найден"));
      }
  
      const isOwner = road.userId === user.id; // Проверяем, владелец ли текущий пользователь
      const isCompanion = road.companions.some((c) => c.id === user.id); // Проверяем, компаньон ли текущий пользователь
      //const isTargetCompanion = road.companions.some((c) => c.userId === Number(userId)); // Проверяем, есть ли удаляемый в списке
  console.log('isCompanion====>',isCompanion, road.companions[0].id, user);
  
      // if (!isCompanion) {
      //   return res.status(400).json(formatResponse(400, "Пользователь не является компаньоном"));
      // }
   
      // Владелец может удалить любого компаньона
      if (isOwner) {
        await CompanionService.removeCompanion(Number(roadId), Number(userId));
        return res.status(200).json(formatResponse(200, "Компаньон удален владельцем маршрута"));
      }
  
      // Компаньон может удалить только себя
      if (isCompanion) {
        await CompanionService.removeCompanion(Number(roadId), user.id);
        return res.status(200).json(formatResponse(200, "Вы покинули маршрут"));
      }
  
      // Если не владелец и не удаляет сам себя — доступ запрещен
      return res.status(403).json(formatResponse(403, "У вас нет прав на удаление компаньона"));
      
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }
  

  // Получить всех компаньонов для маршрута
  static async getCompanions(req, res){
    const {roadId} = req.params
    try {
      const companions = await CompanionService.getByRoadId(Number(roadId))
      res.status(200).json(formatResponse(200,"Компаньоны получены",companions))
    } catch (error) {
      res.status(500).json(formatResponse(500,error.message))
    }
  }
}

module.exports = CompanionController