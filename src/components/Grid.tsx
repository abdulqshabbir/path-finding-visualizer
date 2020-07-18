import React from "react";
import "./Grid.css";
import graph from "./Dijkstra";
import { Dropdown, Button } from "semantic-ui-react";
import { Node, NodeTuple } from "./Node";

export const NUM_OF_ROWS: number = 15;
export const NUM_OF_COLUMNS: number = 15;

interface State {
  grid: Node[][];
  startNode: Node | null;
  endNode: Node | null;
  inProgress: boolean;
  timeBetweenAnimationFrames: number;
}

class PathVisualizer extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      grid: generateGrid(NUM_OF_ROWS, NUM_OF_COLUMNS),
      startNode: null,
      endNode: null,
      inProgress: false,
      timeBetweenAnimationFrames: 40,
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
              distanceFromStart: 0,
              isStart: true,
            };
          } else {
            return n;
          }
        })
      );
      let startNode = new Node(row, column);
      this.setState({
        startNode: { ...startNode, isStart: true, distanceFromStart: 0 },
        grid: updatedGrid,
      });
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

      let endNode = new Node(row, column);
      this.setState({
        endNode: { ...endNode, isEnd: true },
        grid: updatedGrid,
      });
    }
  }
  toggleHover(e: React.MouseEvent, row: number, column: number) {
    // note: turn off hover effect if animation is in progress
    // note: do not apply hover effect to start and end node when they have been selected
    if (!this.state.inProgress) {
      let updatedState: Node[][] = this.state.grid.slice();
      updatedState[row][column].hover = !updatedState[row][column].hover;
      this.setState({ grid: updatedState });
    }
  }
  visitNodesAnimation(gridFrames: Node[][][], that: PathVisualizer) {
    // FOR each gridFrame make a call to animate nodeVisitedAnimation
    for (let i = 0; i < gridFrames.length; i++) {
      let frame: Node[][] = gridFrames[i];
      nodeVisitedAnimation(frame, i);
    }
    function nodeVisitedAnimation(frame: Node[][], i: number) {
      setTimeout(() => {
        that.setState({ grid: frame });
      }, i * that.state.timeBetweenAnimationFrames);
    }
  }
  shortestPathAnimation(
    shortestPath: Node[],
    gridFrames: Node[][][],
    that: PathVisualizer
  ) {
    // FOR each node in shortestPath, make a call to shortestPathAnimation
    for (let i = 0; i < shortestPath.length; i++) {
      let node: Node = shortestPath[i];
      shortestPathAnimation(node, i);
    }
    function shortestPathAnimation(node: Node, i: number) {
      setTimeout(() => {
        that.setState({
          grid: that.markNodeWithinShortestPath(node.row, node.column),
        });
      }, that.state.timeBetweenAnimationFrames * gridFrames.length + that.state.timeBetweenAnimationFrames * i);
    }
  }
  markNodeWithinShortestPath(nodeRow: number, nodeColumn: number) {
    let updatedGrid = this.state.grid.slice().map((row) =>
      row.map((node) => {
        if (node.row === nodeRow && node.column === nodeColumn) {
          return {
            ...node,
            visited: false,
            isInShortestPath: true,
          };
        } else {
          return node;
        }
      })
    );
    return updatedGrid;
  }
  updateVisitedPropertyOfNode(node: NodeTuple, that: PathVisualizer) {
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
  animateShortestPath(e: React.MouseEvent) {
    // use 'that' to reference the PathVisualizer class from within setTimeout call
    let that = this;

    // if startNode and endNode are not selected, do not continue
    if (this.state.startNode === null || this.state.endNode === null) {
      return;
    }
    // create graph and find shortest path
    let g = new graph(
      this.state.grid,
      this.state.startNode,
      this.state.endNode,
      NUM_OF_ROWS,
      NUM_OF_COLUMNS
    );

    let shortestPath: Node[] = g.findShortestPath()[0];
    let gridFrames: Node[][][] = g.findShortestPath()[1];

    // keep track of when program is inProgress to prevent user from starting another search while a search is happening
    this.setState({ inProgress: true });

    // this function will animate the process by which nodes are visited
    this.visitNodesAnimation(gridFrames, that);

    this.shortestPathAnimation(shortestPath, gridFrames, that);
  }
  resetBoard(e: React.MouseEvent) {
    let newGrid: Node[][] = generateGrid(NUM_OF_ROWS, NUM_OF_COLUMNS);

    this.setState({
      grid: newGrid,
      startNode: null,
      endNode: null,
      inProgress: false,
    });
  }
  handleDropdown(e: any, { value }: any) {
    let speedValue: "Medium" | "Fast" | "Slow" = value;
    if (speedValue === "Slow") {
      this.setState({ timeBetweenAnimationFrames: 400 });
    } else if (speedValue === "Medium") {
      this.setState({ timeBetweenAnimationFrames: 100 });
    } else {
      this.setState({ timeBetweenAnimationFrames: 20 });
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="menu-container">
          <div className="menu">
            <div className="title">Path Finder</div>
            <div className="dropdown-container">
              <Dropdown
                button
                placeholder="Select algorithm"
                options={algorithmOptions}
                className="algorithms"
              />
            </div>
            <div className="dropdown-container">
              <Dropdown
                onChange={this.handleDropdown.bind(this)}
                button
                placeholder="Select Speed"
                options={speedOptions}
                className="speed"
              />
            </div>
            <Button
              disabled={
                this.state.startNode &&
                this.state.endNode &&
                !this.state.inProgress
                  ? false
                  : true
              }
              onClick={(e: React.MouseEvent) =>
                this.animateShortestPath.bind(this, e)()
              }
            >
              Start Search
            </Button>
            <Button
              onClick={(e: React.MouseEvent) => {
                this.resetBoard.bind(this, e)();
              }}
            >
              Reset Board
            </Button>
          </div>
        </div>
        <div className="grid-container">
          <div
            className={"grid"}
            style={!this.state.inProgress ? { cursor: "pointer" } : {}}
          >
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
                  ${node.visited ? "visited-node" : null} 
                  ${node.hover ? "hover" : null}
                  ${node.isStart ? "start-node" : null}
                  ${node.isEnd ? "end-node" : null}
                  ${node.isInShortestPath ? "shortest-path-node" : null}
                  `}
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
function generateGrid(numRows: number, numColumns: number) {
  let grid: Node[][] = [];
  for (let i = 1; i <= numRows; i++) {
    grid[i] = [];
    for (let j = 1; j <= numColumns; j++) {
      grid[i][j] = new Node(i, j);
    }
  }
  return grid;
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

interface SpeedOptions {
  key: string;
  text: string;
  value: string;
}

const speedOptions: SpeedOptions[] = [
  {
    key: "Fast",
    text: "Fast",
    value: "Fast",
  },
  {
    key: "Medium",
    text: "Medium",
    value: "Medium",
  },
  {
    key: "Slow",
    text: "Slow",
    value: "Slow",
  },
];

export default PathVisualizer;
