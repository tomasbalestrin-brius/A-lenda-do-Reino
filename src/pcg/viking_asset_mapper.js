/**
 * viking_asset_mapper.js
 * 
 * Mapeia os TileIDs genéricos (0, 1, 2) da matriz do PCG para índices
 * de tileset reais, dependendo do bioma escolhido.
 */

export function mapTileset(theme) {
    // Retorna um mapa de: { GenericID: RenderID }
    // 0 = Ar/Fundo
    // 1 = Parede/Chão
    // 2 = Porta
    // 3 = Switch
    // 4 = Pressure Plate
    // 5 = Saída (Exit)

    switch (theme) {
        case "ice":
            return {
                0: 0,
                1: 11, // Índice visual de gelo
                2: 21,
                3: 31,
                4: 41,
                5: 5
            };
        case "fire":
            return {
                0: 0,
                1: 12, // Índice visual de fogo
                2: 22,
                3: 32,
                4: 42,
                5: 5
            };
        case "forest":
            return {
                0: 0,
                1: 13, // Índice visual de floresta
                2: 23,
                3: 33,
                4: 43,
                5: 5
            };
        default: // dungeon
            return {
                0: 0,
                1: 1, // Padrão
                2: 2,
                3: 3,
                4: 4,
                5: 5
            };
    }
}
