// Fungsi untuk tautan di panel rincian tugas (I05-10, I05-11)

const GOOGLE_MAPS_SEARCH = "https://www.google.com/maps/search/?api=1&query=";

export function tautanGoogleMaps(latitude: number, longitude: number): string {
    return `${GOOGLE_MAPS_SEARCH}${latitude},${longitude}`;
}

export function tautanHasilPerbaikan(idTiket: string): string {
    return `/tugas/${encodeURIComponent(idTiket)}/hasil`;
}