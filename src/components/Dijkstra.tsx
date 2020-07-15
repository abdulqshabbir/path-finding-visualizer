interface graph {
  startNode: Node;
  endNode: Node;
  grid: Node[][];
  numRows: number;
  numColumns: number;
}

export type NodeTuple = [number, number];

class graph {
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
    if (this.positionIsValid(row) && this.positionIsValid(column - 1)) {
      neighbours.push(this.grid[row][column - 1]);
    }
    if (this.positionIsValid(row - 1) && this.positionIsValid(column)) {
      neighbours.push(this.grid[row - 1][column]);
    }
    if (this.positionIsValid(row + 1) && this.positionIsValid(column)) {
      neighbours.push(this.grid[row + 1][column]);
    }
    if (this.positionIsValid(row) && this.positionIsValid(column + 1)) {
      neighbours.push(this.grid[row][column + 1]);
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
      // note that node is type NodeTuple and the first element stores the row of node and the second element store the column of the node
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
  findShortestPath() {
    // WHILE there is an unvisited node
    // get closestNode from start (call it 'current')
    // look up current's neighbours
    // FOR each neighbour
    // find distance from startNode to that neighbour
    // if distanceToNeighbour < distanceFromStart
    // update distance
    // update previuos
    // mark current as visited
    let unvisitedNodes: Node[] = this.findUnvisitedNodes();

    while (unvisitedNodes.length !== 0) {
      let current: Node = this.findClosestUnvisitedNode(unvisitedNodes);
      let currentNeighbours: Node[] = this.findNeighbours(
        current.row,
        current.column
      );

      currentNeighbours.forEach((neighbour) => {
        if (!this.isNeighbourVisited(neighbour)) {
          let distanceToNeighbour: number = current.distanceFromStart + 1;
          let knownDistance: number = neighbour.distanceFromStart;
          if (distanceToNeighbour < knownDistance) {
            this.grid[neighbour.row][
              neighbour.column
            ].distanceFromStart = distanceToNeighbour;
            this.grid[neighbour.row][neighbour.column].previous = current;
          }
        }
      });

      // current node is now visited, so remove from unvisited list
      unvisitedNodes = unvisitedNodes.filter((node) => {
        if (current.row === node.row && current.column === node.column) {
          // remove current node
          return false;
        } else {
          return true;
        }
      });

      // mark current as visited in grid
      this.grid = this.grid.map((row) => {
        return row.map((node) => {
          if (node.row === current.row && node.column === current.column) {
            return {
              ...node,
              visited: true,
            };
          } else {
            return node;
          }
        });
      });
    }

    let startRow: number = this.startNode.row;
    let startColumn: number = this.startNode.column;
    let endRow: number = this.endNode.row;
    let endColumn: number = this.endNode.column;
    let shortestPath: Node[] = [this.grid[endRow][endColumn]];
    let currentNode: Node = this.grid[endRow][endColumn];
    while (true) {
      if (currentNode.row === startRow && currentNode.column === startColumn) {
        break;
      } else {
        if (currentNode.previous !== null) {
          currentNode = currentNode.previous;
          shortestPath.unshift(currentNode);
        } else {
          break;
        }
      }
    }

    let trimmedShortestPath: NodeTuple[] = shortestPath.map((n) => [
      n.row,
      n.column,
    ]);
    return trimmedShortestPath;
  }
}

export default graph;

interface Node {
  row: number;
  column: number;
  isStart: boolean;
  isEnd: boolean;
  visited: boolean;
  hover: boolean;
  distanceFromStart: number;
  previous: Node | null;
}

class Node {
  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
    this.isStart = false;
    this.isEnd = false;
    this.visited = false;
    this.hover = false;
    this.distanceFromStart = Infinity;
    this.previous = null;
  }
}
