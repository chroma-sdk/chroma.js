import { Color } from "./Color";

export default class Grid {
    grid: Color[][];
    rows: number;
    cols: number;
    initialValue: Color;
    isExtended: boolean = false;

    constructor(rows: number, cols: number, initialValue: Color= Color.Black){
        this.rows = rows;
        this.cols = cols;
        this.initialValue = initialValue;
        this.grid = [];
    }

    setPosition(r: number, c: number, value: Color){
        if (r === undefined || this.rows <= r || r < 0) throw Error("Index out of range [row]");
        if (c === undefined || this.cols <= c || c < 0) throw Error("Index out of range [col]");
        if (this.grid[r] === undefined) this.grid[r] = [];
        this.grid[r][c] = value;
    }

    setRow(r: number, value: Color){
        if (r === undefined || this.rows <= r || r < 0) throw Error("Index out of range [row] " + this.rows + " - " + r);
        if (this.grid[r] === undefined) this.grid[r] = [];

        for (let c = 0; c < this.cols; c++) {
            this.grid[r][c] = value;
        }
    }

    setCol(c: number, value: Color){
        if (c === undefined || this.cols <= c || c < 0) throw Error("Index out of range [col]");
        for (let r = 0; r < this.rows; r++) {
            if (this.grid[r] === undefined) this.grid[r] = [];
            this.grid[r][c] = value;
        }
    }

    set(value: Color){
        for (let r = 0; r < this.rows; r++) {
            if (this.grid[r] === undefined) this.grid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.grid[r][c] = value;
            }
        }
    }

    getPosition(r: number, c: number){
        if (this.grid[r] !== undefined && this.grid[r][c] !== undefined){
            return this.grid[r][c];
        }
        return null;
    }

    toJSON(){
        if (!this.isExtended){
            this.isExtended = true;
            for (let r = 0; r < this.rows; r++) {
                if (this.grid[r] === undefined) this.grid[r] = [];
                for (let c = 0; c < this.cols; c++) {
                    if (this.grid[r][c] === undefined)
                        this.grid[r][c] = this.initialValue;
                }
            }
        }
        return this.grid;
    }

}
