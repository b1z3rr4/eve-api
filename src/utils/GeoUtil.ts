interface LatLong {
    lat: number;
    long: number;
}

// Mapeamento simplificado de CEP para coordenadas (latitude e longitude)
const cepToLatLong: Record<string, LatLong> = {
    '01310-000': { lat: -23.564, long: -46.652 },
    '01001-000': { lat: -23.550, long: -46.633 },
    // Adicione outros mapeamentos conforme necessário
};

// Função que retorna as coordenadas para um dado CEP
export function getLatLongFromCep(cep: string): LatLong {
    const coordinates = cepToLatLong[cep];
    if (!coordinates) {
        throw new Error(`Coordenadas para o CEP ${cep} não foram encontradas.`);
    }
    return coordinates;
}
