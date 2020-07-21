import { Node } from './node'
import { Stack } from './stack'
export interface DFSgraph {
    grid: Node[][];
    gridFrames: Node[][][];
    startNode: Node;
    endNode: Node;
    numRows: number;
    numColumns: number;
}

export class DFSgraph {
    constructor(grid: Node[][], startNode: Node, endNode: Node, numRows: number, numColumns: number) {
        this.grid = grid;
        this.gridFrames = [];
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
    markVisited(visitedRow: number, visitedColumn: number) {
        this.grid = this.grid.map((row) =>
            row.map((node) => {
                if (node.row === visitedRow && node.column === visitedColumn) {
                    return {
                        ...node,
                        visited: true
                    };
                } else {
                    return node;
                }
            })
        );
    }
    markParent(child: Node, parent: Node) {
        child = { ...child, previous: parent }
        this.grid[child.row][child.column] = child
    }
    reconstructPath(): Node[] {
        let path: Node[] = []
        // NOTE: we must use the grid here since the 'endNode' prev property does not get updated
        let current: Node = this.grid[this.endNode.row][this.endNode.column]
        path.unshift(current)
        while (current.previous !== null) {
            current = this.grid[current.previous.row][current.previous.column]
            path.unshift(current)
        }
        return path
    }
    depthFirstSearch(): [Node[], Node[][][]] {
        let animationFrame: Node[][]
        let frontier = new Stack()
        let current: Node | null

        // push start node onto stack
        frontier.push(this.startNode)

        while (frontier.size > 0) {
            current = frontier.pop()
            // the stack returns a non-null node
            if (current !== null) {
                // if end node reached
                if (current.isEnd) {
                    // marks end node as visited in grid 
                    this.markVisited(current.row, current.column)
                    // create animation frame
                    animationFrame = this.grid.slice()
                    this.gridFrames.push(animationFrame)
                    // break out of loop and reconstruct path to get to end node
                    break;
                }
                // Else, keep pushing neighbours onto stack 
                let neighbours = this.findNeighbours(current.row, current.column)

                for (let i = 0; i < neighbours.length; i++) {
                    if (!frontier.contains(neighbours[i]) && !this.isNeighbourVisited(neighbours[i])) {
                        // if neighbour NOT in frontier and is UNVISITED, push neighbour onto stack
                        frontier.push(neighbours[i])
                        // mark neighbour's parent with previous pointer to current to help reconstruct path
                        this.markParent(neighbours[i], current)
                    }
                }

                // mark current node as visited in grid
                this.markVisited(current.row, current.column)
                animationFrame = this.grid.slice()
                this.gridFrames.push(animationFrame)
            }
        }
        let path: Node[] = this.reconstructPath()
        return [path, this.gridFrames]
    }
}