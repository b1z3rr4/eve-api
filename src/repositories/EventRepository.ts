import { Event } from '../models/Event';
import { Tag } from '../models/Tag';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, '../database.json');

interface Database {
    events: Event[];
    eventsTags: Tag[];
}

/**
 * Repository class for handling operations related to events and tags.
 * It interacts with a JSON file to load and save event data.
 */
export default class EventRepository {
    /**
     * Loads the database from the JSON file.
     *
     * @returns {Database} - The database object containing events and event tags.
     * @private
     */
    private loadDatabase(): Database {
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data) as Database;
    }

    /**
     * Saves the database to the JSON file.
     *
     * @param {Database} database - The database object to be saved.
     * @private
     */
    private saveDatabase(database: Database): void {
        fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
    }

    /**
     * Retrieves all events from the database.
     *
     * @returns {Event[]} - An array of all events in the database.
     */
    public getEvents(): Event[] {
        const db = this.loadDatabase();
        return db.events;
    }

    /**
     * Retrieves a specific event by its ID.
     *
     * @param {number} id - The ID of the event to retrieve.
     * @returns {Event | undefined} - The event object if found, or undefined if not found.
     */
    public getEventById(id: number): Event | undefined {
        const db = this.loadDatabase();
        return db.events.find(event => event.id === id);
    }

    /**
     * Retrieves all tags associated with a specific event ID.
     *
     * @param {number} eventId - The ID of the event for which to retrieve tags.
     * @returns {Tag[]} - An array of tags associated with the given event ID.
     */
    public getTagsByEventId(eventId: number): Tag[] {
        const db = this.loadDatabase();
        return db.eventsTags.filter(tag => tag.eventId === eventId);
    }
}
