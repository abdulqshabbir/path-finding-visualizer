import React, { Component } from "react";
import { Node } from "../../algorithms/node";

interface Props {
  handleMouseClick: (e: React.MouseEvent) => any;
  handleMouseEnter: (e: React.MouseEvent) => any;
  handleMouseLeave: (e: React.MouseEvent) => any;
  node: Node;
  target: any;
  arrow: any;
}

export class GridNode extends Component<Props> {
  render() {
    let node = this.props.node;
    let target = this.props.target;
    let arrow = this.props.arrow;
    return (
      <div
        onClick={(e) => this.props.handleMouseClick(e)}
        onMouseEnter={(e) => this.props.handleMouseEnter(e)}
        onMouseLeave={(e) => this.props.handleMouseLeave(e)}
        className={`node
                ${node.visited ? "visited-node" : null}
                ${node.hover ? "hover" : null}
                ${node.isStart ? "start-node" : null}
                ${node.isEnd ? "end-node" : null}
                ${node.isInShortestPath ? "shortest-path-node" : null}
          `}
      >
        {target}
        {arrow}
      </div>
    );
  }
}
