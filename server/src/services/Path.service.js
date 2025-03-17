const { Path, Road } = require('../db/models');

class PathService {
    static async getAll() {
        return await Path.findAll({
            include: [{ model: Road }],
        });
    }

    static async getById(id) {
        return await Path.findOne({
            where: { id }
        });
    }

    static async create(data) {
        const newPath = await Path.create(data);
        return await this.getById(newPath.id);
    }

    static async update(id, data) {
        const path = await this.getById(id);
        if (path) {
            path.pathName = data.pathName;
            await path.save();
        }
        return path;
    }

    static async delete(id) {
        const path = await this.getById(id);
        if (path) {
            await path.destroy();
        }
        return path;
    }
}

module.exports = PathService;