export const ABILITIES = {
    ERIK_JUMP: "ERIK_JUMP",
    BALEOG_ATTACK: "BALEOG_ATTACK",
    BALEOG_SHOOT: "BALEOG_SHOOT",
    OLAF_BLOCK: "OLAF_BLOCK"
};

export const CHUNK_SIZE = 12;

export const PUZZLE_CHUNKS = [
    {
        id: "chunk_start",
        type: "START",
        provides: ["start_room"],
        requires: [],
        grid: [
            "############",
            "#..........#",
            "#..........#",
            "#..........#",
            "#..........#",
            "#..........#",
            "#..........#",
            "#..........#",
            "#.S........#",
            "############",
            "############",
            "############"
        ]
    },
    {
        id: "chunk_key_blue",
        type: "PUZZLE",
        provides: ["key_blue_coletado"],
        requires: ["start_room", ABILITIES.ERIK_JUMP],
        grid: [
            "############",
            "#..........#",
            "#..........#",
            "#....K.....#",
            "#...###....#",
            "#..........#",
            "#..........#",
            "#..........#",
            "#..........#",
            "############",
            "############",
            "############"
        ]
    },
    {
        id: "chunk_exit",
        type: "EXIT",
        provides: ["win"],
        requires: ["start_room", "key_blue_coletado"],
        grid: [
            "############",
            "#..........#",
            "#..........#",
            "#..........#",
            "#..........#",
            "#..........#",
            "#..........#",
            "#..........#",
            "#...D..E...#",
            "############",
            "############",
            "############"
        ]
    }
];
