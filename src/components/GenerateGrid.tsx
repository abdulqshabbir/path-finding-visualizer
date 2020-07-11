import React from "react";
import "./GenerateGrid.css";
import graph, { NodeTuple } from "./Dijkstra";
import { Dropdown } from "semantic-ui-react";

export const NUM_OF_ROWS: number = 20;
export const NUM_OF_COLUMNS: number = 20;

interface State {
  grid: Node[][];
  adjacencyList: AdjacencyListNode;
  startNode: NodeTuple | null;
  endNode: NodeTuple | null;
}

class PathVisualizer extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      grid: generateGrid(NUM_OF_ROWS, NUM_OF_COLUMNS),
      adjacencyList: transformGridToAdjList(
        generateGrid(NUM_OF_ROWS, NUM_OF_COLUMNS)
      ),
      startNode: null,
      endNode: null,
    };
  }

  handleClick(e: React.MouseEvent, row: number, column: number) {
    let updatedGrid = this.state.grid.slice();
    // if start node is not yet selected, select it
    if (this.state.startNode === null) {
      updatedGrid = updatedGrid.map((r) =>
        r.map((n) => {
          if (n.row === row && n.column === column) {
            return {
              ...n,
              isStart: true,
            };
          } else {
            return n;
          }
        })
      );
      this.setState({ startNode: [row, column], grid: updatedGrid });
    }
    // if end node is not yet selected, select it
    else if (this.state.endNode === null) {
      updatedGrid = updatedGrid.map((r) =>
        r.map((n) => {
          if (n.row === row && n.column === column) {
            return {
              ...n,
              isEnd: true,
            };
          } else {
            return n;
          }
        })
      );
      this.setState({ endNode: [row, column], grid: updatedGrid });
    } else {
      this.toggleVisited(row, column);
    }
  }

  toggleVisited(row: number, column: number) {
    let updatedState: Node[][] | null = this.state.grid.slice();
    updatedState[row][column].visited = !updatedState[row][column].visited;
    this.setState({ grid: updatedState });
  }

  toggleHover(e: React.MouseEvent, row: number, column: number) {
    let updatedState: Node[][] = this.state.grid.slice();
    updatedState[row][column].hover = !updatedState[row][column].hover;
    this.setState({ grid: updatedState });
  }

  animateShortestPath(e: React.MouseEvent) {
    // use 'that' to reference the PathVisualizer class from within setTimeout call
    let that = this;
    if (this.state.startNode === null || this.state.endNode === null) {
      return;
    }
    let g = new graph(
      NUM_OF_ROWS,
      NUM_OF_COLUMNS,
      this.state.startNode,
      this.state.endNode
    );
    let shortestPath = g.findShortestPath();

    for (let i = 0; i < shortestPath.length; i++) {
      let node = JSON.parse(shortestPath[i]);
      delayAnimation(node, i);
    }

    function delayAnimation(nodeTuple: NodeTuple, i: number) {
      setTimeout(() => {
        that.setState({ grid: updateVisitedPropertyOfNode(nodeTuple, that) });
      }, 10 * i);
    }

    function updateVisitedPropertyOfNode(
      node: NodeTuple,
      that: PathVisualizer
    ) {
      let [nodeRow, nodeColumn]: [number, number] = node;
      let updatedGrid: Node[][] = that.state.grid.slice();
      return updatedGrid.map((row) =>
        row.map((node) => {
          if (node.row === nodeRow && node.column === nodeColumn) {
            return {
              ...node,
              visited: !node.visited,
            };
          } else {
            return node;
          }
        })
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="menu-container">
          <div className="menu">
            <div className="title">Welcome to Path Finder!</div>
            <div className="algorithms">
              <Dropdown
                placeholder="Select algorithm"
                options={algorithmOptions}
                className="algorithms-dropdown"
              />
            </div>
            <button
              onClick={(e: React.MouseEvent) =>
                this.animateShortestPath.bind(this, e)()
              }
            >
              Start Search
            </button>
          </div>
        </div>
        <div className="grid-container">
          <div className="grid">
            {this.state.grid.map((row) => {
              return row.map((node) => {
                let row = node.row;
                let column = node.column;
                return (
                  <div
                    onClick={(e: React.MouseEvent) =>
                      this.handleClick.bind(this, e, row, column)()
                    }
                    onMouseEnter={(e: React.MouseEvent) => {
                      this.toggleHover.bind(this, e, row, column)();
                    }}
                    onMouseLeave={(e: React.MouseEvent) => {
                      this.toggleHover.bind(this, e, row, column)();
                    }}
                    className={`node 
                  ${node.visited ? "visited" : null} 
                  ${node.hover ? "hover" : null}
                  ${node.isStart ? "start-node" : null}
                  ${node.isEnd ? "end-node" : null}`}
                  ></div>
                );
              });
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export interface Node {
  row: number;
  column: number;
  isStart: boolean;
  isEnd: boolean;
  visited: boolean;
  hover: boolean;
}

export class Node {
  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
    this.isStart = false;
    this.isEnd = false;
    this.visited = false;
    this.hover = false;
  }
}

export function generateGrid(numRows: number, numColumns: number) {
  let grid: Node[][] = [];
  for (let i = 1; i <= numRows; i++) {
    grid[i] = [];
    for (let j = 1; j <= numColumns; j++) {
      grid[i][j] = new Node(i, j);
    }
  }
  return grid;
}

export interface AdjacencyListNode {
  [nodeLocation: string]: Node;
}

export function transformGridToAdjList(grid: Node[][]) {
  let adjList: AdjacencyListNode = {};
  grid.forEach((row) => {
    row.forEach((node) => {
      let nodeLocation = JSON.stringify([node.row, node.column]);
      adjList[nodeLocation] = node;
    });
  });
  return adjList;
}

interface AlgorithmOptions {
  key: string;
  text: string;
  value: string;
}

const algorithmOptions: Array<AlgorithmOptions> = [
  {
    key: "Dijkstra's algorithm",
    text: "Dijkstra's algorithm",
    value: "Dijkstra's algorithm",
  },
  {
    key: "A* search",
    text: "A* search",
    value: "A* search",
  },
];

export default PathVisualizer;
