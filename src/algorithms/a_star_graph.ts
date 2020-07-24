import { Node } from "./node";

export interface a_star_graph {
    startNode: Node;
    endNode: Node;
    grid: Node[][];
    numRows: number;
    numColumns: number;
    gridFrames: Node[][][];
}

export class a_star_graph {
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
        debugger;
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
    aStar(): [Node[], Node[][][]] {
        /*
            FRONTIER  // set of nodes to be considered (list)
            VISITED  // set of nodes already considered
            CURRENT // current node being explored

            add start node to FRONTIER
            set startNode.fcost = 0

            WHILE FRONTIER not empty
                CURRENT = node in FRONTIER with lowest f_cost
                remove CURRENT from FRONTIER
                add CURRENT to VISISTED

                IF CURRENT === endNode
                    mark


        
            
        */

        /*
            function: findLowestFCostNode(frontier) -> bestNode
                MINFCOST // intialize to Infinity
                BESTNODE // Ideal node to explore

                FOR each node in FRONTIER:
                    IF node.fcost < minfcost
                      MINFCOST is node.fcost
                      BESTNODE is node
            
                RETURN bestNode
        */

        /*
            function: findFCost(node: Node) -> fCost: number
                return findHcost(node) + findGCost(node)
        
        */


        /*
            function: findHCost(node: Node) -> hCost: number
            // hCost: straight-line distance from endNode

                DELTAX // horizontal distance away from endNode
                DELTAY // vertical distance away from endNode

                DELTAX = | endNode.column - node.column |
                DELTAY = | endNOde.row - node.row |

                RETURN Math.sqrt(DELX^2 + DELY^2)
        */

        /*
            function: findGCost(node: Node) -> gCost: number
            // gCost: straight-line distance from starting node
            
                DELTAX // horizontal distance away from endNode
                DELTAY // vertical distance away from endNode

                DELTAX = | endNode.column - node.column |
                DELTAY = | endNOde.row - node.row |
        
        */

        /* */

        let frontier: Node[] = [] // frontier is a list of nodes to be explored and will be treated as a queue

        this.startNode.distanceFromStart = 0
        frontier.unshift(this.startNode)

        while (frontier.length !== 0) {
            let current: Node | undefined = frontier.pop()
            if (current !== undefined && current.isEnd) {
                this.markNodeAsVisited(current.row, current.column)
                this.gridFrames.push(this.grid.slice())
                break;
            } else if (current !== undefined) {
                let neighbours: Node[] = this.findNeighbours(current.row, current.column)
                for (let i = 0; i < neighbours.length; i++) {
                    // IF NEIGHBOUR is not visited
                    if (!neighbours[i].visited) {
                        // IF NEIGHBOUR not in frontier
                        if (!frontierContainsNode(frontier, neighbours[i])) {
                            // enqueue NEIGHBOUR  
                            frontier.unshift(neighbours[i])
                        }
                        // calculate weight to NEIGHBOUR from start
                        let newNeighbourDistance: number = current.distanceFromStart + neighbours[i].weight
                        if (newNeighbourDistance < neighbours[i].distanceFromStart) {
                            neighbours[i].distanceFromStart = newNeighbourDistance
                            this.markParent(neighbours[i], current)
                        }
                    }
                }
                // sort FRONTIER by distanceFromStart
                frontier = frontier.sort(sortFrontierByDistances)
                this.markNodeAsVisited(current.row, current.column)
                this.gridFrames.push(this.grid.slice())
                // remove current from FRONTIER
                frontier = frontier.filter(n => {
                    if (n.row === current?.row && n.column === current?.column) {
                        return false
                    } else {
                        return true
                    }
                })
            }

        }
        let path: Node[] = this.reconstructPath()

        return [path, this.gridFrames]
    }
}

function frontierContainsNode(nodes: Node[], targetNode: Node) {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].row === targetNode.row && nodes[i].column === targetNode.column) {
            return true
        }
    }
    return false
}

function sortFrontierByDistances(node1: Node, node2: Node) {
    if (node1.distanceFromStart < node2.distanceFromStart) {
        return 1
    } else if (node1.distanceFromStart > node2.distanceFromStart) {
        return -1
    } else {
        return 0
    }
}

export default a_star_graph;