import axios from 'axios';

const BASE_URL = 'https://servicodados.ibge.gov.br/api/v2';

class LocationService {
    /**
     * Retrieves a list of states based on a search term from the IBGE API.
     *
     * @param {string} searchTerm - The term to search for states.
     * @returns {Promise<any[]>} - A promise that resolves to an array of states.
     */
    private async searchStates(searchTerm: string): Promise<any[]> {
        try {
            const response = await axios.get(`${BASE_URL}/localidades/estados`);
            const states = response.data;

            return states.filter((state: any) =>
                state.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error: any) {
            throw new Error(`Error fetching states: ${error.message}`);
        }
    }

    /**
     * Retrieves a list of cities based on a search term and state name from the IBGE API.
     *
     * @param {string} cityName - The name of the city to search for.
     * @param {string} stateName - The name of the state to narrow the search.
     * @returns {Promise<any[]>} - A promise that resolves to an array of cities.
     */
    private async searchCities(cityName: string, stateName?: string): Promise<any[]> {
        try {
            if (stateName) {
                // Get the state ID
                const states = await this.searchStates(stateName);
                if (states.length === 0) {
                    throw new Error('State not found.');
                }

                const stateId = states[0].id; // Assuming the first match is correct

                // Get cities in the state
                const response = await axios.get(`${BASE_URL}/localidades/estados/${stateId}/municipios`);
                const cities = response.data;

                return cities.filter((city: any) =>
                    city.nome.toLowerCase().includes(cityName.toLowerCase())
                );
            } else {
                // Get all cities
                const response = await axios.get(`${BASE_URL}/localidades/municipios`);
                const cities = response.data;

                return cities.filter((city: any) =>
                    city.nome.toLowerCase().includes(cityName.toLowerCase())
                );
            }
        } catch (error: any) {
            throw new Error(`Error fetching cities: ${error.message}`);
        }
    }

    /**
     * Parses a location label into city and state names.
     *
     * @param {string} label - The label containing city and optionally state names.
     * @returns {Object} - An object containing cityName and stateName.
     */
    private parseLocationLabel(label: string): { cityName: string, stateName?: string } {
        const parts = label.split(/,\s*|\s+/);
        const cityName = parts.shift() || '';
        const stateName = parts.join(' ');

        return { cityName, stateName: stateName || undefined };
    }

    /**
     * Retrieves a list of cities based on a label containing city and optionally state names.
     *
     * @param {string} label - The label containing city and optionally state names.
     * @returns {Promise<any[]>} - A promise that resolves to an array of cities.
     */
    public async searchLocation(label: string): Promise<any[]> {
        const { cityName, stateName } = this.parseLocationLabel(label);
        return this.searchCities(cityName, stateName);
    }
}

export default new LocationService();
