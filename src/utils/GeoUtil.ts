import axios from 'axios';

interface LatLong {
    lat: number;
    long: number;
}

// Função que busca as coordenadas (latitude e longitude) com base no CEP usando uma API externa
export async function getLatLongFromCep(cep: string): Promise<LatLong> {
    try {
        // Passo 1: Validar e formatar o CEP (remover traços e espaços)
        const formattedCep = cep.replace(/\D/g, '');

        // Passo 2: Buscar as informações do CEP na API do ViaCEP
        const viacepResponse = await axios.get(`https://viacep.com.br/ws/${formattedCep}/json/`);
        const { localidade, uf } = viacepResponse.data;

        if (!localidade || !uf) {
            throw new Error('Cidade ou estado não encontrados para este CEP.');
        }

        // Passo 3: Usar outra API para converter a cidade e estado em coordenadas (latitude e longitude)
        const geocodeResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(localidade)},${encodeURIComponent(uf)}&format=json&limit=1`
        );

        if (geocodeResponse.data.length === 0) {
            throw new Error('Coordenadas não encontradas para esta localização.');
        }

        const { lat, lon } = geocodeResponse.data[0];
        return { lat: parseFloat(lat), long: parseFloat(lon) };
    } catch (error: any) {
        throw new Error(`Erro ao buscar coordenadas para o CEP ${cep}: ${error.message}`);
    }
}
