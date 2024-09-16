export class DistanceService {
    /**
 * Calcula a distância entre dois pontos geográficos usando a fórmula de Haversine.
 *
 * @param {number} lat1 - Latitude do ponto 1.
 * @param {number} lon1 - Longitude do ponto 1.
 * @param {number} lat2 - Latitude do ponto 2.
 * @param {number} lon2 - Longitude do ponto 2.
 * @returns {number} - A distância entre os dois pontos em quilômetros.
 */
    public calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Raio da Terra em km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Converte graus em radianos.
     *
     * @param {number} deg - O valor em graus.
     * @returns {number} - O valor em radianos.
     */
    public deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    /**
     * Retorna a latitude e longitude com base no CEP.
     * Aqui você pode implementar a lógica de buscar a lat/lon do CEP, 
     * seja com uma API externa ou mapeamento local.
     *
     * @param {string} cep - O código postal do evento.
     * @returns {Object} - Um objeto contendo a latitude e longitude.
     */
    public getLatLonFromCep(cep: string): { lat: number, lon: number } | null {
        // Lógica para obter a latitude/longitude com base no CEP.
        // Isso pode usar uma API externa, como o ViaCEP ou uma base de dados local.
        return { lat: -10.0, lon: -55.0 }; // Exemplo estático
    }
}