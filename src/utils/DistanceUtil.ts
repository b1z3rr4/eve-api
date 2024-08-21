import { getLatLongFromCep } from './GeoUtil';

/**
 * Calculates the distance between two geographical points identified by their CEPs (postal codes).
 * Uses the Haversine formula to calculate the great-circle distance between two points on a sphere given their longitudes and latitudes.
 *
 * @param {string} cep1 - The CEP (postal code) of the first location.
 * @param {string} cep2 - The CEP (postal code) of the second location.
 * @returns {number} - The distance between the two locations in kilometers.
 *
 * @throws {Error} - Throws an error if the CEP does not have corresponding coordinates.
 */
export function calculateDistance(cep1: string, cep2: string): number {
  const { lat: lat1, long: long1 } = getLatLongFromCep(cep1);
  const { lat: lat2, long: long2 } = getLatLongFromCep(cep2);

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLong = toRadians(long2 - long1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
}

