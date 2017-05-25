import DeviceBase from './Base';
import Effect from '../Effect';
import Grid from '../Grid';
import {ChromaInstance} from "../ChromaInstance";
import Color from "../Color";

export default class Mousepad extends DeviceBase {
    grid: Grid;

    constructor(){
        super();
        this.device = "mousepad";
        this.grid = new Grid(1,15);   
    }

    setAll(color:Color){
        this.grid.set(color);
        this.set();
        return this;
    }

    setPosition(c:number,color:Color){
        this.grid.setPosition(0,c,color);
        this.set();
        return this;
    }

    set(){
        this.setDeviceEffect(Effect.CHROMA_CUSTOM, this.grid.grid[0]);
        return this;
    }
}