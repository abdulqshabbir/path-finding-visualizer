import React, { Component } from "react";
import { Node } from "../../algorithms/node";

interface Props {
  handleMouseClick: (e: React.MouseEvent) => any;
  handleMouseEnter: (e: React.MouseEvent) => any;
  handleMouseLeave: (e: React.MouseEvent) => any;
  node: Node;
}

export class GridNode extends Component<Props> {
  render() {
    let node = this.props.node;
    let target = node.isEnd ? <i className="fa fa-bullseye"></i> : null;
    let arrow = node.isStart ? <i className="fa fa-arrow-right"></i> : null;
    return (
      <div
        onClick={(e) => this.props.handleMouseClick(e)}
        onMouseEnter={(e) => this.props.handleMouseEnter(e)}
        onMouseLeave={(e) => this.props.handleMouseLeave(e)}
        className={`node
                ${node.visited ? "visited-node" : null}
                ${node.hover ? "hover-node" : null}
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
