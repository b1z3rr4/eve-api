import EventRepository from '../repositories/EventRepository';
import { Event } from '../models/Event';
import { Tag } from '../models/Tag';
import { calculateDistance } from '../utils/DistanceUtil';

/**
 * Service class responsible for handling business logic related to events and tags.
 */
export default class EventService {
    private eventRepository = new EventRepository();

    /**
     * Retrieves a list of events filtered by various criteria.
     *
     * @param {Object} filters - The filters to apply when retrieving events.
     * @param {string} [filters.cep] - The postal code for proximity filtering.
     * @param {number} [filters.maxDistance] - The maximum distance (in kilometers) from the provided postal code.
     * @param {string} [filters.tipo] - The type of event to filter by (e.g., 'presencial', 'online').
     * @param {string} [filters.dia] - The specific day to filter events by (format 'YYYY-MM-DD').
     * @param {string} [filters.hora] - The specific hour to filter events by (format 'HH:MM').
     * @param {string} [filters.search] - A keyword to filter events by, searching within the event name and description.
     * @returns {Event[]} - An array of events that match the applied filters.
     */
    public async getEvents(filters: any): Promise<Event[]> {
        let events = this.eventRepository.getEvents();

        // Filtros por proximidade (CEP)
        if (filters.cep) {
            const filteredEvents = [];

            for (const event of events) {
                const distance = await calculateDistance(event.cep, filters.cep);
                if (distance <= filters.maxDistance) {
                    filteredEvents.push(event);
                }
            }

            events = filteredEvents;
        }

        // Filtros por tipo
        if (filters.tipo) {
            events = events.filter(event => event.tipo === filters.tipo);
        }

        // Filtros por data e hora
        if (filters.dia) {
            events = events.filter(event => event.dia === filters.dia);
        }
        if (filters.hora) {
            events = events.filter(event => event.hora === filters.hora);
        }

        // Filtros por palavra-chave (nome, descrição)
        if (filters.search) {
            const search = filters.search.toLowerCase();
            events = events.filter(event =>
                event.nome.toLowerCase().includes(search) ||
                event.descricao.toLowerCase().includes(search)
            );
        }

        return events;
    }

    /**
     * Retrieves a specific event by its ID.
     *
     * @param {number} id - The ID of the event to retrieve.
     * @returns {Event | undefined} - The event object if found, or undefined if not found.
     */
    public getEventById(id: number): Event | undefined {
        return this.eventRepository.getEventById(id);
    }

    /**
     * Retrieves all tags associated with a specific event ID.
     *
     * @param {number} eventId - The ID of the event for which to retrieve tags.
     * @returns {Tag[]} - An array of tags associated with the given event ID.
     */
    public getTagsByEventId(eventId: number): Tag[] {
        return this.eventRepository.getTagsByEventId(eventId);
    }
}
