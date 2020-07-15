export interface Node {
    row: number;
    column: number;
    isStart: boolean;
    isEnd: boolean;
    visited: boolean;
    neighbourVisited: boolean;
    hover: boolean;
    distanceFromStart: number;
    previous: Node | null
}

export class Node {
    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
        this.isStart = false;
        this.isEnd = false;
        this.visited = false;
        this.neighbourVisited = false;
        this.hover = false;
        this.distanceFromStart = Infinity;
        this.previous = null;
    }
}

export type NodeTuple = [number, number]
