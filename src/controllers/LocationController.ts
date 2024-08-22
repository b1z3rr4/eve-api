import { Request, Response } from 'express';
import LocationService from '../services/LocationService';

class LocationController {
    /**
     * Retrieves a list of cities based on a location label.
     *
     * @param {Request} req - The incoming request object containing the label in query parameters.
     * @param {Response} res - The response object to be sent back to the client.
     */
    public async search(req: Request, res: Response): Promise<void> {
        const { label } = req.query;

        if (!label) {
            res.status(400).json({ error: 'Label is required.' });
            return;
        }

        try {
            const cities = await LocationService.searchLocation(label as string);
            res.json(cities);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new LocationController();
