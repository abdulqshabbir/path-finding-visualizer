import { Node } from './node'
import { Stack } from './stack'
export interface BFSgraph {
    grid: Node[][];
    startNode: Node;
    endNode: Node;
    numRows: number;
    numColumns: number;
}

export class BFSgraph {
    constructor(grid: Node[][], startNode: Node, endNode: Node, numRows: number, numColumns: number) {
        this.grid = grid;
        this.startNode = startNode;
        this.endNode = endNode;
        this.numRows = numRows;
        this.numColumns = numColumns;
    }
    positionIsValid(position: number) {
        // position is a row or column value for a particular node
        if (
            position >= 1 &&
            position <= this.numRows &&
            position <= this.numColumns
        ) {
            return true;
        } else {
            return false;
        }
    }
    findNeighbours(row: number, column: number) {
        let neighbours: Node[] = [];
        if (this.positionIsValid(row + 1) && this.positionIsValid(column)) {
            neighbours.push(this.grid[row + 1][column]);
        }
        if (this.positionIsValid(row) && this.positionIsValid(column + 1)) {
            neighbours.push(this.grid[row][column + 1]);
        }
        if (this.positionIsValid(row - 1) && this.positionIsValid(column)) {
            neighbours.push(this.grid[row - 1][column]);
        }
        if (this.positionIsValid(row) && this.positionIsValid(column - 1)) {
            neighbours.push(this.grid[row][column - 1]);
        }
        return neighbours;
    }
    markNodeAsVisited(visitedRow: number, visitedColumn: number) {
        this.grid = this.grid.map((row) =>
            row.map((node) => {
                if (node.row === visitedRow && node.column === visitedColumn) {
                    return {
                        ...node,
                        visited: true,
                    };
                } else {
                    return node;
                }
            })
        );
    }
    isNeighbourVisited(neighbour: Node): boolean {
        let isVisited: boolean = this.grid[neighbour.row][neighbour.column].visited;
        if (isVisited) {
            return true;
        } else {
            return false;
        }
    }
    endNodeUnvisited(unvisitedNodes: Node[]) {
        for (let i = 0; i < unvisitedNodes.length; i++) {
            if (
                unvisitedNodes[i].row === this.endNode.row &&
                unvisitedNodes[i].column === this.endNode.column
            ) {
                return true;
            }
        }
        return false;
    }
    BFS(): [Node[], Node[][][]] {
        let animationFrame: Node[][]
        let animationFrames: Node[][][] = []
        let path: Node[] = []

        let frontier = new Stack()
        frontier.push(this.startNode)

        while (frontier.size !== 0) {
            let current = frontier.pop()
            if (current !== null) {
                if (current.row === this.endNode.row && current.column === this.endNode.column) {
                    this.markNodeAsVisited(current.row, current.column)
                    current = { ...current, visited: true }
                    path.push(current)
                    animationFrame = this.grid.slice()
                    return [path, animationFrames]
                } else {
                    // find neighbours and push them onto the stack
                    let neighbours = this.findNeighbours(current.row, current.column)
                    neighbours.forEach(neighbour => {
                        if (!frontier.contains(neighbour) && !this.isNeighbourVisited(neighbour)) {
                            frontier.push(neighbour)
                        }
                    })

                    // mark current node as visited in grid
                    this.markNodeAsVisited(current.row, current.column)

                    // mark current node as visited in BFS path
                    current = { ...current, visited: true }
                    path.push(current)

                    // animation frames created to visualize BFS
                    animationFrame = this.grid.slice()
                    animationFrames.push(animationFrame)
                }
            }
        }
        return [path, animationFrames]
    }
}