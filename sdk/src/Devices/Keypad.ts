import DeviceBase from './Base';
import Effect from '../Effect';
import Grid from '../Grid';
import {ChromaInstance} from "../ChromaInstance";
import Color from "../Color";

export default class Keypad extends DeviceBase {
    grid: Grid;

    constructor(){
        super();
        this.device = "keypad";
        this.grid = new Grid(4,5);   
    }

    setAll(color: Color){
        this.grid.set(color);
        this.set();
        return this;
    }

    setPosition(r:number,c:number,color:Color){
        this.grid.setPosition(r,c,color);
        this.set();
        return this;
    }

    set(){
        this.setDeviceEffect(Effect.CHROMA_CUSTOM, this.grid.grid);
        return this;
    }
}