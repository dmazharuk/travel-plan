const CoordinateService = require('../services/Coordinate.service');
const formatResponse = require('../utils/formatResponse');

class CoordinateController {
    static async createCoordinate(req, res) {
        const { latitude, longitude, coordinateTitle, coordinateBody, coordinateNumber } = req.body;
        const { path } = res.locals;

        try {
            const newCoordinate = await CoordinateService.create({
                latitude: latitude,
                longitude: longitude,
                coordinateTitle: coordinateTitle,
                coordinateBody: coordinateBody,
                coordinateNumber: coordinateNumber,
                pathId: path.id
            });

            if (!newCoordinate) {
                return res
                    .status(400)
                    .json(formatResponse(400, `Failed to create new coordinate`));
            }

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
                .json(formatResponse(500, 'Internal server error', null, error.message));
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

    static async updateCoordinate(req, res) {
        const { id } = req.params;
        const { latitude, longitude, coordinateTitle, coordinateBody, coordinateNumber } = req.body;
        const { path } = res.locals;

        try {
            const updatedCoordinate = await CoordinateService.update(id, {
                latitude: latitude,
                longitude: longitude,
                coordinateTitle: coordinateTitle,
                coordinateBody: coordinateBody,
                coordinateNumber: coordinateNumber,
                pathId: path.id
            });

            if (!updatedCoordinate) {
                return res
                    .status(404)
                    .json(formatResponse(404, 'Coordinate not found'));
            }

            res.status(200).json(formatResponse(200, 'Coordinate updated successfully', updatedCoordinate));
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

            res.status(200).json(formatResponse(200, 'Coordinate deleted successfully'));
        } catch ({ message }) {
            res
                .status(500)
                .json(formatResponse(500, 'Internal server error', null, message));
        }
    }
}

module.exports = CoordinateController;