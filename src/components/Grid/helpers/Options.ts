interface AlgorithmOptions {
    key: string;
    text: string;
    value: string;
}
interface SpeedOptions {
    key: string;
    text: string;
    value: string;
}

export const algorithmOptions: AlgorithmOptions[] = [
    {
        key: "Dijkstra",
        text: "Dijkstra",
        value: "Dijkstra",
    },
    {
        key: "DFS",
        text: "DFS",
        value: "DFS",
    },
    {
        key: "BFS",
        text: "BFS",
        value: "BFS",
    },
    {
        key: "Astar",
        text: "Astar",
        value: "Astar",
    },
];


export const speedOptions: SpeedOptions[] = [
    {
        key: "Fast",
        text: "Fast",
        value: "Fast",
    },
    {
        key: "Medium",
        text: "Medium",
        value: "Medium",
    },
    {
        key: "Slow",
        text: "Slow",
        value: "Slow",
    },
];
