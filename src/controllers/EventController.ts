import { Request, Response } from 'express';
import EventService from '../services/EventService';
import { generateToken } from '../utils/TokenUtil';

const eventService = new EventService();

/**
 * Controller class responsible for handling event-related requests and authentication.
 */
class EventController {
    /**
     * Authenticates the request by validating the API key provided in the request headers.
     * If the API key is valid, it generates and returns a token for further authentication.
     * If the API key is invalid, it responds with a 401 Unauthorized status.
     *
     * @param {Request} req - The incoming request object.
     * @param {Response} res - The response object to be sent back to the client.
     */
    public authenticate(req: Request, res: Response): void {
        const apiKey = req.headers['x-api-key'];
        if (apiKey === process.env.AUTH_TOKEN) {
            const token = generateToken();
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid API key' });
        }
    }

    /**
     * Retrieves and returns a list of events from the database, applying filters provided in the query parameters.
     *
     * @param {Request} req - The incoming request object, containing query parameters for filtering.
     * @param {Response} res - The response object to be sent back to the client with the list of events.
     */
    public getEvents(req: Request, res: Response): void {
        const filters = req.query;
        const events = eventService.getEvents(filters);
        res.json(events);
    }

    /**
     * Retrieves and returns details of a specific event by its ID, including associated tags.
     * If the event is not found, it responds with a 404 Not Found status.
     *
     * @param {Request} req - The incoming request object, containing the event ID as a URL parameter.
     * @param {Response} res - The response object to be sent back to the client with the event details.
     */
    public getEventById(req: Request, res: Response): void {
        const { id } = req.params;
        const event = eventService.getEventById(parseInt(id, 10));
        if (event) {
            const tags = eventService.getTagsByEventId(event.id);
            res.json({ ...event, tags });
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    }
}

export default new EventController();
