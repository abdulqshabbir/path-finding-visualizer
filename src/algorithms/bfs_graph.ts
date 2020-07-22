import { Node } from './node'
import { Queue } from './queue'

export interface BFSgraph {
    grid: Node[][];
    gridFrames: Node[][][];
    startNode: Node;
    endNode: Node;
    numRows: number;
    numColumns: number;
}

export class BFSgraph {
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
    isWall(row: number, col: number) {
        if (this.grid[row][col].isWall) {
            return true
        } else {
            return false
        }
    }
    findNeighbours(row: number, column: number) {
        let neighbours: Node[] = [];
        if (this.positionIsValid(row + 1) && this.positionIsValid(column) && !this.isWall(row + 1, column)) {
            neighbours.push(this.grid[row + 1][column]);
        }
        if (this.positionIsValid(row) && this.positionIsValid(column + 1) && !this.isWall(row, column + 1)) {
            neighbours.push(this.grid[row][column + 1]);
        }
        if (this.positionIsValid(row - 1) && this.positionIsValid(column) && !this.isWall(row - 1, column)) {
            neighbours.push(this.grid[row - 1][column]);
        }
        if (this.positionIsValid(row) && this.positionIsValid(column - 1) && !this.isWall(row, column - 1)) {
            neighbours.push(this.grid[row][column - 1]);
        }
        return neighbours;
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
    markAsShortestPath(visitedRow: number, visitedColumn: number) {
        this.grid = this.grid.map((row) =>
            row.map((node) => {
                if (node.row === visitedRow && node.column === visitedColumn) {
                    return {
                        ...node,
                        isInShortestPath: true
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
    breadthFirstSeach(): [Node[], Node[][][]] {
        let animationFrame: Node[][]
        let frontier = new Queue()
        let pathExists: boolean = false

        frontier.enqueue(this.startNode)
        while (frontier.size > 0) {
            let current = frontier.dequeue()
            // the queue returns a non-null node
            if (current !== null) {
                // if end node reached
                if (current.isEnd) {
                    pathExists = true
                    // marks end node as visited in grid 
                    this.markVisited(current.row, current.column)
                    // create animation frame
                    animationFrame = this.grid.slice()
                    this.gridFrames.push(animationFrame)
                    // break out of loop and reconstruct path to get to end node
                    break;
                }
                // Else, keep pushing neighbours onto queue 
                let neighbours = this.findNeighbours(current.row, current.column)

                for (let i = 0; i < neighbours.length; i++) {
                    if (!frontier.contains(neighbours[i]) && !this.isNeighbourVisited(neighbours[i])) {
                        // if neighbour NOT in frontier and is UNVISITED, enqueue neighbour
                        frontier.enqueue(neighbours[i])
                        // mark neighbour's parent with previous pointer to current to help reconstruct path
                        this.markParent(neighbours[i], current)
                    }
                }
                // mark current node as visited in grid
                this.markVisited(current.row, current.column)
                // animation frames created to visualize BFS
                animationFrame = this.grid.slice()
                this.gridFrames.push(animationFrame)
            }
        }
        console.log('pathExists value: ', pathExists)
        let path: Node[] = this.reconstructPath()
        return [path, this.gridFrames]
    }
}