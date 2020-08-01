import { Node } from './node'

/*
    Create a priority queue that will store an array of nodes.
    The node with a lower 'fCost' will be considered to be of 'higher priority'
    than a node with higher 'fCost'
*/

export interface PriorityQueue {
    values: Node[]
    // e.g. this.values = [node1, node2, ..., nodeN]
}

export interface ChildNodeAndIndex {
    idx: number,
    node: Node
}

export class PriorityQueue {
    constructor() {
        this.values = []
    }
    enqueue(node: Node, fCost: number) {
        node = { ...node, fCost: fCost }
        this.values.push(node)
        this.bubbleUp()
    }
    dequeue(): Node | null {
        if (this.values.length === 0) {
            return null
        }
        else {
            // swap first and last elements in priority queue
            this.swap(0, this.values.length - 1)

            // pop off the last element which has lowest f cost
            let dequeuedNode = this.values.pop()
            if (dequeuedNode === undefined) return null

            // call sink the first element in queue down to correct position
            this.sinkDown()

            return dequeuedNode
        }
    }
    sinkDown(): void {
        let parentIdx = 0
        while (true) {
            let parentNode = this.values[parentIdx]
            let lowestFCostChild = this.getLowestFCostChild(parentIdx)

            if (lowestFCostChild === null) {
                return
            }
            else if (parentNode.fCost > lowestFCostChild.node.fCost) {
                this.swap(parentIdx, lowestFCostChild.idx)
                parentIdx = lowestFCostChild.idx
            } else {
                return
            }
        }
    }
    getLowestFCostChild(parentIdx: number): ChildNodeAndIndex | null {
        let childAIdx = parentIdx * 2 + 1
        let childBIdx = parentIdx * 2 + 2

        if (childAIdx >= this.values.length && childBIdx >= this.values.length) {
            return null
        } else if (childBIdx >= this.values.length) {
            return { idx: childAIdx, node: this.values[childAIdx] }
        } else if (childAIdx >= this.values.length) {
            return { idx: childBIdx, node: this.values[childBIdx] }
        } else {
            let childA = this.values[childAIdx]
            let childB = this.values[childBIdx]

            if (childA.fCost < childB.fCost) {
                return { idx: childAIdx, node: childA }
            }
            if (childB.fCost < childA.fCost) {
                return { idx: childBIdx, node: childB }
            }
            if (childA.fCost === childB.fCost) {
                return { idx: childAIdx, node: childA }
            }
            return null
        }


    }
    bubbleUp(): void {
        let bubbleIdx: number, bubbleNode: Node
        let parentIdx: number | null, parentNode: Node

        bubbleIdx = this.values.length - 1
        while (true) {
            parentIdx = this.getParentIdx(bubbleIdx)
            if (parentIdx === null || this.values.length === 1) {
                return
            } else {
                parentNode = this.values[parentIdx]
                bubbleNode = this.values[bubbleIdx]
                if (bubbleNode.fCost < parentNode.fCost) {
                    this.swap(bubbleIdx, parentIdx)
                    bubbleIdx = parentIdx
                } else {
                    return
                }
            }
        }
    }
    getParentIdx(childIdx: number) {
        let parentIdx = Math.floor((childIdx - 1) / 2)
        if (childIdx < 0 || childIdx >= this.values.length) {
            // invalid child index
            return null
        }
        if (parentIdx < 0) {
            // invalid parent index 
            return null
        }
        return parentIdx
    }
    swap(idxA: number, idxB: number): void {
        // swap elements at idxA and idxB
        let temp = this.values[idxA]
        this.values[idxA] = this.values[idxB]
        this.values[idxB] = temp
    }
    print() {
        console.log(this.values)
    }
}