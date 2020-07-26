import { Node } from "./node";

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
    isNeighbourVisited(neighbour: Node): boolean {
        let isVisited: boolean = this.grid[neighbour.row][neighbour.column].visited;
        if (isVisited) {
            return true;
        } else {
            return false;
        }
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

    findLowestFCostNode(frontier: Node[]): Node {
        let minFCost = Infinity
        let bestNode = frontier[0]

        frontier.forEach(node => {
            if (node.fCost < minFCost) {
                minFCost = node.fCost
                bestNode = node
            }
        })
        return bestNode
    }
    removeCurrentFromFrontier(frontier: Node[], current: Node): Node[] {
        function foundCurrent(node: Node) {
            if (node.row === current.row && node.column === current.column) {
                return true
            } else {
                return false
            }
        }
        for (let i = 0; i < frontier.length; i++) {
            if (foundCurrent(frontier[i])) {
                frontier.splice(i, 1)
            }
        }
        return frontier
    }
    aStarSearch(): [Node[], Node[][][]] {
        let frontier: Node[] = [] // set of all open nodes to be explored
        let current: Node // current node being examined
        let neighbours: Node[] // neighbouring nodes of current

        // initialize scores for start node
        this.startNode.gCost = 0
        this.startNode.hCost = this.hScore(this.startNode)
        this.startNode.fCost = 0
        frontier.push(this.startNode)

        /*
        
        WHILE FRONTIER not empty
                CURRENT = node in FRONTIER with lowest f_cost
                remove CURRENT from FRONTIER
                mark CURRENT as VISITED

                IF CURRENT === endNode
                    break

                ELSE
                    FOR each NEIGHBOUR of CURRENT:
                        tentative_gScore = gScore(CURRENT, NEIGHBOUR)
                        IF (tentative_gScore < NEIGHBOUR.gScore)
                            // path to CURRENT is cheaper so record it and update gCost
                            mark CURRENT as parent of NEIGHBOUR
                            NEIGHBOUR.gScore is tentative_gScore
                            NEIGHBOUR.fScore = fScore(CURRENT, NEIGHBOUR)

                            // if NEIGHBOUR is not already in FRONTIER add NEIGHBOUR
                            IF (NEIGHBOUR not in FRONTIER & not in VISITED)
                                add NEIGHBOUR to FRONTIER

            
            path = reconstructPath()

            return [path, frames]
        */

        while (frontier.length !== 0) {
            current = this.findLowestFCostNode(frontier)
            this.removeCurrentFromFrontier(frontier, current)
            this.markNodeAsVisited(current.row, current.column)
            this.gridFrames.push(this.grid.slice())

            if (current.isEnd) {
                break;
            } else {
                neighbours = this.findNeighbours(current.row, current.column)

                for (let i = 0; i < neighbours.length; i++) {
                    // if neighbour not in frontier, add neighbour
                    if (!this.frontierContains(neighbours[i], frontier) && !neighbours[i].visited) {
                        frontier.push(neighbours[i])
                    }
                    if (!neighbours[i].visited) {
                        let tentativeGCost = this.gScore(current, neighbours[i])
                        if (tentativeGCost < neighbours[i].gCost) {
                            // path to current is cheaper so record it
                            this.markParent(neighbours[i], current)

                            // update g-h-f score of neighbour in frontier
                            // note this returns another array (no mutation)
                            frontier = this.updateCostsInFrontier(frontier, neighbours[i], tentativeGCost)
                        }
                    }
                }
            }

        }
        let path: Node[] = this.reconstructPath()
        return [path, this.gridFrames]
    }
}