const CompanionService = require("../services/Companion.service")
const RoadService = require("../services/Road.service")
const formatResponse = require("../utils/formatResponse")


class CompanionController {
  // Добавить компаньона
  static async addCompanion(req,res){
    const {roadId} = req.params
    const {userId} = req.body
    const {user} = res.locals
    
    try {
     // проверка прав доступа
     const road = await RoadService.getById(Number(roadId))
     if (road.userId !== user.id) {
      return res.status(403).json({message: "У вас нет прав на добавление компаньонов"})
     }

     const companion = await CompanionService.addCompanion(Number(roadId),Number(userId))
     res.status(201).json(formatResponse(201,"Компаньон добавлен",companion))
    } catch (error) {
      res.status(400).json(formatResponse(400,error.message))
          }
  }

  // Удалить компаньона
  static async removeCompanion(req, res){
    const {roadId, userId} = req.params
    const {user}= res.locals

    try{
      const road = await RoadService.getById(Number(roadId))
      if (road.userId !== user.id) {
        return res.status(403).json({message: "У вас нет прав на удаление компаньонов"})}
        
        await CompanionService.removeCompanion(Number(roadId),Number(userId))
        res.status(200).json(formatResponse(200,"Компаньон удален"))
      
      }catch(error){
        res.status(400).json(formatResponse(400,error.message))
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