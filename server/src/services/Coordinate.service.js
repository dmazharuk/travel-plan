const { Coordinate, Path } = require("../db/models");

class CoordinateService {
  static async getAll() {
    return await Coordinate.findAll({
      include: [{ model: Path }],
    });
  }

  static async getById(id) {
    return await Coordinate.findOne({
      where: { id },
      include: [{ model: Path }],
    });
  }

  static async create(data) {
    const newCoordinate = await Coordinate.create(data);
    return await this.getById(newCoordinate.id);
  }

  static async update(id, data) {
    const coordinate = await this.getById(id);
    if (coordinate) {
      coordinate.latitude = data.latitude;
      coordinate.longitude = data.longitude;
      coordinate.coordinateTitle = data.coordinateTitle;
      coordinate.coordinateBody = data.coordinateBody;
      coordinate.coordinateNumber = data.coordinateNumber;
      await coordinate.save();
    }
    return coordinate;
  }

  static async delete(id) {
    const coordinate = await this.getById(id);
    if (coordinate) {
      await coordinate.destroy();
    }
    return coordinate;
  }
}

module.exports = CoordinateService;
