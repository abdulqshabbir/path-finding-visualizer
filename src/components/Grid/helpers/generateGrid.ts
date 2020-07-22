import { Node } from '../../../algorithms/node'


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