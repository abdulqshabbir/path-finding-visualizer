export interface Node {
    row: number;
    column: number;
    isStart: boolean;
    isEnd: boolean;
    visited: boolean;
    isInShortestPath: boolean;
    hover: boolean;
    distanceFromStart: number;
    previous: Node | null;
    isWall: boolean;
    weight: number;
}

export class Node {
    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
        this.isStart = false;
        this.isEnd = false;
        this.visited = false;
        this.isInShortestPath = false;
        this.hover = false;
        this.distanceFromStart = Infinity;
        this.previous = null;
        this.isWall = false;
        this.weight = 1
    }
}

export type NodeTuple = [number, number]
