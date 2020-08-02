import { Node } from "./node";
import { PriorityQueue } from './priorityQueue'

export interface aStarGraph {
    startNode: Node;
    endNode: Node;
    grid: Node[][];
    numRows: number;
    numColumns: number;
    gridFrames: Node[][][];
}

export class aStarGraph {
    constructor(
        grid: Node[][],
        startNode: Node,
        endNode: Node,
        numRows: number,
        numColumns: number
    ) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.grid = grid;
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.gridFrames = [];
    }
    isWall(row: number, col: number) {
        if (this.grid[row][col].isWall) {
            return true
        } else {
            return false
        }
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
    hScore(node: Node) {
        // Returns the straight-line distance from given node to target node
        // h score is a 'heuristic' or 'best guess' for which paths to explore next
        const deltaX = Math.abs(this.endNode.column - node.column)
        const deltaY = Math.abs(this.endNode.row - node.row)
        return Math.sqrt(deltaX ** 2 + deltaY ** 2)
    }
    gScore(current: Node, neighbour: Node) {
        // Returns a number that represents the currently best known (cheapest) path from start node to current node
        return current.gCost + neighbour.weight
    }
    updateCostsInFrontier(frontier: Node[], neighbour: Node, gCost: number): Node[] {
        let hCost = this.hScore(neighbour)
        let fCost = hCost + gCost
        return frontier.map(node => {
            if (node.row === neighbour.row && node.column === neighbour.column) {
                return {
                    ...node,
                    distanceFromStart: gCost,
                    gCost: gCost,
                    hCost: hCost,
                    fCost: fCost
                }
            } else {
                return node
            }
        })
    }
    frontierContains(node: Node, frontier: Node[]) {
        for (let i = 0; i < frontier.length; i++) {
            if (frontier[i].row === node.row && frontier[i].column === node.column) {
                return true
            }
        }
        return false
    }
    aStarSearch(): [Node[], Node[][][]] {
        let frontier: PriorityQueue = new PriorityQueue() // set of all open nodes to be explored
        let current: Node | null // current node being examined
        let neighbours: Node[] // neighbouring nodes of current

        // initialize scores for start node
        let hCost = this.hScore(this.startNode)
        let gCost = 0
        let fCost = hCost + gCost

        // enqueue operation requires a node (this.startNode) and an fCost (0)
        frontier.enqueue(this.startNode, fCost, gCost, hCost)

        while (frontier.length() !== 0) {
            // peek returns the lowest fCost node in frontier
            current = frontier.peek()
            if (current === null) break;

            // dequeue removes the lowest fCost node from frontier
            frontier.dequeue()

            // mark nodes as visited in this.grid for animating path
            this.markNodeAsVisited(current.row, current.column)
            this.gridFrames.push(this.grid.slice())

            if (current.isEnd) break;

            else {

                neighbours = this.findNeighbours(current.row, current.column)

                for (let i = 0; i < neighbours.length; i++) {

                    // if neighbour not in frontier, add neighbour
                    if (!frontier.contains(neighbours[i]) && !neighbours[i].visited) {

                        // note that these are costs of the 'ith neighbour'
                        let gCost = this.gScore(current, neighbours[i])
                        let hCost = this.hScore(neighbours[i])
                        let fCost = gCost + hCost

                        // update costs of ith neighbour
                        neighbours[i].gCost = gCost
                        neighbours[i].hCost = hCost
                        neighbours[i].fCost = fCost

                        // update frontier
                        frontier.enqueue(neighbours[i], fCost, gCost, hCost)

                        // mark current as the parent of ith neighbour to allow re-tracing of steps
                        this.markParent(neighbours[i], current)
                    }

                    // if neighbour is not yet visited, calculate gScore to neighbour and compare with current gScore
                    if (!neighbours[i].visited) {
                        let tentativeGCost = this.gScore(current, neighbours[i])
                        let hCost = this.hScore(neighbours[i])
                        let fCost = tentativeGCost + hCost

                        if (tentativeGCost < neighbours[i].gCost) {
                            // path to current is cheaper so record it
                            this.markParent(neighbours[i], current)

                            // update f, g, h scores in priority queue
                            frontier.updateCostsInFrontier(neighbours[i], fCost, tentativeGCost, hCost)

                        }
                    }
                }
            }

        }
        let path: Node[] = this.reconstructPath()
        return [path, this.gridFrames]
    }
}
