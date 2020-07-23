import { Node } from "./node";

export interface dijkstra_graph {
  startNode: Node;
  endNode: Node;
  grid: Node[][];
  numRows: number;
  numColumns: number;
  gridFrames: Node[][][];
}

export class dijkstra_graph {
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
  findUnvisitedNodes(): Node[] {
    let unvisitedNodes: Node[] = [];

    this.grid.forEach((row) => {
      row.forEach((node) => {
        if (!node.visited) {
          unvisitedNodes.push(node);
        }
      });
    });
    return unvisitedNodes;
  }
  findClosestUnvisitedNode(unvisitedNodes: Node[]): Node {
    let closestNode: Node = this.startNode;
    let minDistance: number = 1000000;
    // FOR each unvisited node, if distance from start is less than minDistance than update minDistance and closestNode
    unvisitedNodes.forEach((node) => {
      let nodeDistance = node.distanceFromStart;
      if (nodeDistance < minDistance) {
        minDistance = nodeDistance;
        closestNode = node;
      }
    });

    return closestNode;
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
  dijsktra(): [Node[], Node[][][]] {
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

export default dijkstra_graph;
