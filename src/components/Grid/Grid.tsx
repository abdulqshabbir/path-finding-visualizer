import React from "react";
import "./Grid.css";
import { Dropdown, Button } from "semantic-ui-react";
import { Node, NodeTuple } from "../../algorithms/node";
import { algorithmOptions, speedOptions } from "./helpers/Options";
import { generateGrid } from "./helpers/generateGrid";
import { DFSgraph } from "../../algorithms/dfs_graph";
import { dijkstra_graph } from "../../algorithms/dijkstra_graph";
import { BFSgraph } from "../../algorithms/bfs_graph";
import { aStarGraph } from "../../algorithms/a_star_graph";
import Tutorial from "../Tutorial/Tutorial";

export const NUM_OF_ROWS: number = 15;
export const NUM_OF_COLUMNS: number = 15;
export const WEIGHT: number = 3;

interface State {
  grid: Node[][];
  startNode: Node | null;
  endNode: Node | null;
  currentHoverNode: Node | null;
  inProgress: boolean;
  algorithm: "DFS" | "BFS" | "Dijkstra" | "Astar";
  timeBetweenAnimationFrames: number;
}

class PathVisualizer extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      grid: generateGrid(NUM_OF_ROWS, NUM_OF_COLUMNS),
      startNode: null,
      endNode: null,
      currentHoverNode: null,
      inProgress: false,
      timeBetweenAnimationFrames: 40,
      algorithm: "Dijkstra",
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
      let hoverNode: Node = this.state.grid[row][column];
      updatedState[row][column].hover = !updatedState[row][column].hover;
      this.setState({ grid: updatedState, currentHoverNode: hoverNode });
    }
  }
  handleKeyDown(e: KeyboardEvent) {
    if (
      !this.state.inProgress &&
      this.state.currentHoverNode !== null &&
      e.key === "w"
    ) {
      let updatedGrid: Node[][] = this.state.grid.slice();
      let r: number = this.state.currentHoverNode.row;
      let c: number = this.state.currentHoverNode.column;
      updatedGrid[r][c].isWall = true;
      this.setState({ grid: updatedGrid });
    }
    if (
      !this.state.inProgress &&
      this.state.currentHoverNode !== null &&
      e.key === "W"
    ) {
      let updatedGrid: Node[][] = this.state.grid.slice();
      let r: number = this.state.currentHoverNode.row;
      let c: number = this.state.currentHoverNode.column;
      updatedGrid[r][c].isWall = false;
      this.setState({ grid: updatedGrid });
    }
    if (
      !this.state.inProgress &&
      this.state.currentHoverNode !== null &&
      e.key === "e"
    ) {
      let updatedGrid: Node[][] = this.state.grid.slice();
      let r: number = this.state.currentHoverNode.row;
      let c: number = this.state.currentHoverNode.column;
      updatedGrid[r][c].weight = WEIGHT;
      this.setState({ grid: updatedGrid });
    }

    if (
      !this.state.inProgress &&
      this.state.currentHoverNode !== null &&
      e.key === "E"
    ) {
      let updatedGrid: Node[][] = this.state.grid.slice();
      let r: number = this.state.currentHoverNode.row;
      let c: number = this.state.currentHoverNode.column;
      updatedGrid[r][c].weight = 1;
      this.setState({ grid: updatedGrid });
    }
  }
  generateAnimationFrames() {
    if (this.state.startNode === null || this.state.endNode === null) {
      return {
        path: [],
        gridFrames: [],
      };
    }
    // by default, a BFS search is performed
    let g: DFSgraph | BFSgraph | dijkstra_graph | aStarGraph = new BFSgraph(
      this.state.grid,
      this.state.startNode,
      this.state.endNode,
      NUM_OF_ROWS,
      NUM_OF_COLUMNS
    );

    let path: Node[] = g.breadthFirstSeach()[0];
    let gridFrames: Node[][][] = g.breadthFirstSeach()[1];

    if (this.state.algorithm === "Dijkstra") {
      g = new dijkstra_graph(
        this.state.grid,
        this.state.startNode,
        this.state.endNode,
        NUM_OF_ROWS,
        NUM_OF_COLUMNS
      );
      path = g.dijkstra()[0];
      gridFrames = g.dijkstra()[1];
    } else if (this.state.algorithm === "DFS") {
      g = new DFSgraph(
        this.state.grid,
        this.state.startNode,
        this.state.endNode,
        NUM_OF_ROWS,
        NUM_OF_COLUMNS
      );
      path = g.depthFirstSearch()[0];
      gridFrames = g.depthFirstSearch()[1];
    } else if (this.state.algorithm === "BFS") {
      // do nothing,
      // since BFS is selected by default
    } else if (this.state.algorithm === "Astar") {
      g = new aStarGraph(
        this.state.grid,
        this.state.startNode,
        this.state.endNode,
        NUM_OF_ROWS,
        NUM_OF_COLUMNS
      );
      let result = g.aStarSearch();
      path = result[0];
      gridFrames = result[1];
    }
    return {
      path: path,
      gridFrames: gridFrames,
    };
  }
  handleAllAnimations(e: React.MouseEvent) {
    // use 'that' to reference the PathVisualizer class from within setTimeout call
    let that = this;

    // if startNode and endNode are not selected, do not continue
    if (this.state.startNode === null || this.state.endNode === null) {
      return;
    }

    // path represents the path animated in yellow from start to finish
    // gridFrames reprsents the frame by frame animation for nodes being visited as the algorithm tries to find the end node
    let path = this.generateAnimationFrames().path;
    let gridFrames = this.generateAnimationFrames().gridFrames;

    // keep track of when program is inProgress to prevent user from starting another search while a search is happening
    this.setState({ inProgress: true });

    // create setTimeout calls for animations
    this.animateNodeVisit(gridFrames, that);
    this.animateShortestPath(path, gridFrames, that);
  }
  animateNodeVisit(gridFrames: Node[][][], that: PathVisualizer) {
    // FOR each gridFrame make a call to animate nodeVisitedAnimation
    for (let i = 0; i < gridFrames.length; i++) {
      let frame: Node[][] = gridFrames[i];
      drawVisitedNode(frame, i);
    }
    function drawVisitedNode(frame: Node[][], i: number) {
      setTimeout(() => {
        that.setState({ grid: frame });
      }, i * that.state.timeBetweenAnimationFrames);
    }
  }
  animateShortestPath(
    shortestPath: Node[],
    gridFrames: Node[][][],
    that: PathVisualizer
  ) {
    // FOR each node in shortestPath, make a call to shortestPathAnimation
    for (let i = 0; i < shortestPath.length; i++) {
      let node: Node = shortestPath[i];
      drawShortestPath(node, i);
    }
    function drawShortestPath(node: Node, i: number) {
      setTimeout(() => {
        that.setState({
          grid: that.markAsShortestPathNode(node.row, node.column),
        });
      }, that.state.timeBetweenAnimationFrames * gridFrames.length + that.state.timeBetweenAnimationFrames * i);
    }

    // Mark animation as complete when visited and shortest path animations have completed
    let totalAnimationTime =
      that.state.timeBetweenAnimationFrames * gridFrames.length +
      that.state.timeBetweenAnimationFrames * shortestPath.length;
    setTimeout(() => {
      this.setState({ inProgress: !this.state.inProgress });
    }, totalAnimationTime);
  }
  markAsShortestPathNode(nodeRow: number, nodeColumn: number) {
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
  resetBoard(e: React.MouseEvent) {
    let newGrid: Node[][] = generateGrid(NUM_OF_ROWS, NUM_OF_COLUMNS);

    this.setState({
      grid: newGrid,
      startNode: null,
      endNode: null,
      inProgress: false,
    });
  }
  handleAnimationSpeed(e: any, { value }: any) {
    let speedValue: "Medium" | "Fast" | "Slow" = value;
    if (speedValue === "Slow") {
      this.setState({ timeBetweenAnimationFrames: 400 });
    } else if (speedValue === "Medium") {
      this.setState({ timeBetweenAnimationFrames: 100 });
    } else {
      this.setState({ timeBetweenAnimationFrames: 20 });
    }
  }
  handleAlgorithmSelection(e: any, { value }: any) {
    this.setState({ algorithm: value });
  }
  componentDidMount() {
    document.addEventListener("keypress", (e: KeyboardEvent) => {
      this.handleKeyDown(e);
    });
  }
  componentWillUnmount() {
    document.removeEventListener("keypress", (e: KeyboardEvent) => {
      this.handleKeyDown(e);
    });
  }
  render() {
    return (
      <React.Fragment>
        <div className="app-container">
          <div className="menu-container">
            <div className="menu">
              <div className="title">Path Finder</div>
              <div className="dropdown-container">
                <Dropdown
                  button
                  onChange={this.handleAlgorithmSelection.bind(this)}
                  placeholder="Select algorithm"
                  options={algorithmOptions}
                  className="algorithms"
                  disabled={this.state.inProgress}
                />
              </div>
              <div className="dropdown-container">
                <Dropdown
                  onChange={this.handleAnimationSpeed.bind(this)}
                  button
                  placeholder="Animation Speed"
                  options={speedOptions}
                  className="animation-speed"
                  disabled={this.state.inProgress}
                />
              </div>
              <Button
                disabled={
                  this.state.startNode === null ||
                  this.state.endNode === null ||
                  this.state.inProgress
                }
                onClick={(e: React.MouseEvent) =>
                  this.handleAllAnimations.bind(this, e)()
                }
              >
                Start Search
              </Button>
              <Button
                onClick={(e: React.MouseEvent) => {
                  this.resetBoard.bind(this, e)();
                }}
                disabled={this.state.inProgress}
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
                  const target = node.isEnd ? (
                    <i className="fa fa-bullseye"></i>
                  ) : null;
                  const arrow = node.isStart ? (
                    <i className="fa fa-arrow-right"></i>
                  ) : null;

                  const weight =
                    node.weight === WEIGHT && node.visited === false ? (
                      <i className="fa fa-balance-scale"></i>
                    ) : null;

                  return (
                    <div
                      onClick={(e) =>
                        this.handleClick.bind(this, e, node.row, node.column)()
                      }
                      onMouseEnter={(e) =>
                        this.toggleHover.bind(this, e, node.row, node.column)()
                      }
                      onMouseLeave={(e) =>
                        this.toggleHover.bind(this, e, node.row, node.column)()
                      }
                      id={`${node.row}-${node.column}`}
                      className={`node
                          ${node.visited ? "visited-node" : null}
                          ${node.hover ? "hover-node" : null}
                          ${node.isStart ? "start-node" : null}
                          ${node.isEnd ? "end-node" : null}
                          ${node.isInShortestPath ? "shortest-path-node" : null}
                          ${node.isWall ? "wall-node" : null}
                          ${node.weight === WEIGHT ? "weight-node" : null}
                    `}
                    >
                      {target}
                      {arrow}
                      {weight}
                    </div>
                  );
                });
              })}
            </div>
          </div>
          <Tutorial />
        </div>
      </React.Fragment>
    );
  }
}

export default PathVisualizer;
