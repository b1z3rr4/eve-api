import EventRepository from '../repositories/EventRepository';
import { Event } from '../models/Event';
import { Tag } from '../models/Tag';
import { calculateDistance } from '../utils/DistanceUtil';
import { DistanceService } from './DistanceService';

/**
 * Service class responsible for handling business logic related to events and tags.
 */
export default class EventService {
    private eventRepository = new EventRepository();
    private distanceService = new DistanceService();

    /**
     * Retrieves a list of events filtered by various criteria.
     *
     * @param {Object} filters - The filters to apply when retrieving events.
     * @param {number} [filters.lat] - The latitude for proximity filtering.
     * @param {number} [filters.lon] - The longitude for proximity filtering.
     * @param {number} [filters.maxDistance] - The maximum distance (in kilometers) from the provided postal code.
     * @param {string} [filters.tipo] - The type of event to filter by (e.g., 'presencial', 'online').
     * @param {string} [filters.dia] - The specific day to filter events by (format 'YYYY-MM-DD').
     * @param {string} [filters.hora] - The specific hour to filter events by (format 'HH:MM').
     * @param {string} [filters.search] - A keyword to filter events by, searching within the event name and description.
     * @param {string} [filters.classificacao] - The classification for sorting ('distancia', 'relevancia', 'recentes').
     * @returns {Event[]} - An array of events that match the applied filters.
     */
    public async getEvents(filters: any): Promise<Event[]> {
        let events = this.eventRepository.getEvents();

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
            events = events.filter(event => {
                const tags = this.getTagsByEventId(event.id);

                const searchEvent = event.nome.toLowerCase().includes(search) ||
                    event.descricao.toLowerCase().includes(search);

                if (tags?.length) {
                    const hasTags = tags.some((item) => item.nome.toLowerCase().includes(filters.search));
                    return searchEvent || hasTags;
                }

                return searchEvent;
            });
        }

        // Filtro de proximidade por latitude e longitude
        if (filters.maxDistance && filters.lat && filters.lon) {
            const maxDistance = filters.maxDistance || 100; // Define o raio padrão de 100km

            events = events.filter(event => {
                const distance = this.distanceService.calculateDistance(
                    filters.lat, filters.lon,
                    event.latitude || filters.lat, event.longitude || filters.lon
                );

                return distance <= maxDistance;
            });
        }

        // Ordenação dos eventos
        if (filters.classificacao) {
            switch (filters.classificacao) {
                case 'distancia':
                    if (filters.lat && filters.lon) {
                        events.sort((a, b) => {
                            const distanceA = this.distanceService.calculateDistance(
                                filters.lat, filters.lon,
                                a.latitude || filters.lat, a.longitude || filters.lon
                            );
                            const distanceB = this.distanceService.calculateDistance(
                                filters.lat, filters.lon,
                                b.latitude || filters.lat, b.longitude || filters.lon
                            );
                            return distanceA - distanceB;
                        });
                    }
                    break;

                case 'relevancia':
                    events.sort((a, b) => {
                        // Assumindo que 'muitas visitas recentes' é um booleano ou um valor numérico
                        return (b.muitasVisitasRecentes ? 1 : 0) - (a.muitasVisitasRecentes ? 1 : 0);
                    });

                    break;

                case 'recentes':
                    events.sort((a, b) => {
                        // Ordena eventos pela data mais recente
                        const dateA = new Date(a.dia).getTime();
                        const dateB = new Date(b.dia).getTime();
                        return dateB - dateA;
                    });
                    break;

                default:
                    throw new Error('Classificação inválida');
            }
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
