import DeviceBase from './Base';
import Effect from '../Effect';
import Grid from '../Grid';
import {ChromaInstance} from "../ChromaInstance";
import Color from "../Color";
import Key from "../Key";

export class Keyboard extends DeviceBase {
    grid: Grid;
    keys: Grid;
    static Columns: number = 22;
    static Rows: number = 6;

    constructor(){
        super();
        this.device = "keyboard";
        this.grid = new Grid(Keyboard.Rows,Keyboard.Columns,Color.Black);      
        this.keys = new Grid(Keyboard.Rows,Keyboard.Columns,Color.Black);  
        this.setKey = this.setKey.bind(this);
    }

    setAll(color: Color){
        this.grid.set(color);
        this.keys.set(Color.Black);
        this.set();
        return this;
    }
    
    setRow(r:number,color:Color){
        this.grid.setRow(r,color);
        this.set();
        return this;
    }

    setCol(c:number,color:Color){
        this.grid.setCol(c,color);
        this.set();
        return this;
    }

    setPosition(r:number,c:number,color:Color){
        color.isKey = false;
        this.grid.setPosition(r, c, color);
        this.set();
        return this;
    }


    setKey(keyOrArrayOfKeys : Key | Array<Key>, color : Color){
        if (keyOrArrayOfKeys instanceof Array) {
            var keyarray = keyOrArrayOfKeys as Array<Key>;
            keyOrArrayOfKeys.forEach(element => {
                this.setKey(element, color);
            });
            return this;
        } else {
            let row = keyOrArrayOfKeys >> 8;
            let col = keyOrArrayOfKeys & 0xFF;
            color.isKey = true;

            this.keys.setPosition(row,col,color);
            return this;
        }
    }

    set(){
        this.setDeviceEffect(Effect.CHROMA_CUSTOM_KEY, {
            color: this.grid,
            key: this.keys
        });
        return this;
    }

    import(data:any){

    }
}


export default Keyboard;