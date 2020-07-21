import { Node } from './node'

interface QueueNode {
    value: Node,
    next: QueueNode | null,
    previous: QueueNode | null
}

class QueueNode {
    constructor(value: Node) {
        this.value = value
        this.next = null
        this.previous = null
    }
}

export interface Queue {
    front: QueueNode | null,
    back: QueueNode | null,
    size: number
}

export class Queue {
    constructor() {
        // back -> Qn <-> Qn-1 <-> ... <-> Q1 <- front
        this.front = null
        this.back = null
        this.size = 0
    }
    enqueue(node: Node): number {
        let newNode: QueueNode = new QueueNode(node)
        if (this.size === 0) {
            this.back = newNode
            this.front = newNode
        } else if (this.size > 0 && this.back !== null) {
            let restOfQueue = this.back
            restOfQueue.previous = newNode
            newNode.next = this.front
            this.back = newNode
        }
        this.size++
        return this.size
    }
    dequeue(): Node | null {
        let dNode: Node | null = null // "d node" is the node is the node to be dequeued
        if (this.size === 0) {
            return null
        } else if (this.size === 1 && this.front !== null) {
            dNode = this.front.value
            this.front = null
            this.back = null
            this.size--
            return dNode
        } else if (this.size > 1 && this.front !== null) {
            dNode = this.front.value
            let restOfQueue = this.front.previous
            this.front = restOfQueue
            this.size--
            return dNode
        } else {
            return null
        }
    }
}