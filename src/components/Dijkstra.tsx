import { Node, generateGrid } from "./GenerateGrid";

export type NodeTuple = [number, number];

interface DistancesFromStart {
  [node: string]: number;
}

interface PreviousNode {
  [node: string]: string;
}

interface AdjacencyList {
  [node: string]: Array<NodeTuple>;
}

interface graph {
  NUM_OF_ROWS: number;
  NUM_OF_COLUMNS: number;
  startNode: NodeTuple;
  endNode: NodeTuple;
  grid: Node[][];
  adjacencyList: AdjacencyList;
  unvisited: Array<NodeTuple>;
  distancesFromStart: DistancesFromStart;
  previousNode: PreviousNode;
}

class graph {
  constructor(
    rows: number,
    columns: number,
    startNode: NodeTuple,
    endNode: NodeTuple
  ) {
    this.NUM_OF_ROWS = rows;
    this.NUM_OF_COLUMNS = columns;
    this.startNode = startNode;
    this.endNode = endNode;
    this.grid = generateGrid(rows, columns);
    this.adjacencyList = this.transformGridToAdjList();
    this.unvisited = this.initializeUnvisitedList();
    this.distancesFromStart = this.initializeDistancesFromStart();
    this.previousNode = this.initializePreviousNode();
  }
  initializeDistancesFromStart() {
    let distancesFromStart: DistancesFromStart = {};
    for (let node of Object.keys(this.adjacencyList)) {
      distancesFromStart[node] = Infinity;
      distancesFromStart[JSON.stringify(this.startNode)] = 0;
    }
    return distancesFromStart;
  }
  initializePreviousNode() {
    let previousNode: PreviousNode = {};
    for (let node of Object.keys(this.adjacencyList)) {
      previousNode[node] = JSON.stringify(this.startNode);
    }
    return previousNode;
  }
  initializeUnvisitedList() {
    let unvisited: Array<NodeTuple> = [];
    for (let node of Object.keys(this.adjacencyList)) {
      unvisited.push(JSON.parse(node));
    }
    return unvisited;
  }
  transformGridToAdjList() {
    let adjacencyList: AdjacencyList = {};
    this.grid.forEach((row) => {
      row.forEach((node) => {
        // for each node find its neighbours
        let nodeLocation = JSON.stringify([node.row, node.column]);
        let neighbours = this.findNeighbours(node.row, node.column);
        // concat neighbours onto the adjacency list
        adjacencyList[nodeLocation] = [...neighbours];
      });
    });
    return adjacencyList;
  }
  positionIsValid(position: number) {
    // position is a row or column value for a particular node
    if (
      position >= 1 &&
      position <= this.NUM_OF_ROWS &&
      position <= this.NUM_OF_COLUMNS
    ) {
      return true;
    } else {
      return false;
    }
  }
  findNeighbours(row: number, column: number) {
    let neighbours: Array<NodeTuple> = [];
    if (this.positionIsValid(row) && this.positionIsValid(column - 1)) {
      neighbours.push([row, column - 1]);
    }
    if (this.positionIsValid(row - 1) && this.positionIsValid(column)) {
      neighbours.push([row - 1, column]);
    }
    if (this.positionIsValid(row + 1) && this.positionIsValid(column)) {
      neighbours.push([row + 1, column]);
    }
    if (this.positionIsValid(row) && this.positionIsValid(column + 1)) {
      neighbours.push([row, column + 1]);
    }
    return neighbours;
  }
  getClosestUnvisitedNodeFromStart(): string {
    let closestNode: string = JSON.stringify(this.startNode);
    let minDistance: number = 1000000;
    for (let i = 0; i < this.unvisited.length; i++) {
      // for each node in unvisited list
      // check if the distance to that node from the startNode is less than currentDistance
      // if yes, update minDistance and closestNode
      // if not, keep iterating over unvisited array
      let node = JSON.stringify(this.unvisited[i]);
      if (this.distancesFromStart[node] < minDistance) {
        minDistance = this.distancesFromStart[node];
        closestNode = node;
      }
    }
    return closestNode;
  }
  isNeighbourInUnvisited(neighbour: NodeTuple): boolean {
    let neighbourString = JSON.stringify(neighbour);
    let nodeString: string;
    for (let i = 0; i < this.unvisited.length; i++) {
      nodeString = JSON.stringify(this.unvisited[i]);
      if (nodeString === neighbourString) {
        return true;
      }
    }
    return false;
  }
  findShortestPath() {
    // Get closest vertex from the start node (shortest distance away from start)
    // Look up that vertexs' neighbours
    // For each neighbour that has NOT been visited
    // find distance to the neighbour
    // if distance to neighbour < known distance to neighbour from start
    // update distance
    // update previous object
    // remove closest vertex away from unvisited

    while (this.unvisited.length !== 0) {
      let current: string = this.getClosestUnvisitedNodeFromStart();
      let currentNeighbours: Array<NodeTuple> = this.adjacencyList[current];

      currentNeighbours.forEach((neighbour) => {
        if (this.isNeighbourInUnvisited(neighbour)) {
          let distanceToNeighbour: number =
            this.distancesFromStart[current] + 1;
          let neighbourKey = JSON.stringify(neighbour);
          if (distanceToNeighbour < this.distancesFromStart[neighbourKey]) {
            this.distancesFromStart[neighbourKey] = distanceToNeighbour;
            this.previousNode[neighbourKey] = current;
          }
        }
      });

      // current is visited, so remove from unvisited list
      this.unvisited = this.unvisited.filter(
        (node) => JSON.stringify(node) !== current
      );
    }

    let startNode: string = JSON.stringify(this.startNode);
    let endNode: string = JSON.stringify(this.endNode);
    let shortestPath: string[] = [endNode];
    let currentNode: string = endNode;

    while (true) {
      if (currentNode === startNode) {
        break;
      } else {
        currentNode = this.previousNode[currentNode];
        shortestPath.unshift(currentNode);
      }
    }

    return shortestPath;
  }
}

export default graph;
